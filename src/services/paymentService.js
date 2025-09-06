const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Transaction, User, Item, NGO, EcoImpact } = require('../models');
const ecoImpactService = require('./ecoImpactService');
const greenScoreService = require('./greenScoreService');

class PaymentService {
  constructor() {
    this.stripe = stripe;
    this.platformFeeRate = 0.05; // 5% platform fee
    this.transactionFeeRate = 0.029; // 2.9% Stripe fee
  }

  async initiateTransaction(transactionData) {
    try {
      const {
        buyerId,
        sellerId,
        itemId,
        amount,
        transactionType = 'sale',
        ngoId = null,
        ngoDonation = 0,
        shippingAddress = null,
        notes = null
      } = transactionData;

      // Validate item exists and is available
      const item = await Item.findByPk(itemId, {
        include: [
          { model: User, as: 'seller' },
          { model: NGO, as: 'ngo' }
        ]
      });

      if (!item) {
        throw new Error('Item not found');
      }

      if (item.isSold) {
        throw new Error('Item is already sold');
      }

      if (item.sellerId !== sellerId) {
        throw new Error('Seller mismatch');
      }

      // Calculate fees
      const platformFee = parseFloat((amount * this.platformFeeRate).toFixed(2));
      const transactionFee = parseFloat((amount * this.transactionFeeRate).toFixed(2));
      const netAmount = amount - platformFee - transactionFee - ngoDonation;

      // Create transaction record
      const transaction = await Transaction.create({
        buyerId,
        sellerId,
        itemId,
        amount,
        status: 'pending',
        platformFee,
        transactionFee,
        ngoDonation,
        ngoId,
        shippingAddress,
        notes,
        transactionType
      });

      // Create Stripe Payment Intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          transactionId: transaction.id,
          itemId: itemId,
          buyerId: buyerId,
          sellerId: sellerId,
          transactionType: transactionType
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Update transaction with Stripe payment intent ID
      await transaction.update({
        paymentId: paymentIntent.id,
        paymentMethod: 'card'
      });

      return {
        transaction,
        paymentIntent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        }
      };
    } catch (error) {
      throw new Error(`Failed to initiate transaction: ${error.message}`);
    }
  }

  async processPayment(paymentIntentId) {
    try {
      // Retrieve payment intent from Stripe
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
      }

      // Find transaction
      const transaction = await Transaction.findOne({
        where: { paymentId: paymentIntentId },
        include: [
          { model: User, as: 'buyer' },
          { model: User, as: 'seller' },
          { model: Item, as: 'item' },
          { model: NGO, as: 'ngo' }
        ]
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Update transaction status
      await transaction.updateStatus('paid');

      // Mark item as sold
      await transaction.item.markAsSold();

      // Process payment distribution
      await this.distributePayment(transaction);

      // Update Green Scores using the new service
      await greenScoreService.updateGreenScoreForTransaction(transaction);

      // Create eco impact record
      await this.createEcoImpact(transaction);

      return transaction;
    } catch (error) {
      throw new Error(`Failed to process payment: ${error.message}`);
    }
  }

  async distributePayment(transaction) {
    try {
      const { amount, platformFee, ngoDonation, ngoId, sellerId } = transaction;
      const netAmount = amount - platformFee - transaction.transactionFee - ngoDonation;

      // For donations, send money directly to NGO
      if (transaction.transactionType === 'donation' && ngoId) {
        // In a real implementation, you would transfer to NGO's Stripe account
        // For now, we'll just update the NGO's total donations
        const ngo = await NGO.findByPk(ngoId);
        if (ngo) {
          await ngo.addDonation(amount);
        }
      } else {
        // For regular sales, seller gets net amount
        // In a real implementation, you would transfer to seller's account
        console.log(`Transfer ${netAmount} to seller ${sellerId}`);
      }

      // Platform fee goes to platform account
      console.log(`Platform fee: ${platformFee}`);

      // NGO donation (if any)
      if (ngoDonation > 0 && ngoId) {
        const ngo = await NGO.findByPk(ngoId);
        if (ngo) {
          await ngo.addDonation(ngoDonation);
        }
      }
    } catch (error) {
      throw new Error(`Failed to distribute payment: ${error.message}`);
    }
  }

  async updateGreenScores(transaction) {
    try {
      const { buyerId, sellerId, transactionType, amount } = transaction;

      // Calculate Green Score points based on transaction type and amount
      let buyerPoints = 0;
      let sellerPoints = 0;

      switch (transactionType) {
        case 'donation':
          buyerPoints = Math.min(Math.round(amount * 0.1), 100); // Max 100 points
          sellerPoints = Math.min(Math.round(amount * 0.05), 50); // Max 50 points
          break;
        case 'exchange':
          buyerPoints = Math.min(Math.round(amount * 0.05), 50);
          sellerPoints = Math.min(Math.round(amount * 0.05), 50);
          break;
        case 'sale':
          buyerPoints = Math.min(Math.round(amount * 0.02), 20);
          sellerPoints = Math.min(Math.round(amount * 0.03), 30);
          break;
        case 'rental':
          buyerPoints = Math.min(Math.round(amount * 0.01), 10);
          sellerPoints = Math.min(Math.round(amount * 0.02), 20);
          break;
      }

      // Update buyer's Green Score
      if (buyerPoints > 0) {
        const buyer = await User.findByPk(buyerId);
        if (buyer) {
          const newScore = Math.min(buyer.greenScore + buyerPoints, 1000);
          await buyer.update({ greenScore: newScore });
        }
      }

      // Update seller's Green Score
      if (sellerPoints > 0) {
        const seller = await User.findByPk(sellerId);
        if (seller) {
          const newScore = Math.min(seller.greenScore + sellerPoints, 1000);
          await seller.update({ greenScore: newScore });
        }
      }
    } catch (error) {
      console.error('Error updating Green Scores:', error);
    }
  }

  async createEcoImpact(transaction) {
    try {
      const { buyerId, itemId, transactionType } = transaction;

      // Get item details for eco impact calculation
      const item = await Item.findByPk(itemId);
      if (!item || !item.ecoSavings) {
        return;
      }

      // Create eco impact record
      await EcoImpact.create({
        userId: buyerId,
        itemId: itemId,
        transactionId: transaction.id,
        co2Saved: item.ecoSavings.co2Saved || 0,
        waterSaved: item.ecoSavings.waterSaved || 0,
        wasteReduced: item.ecoSavings.wasteReduced || 0,
        energySaved: item.ecoSavings.energySaved || 0,
        treesEquivalent: item.ecoSavings.treesEquivalent || 0,
        impactType: transactionType,
        calculationMethod: 'automatic'
      });

      // Recalculate user's eco impact stats
      await ecoImpactService.updateUserGreenScore(buyerId);
    } catch (error) {
      console.error('Error creating eco impact:', error);
    }
  }

  async initiateSwap(swapData) {
    try {
      const {
        initiatorId,
        targetUserId,
        initiatorItemId,
        targetItemId,
        additionalAmount = 0, // If one item is worth more
        notes = null
      } = swapData;

      // Validate both items exist and are available
      const initiatorItem = await Item.findByPk(initiatorItemId);
      const targetItem = await Item.findByPk(targetItemId);

      if (!initiatorItem || !targetItem) {
        throw new Error('One or both items not found');
      }

      if (initiatorItem.isSold || targetItem.isSold) {
        throw new Error('One or both items are already sold');
      }

      if (initiatorItem.sellerId !== initiatorId || targetItem.sellerId !== targetUserId) {
        throw new Error('Item ownership mismatch');
      }

      // Create swap transaction
      const transaction = await Transaction.create({
        buyerId: initiatorId,
        sellerId: targetUserId,
        itemId: targetItemId,
        amount: additionalAmount,
        status: 'pending',
        transactionType: 'exchange',
        notes: `Swap: ${initiatorItem.title} for ${targetItem.title}`,
        platformFee: 0, // No platform fee for swaps
        transactionFee: 0
      });

      // Create reverse transaction for the other item
      const reverseTransaction = await Transaction.create({
        buyerId: targetUserId,
        sellerId: initiatorId,
        itemId: initiatorItemId,
        amount: 0,
        status: 'pending',
        transactionType: 'exchange',
        notes: `Swap: ${targetItem.title} for ${initiatorItem.title}`,
        platformFee: 0,
        transactionFee: 0
      });

      return {
        transaction,
        reverseTransaction,
        initiatorItem,
        targetItem
      };
    } catch (error) {
      throw new Error(`Failed to initiate swap: ${error.message}`);
    }
  }

  async confirmSwap(transactionId) {
    try {
      const transaction = await Transaction.findByPk(transactionId, {
        include: [
          { model: Item, as: 'item' },
          { model: User, as: 'buyer' },
          { model: User, as: 'seller' }
        ]
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.transactionType !== 'exchange') {
        throw new Error('Not a swap transaction');
      }

      // Update both transactions to completed
      await transaction.updateStatus('completed');
      
      // Mark both items as sold
      await transaction.item.markAsSold();

      // Find and update the reverse transaction
      const reverseTransaction = await Transaction.findOne({
        where: {
          buyerId: transaction.sellerId,
          sellerId: transaction.buyerId,
          itemId: { [Op.ne]: transaction.itemId },
          transactionType: 'exchange',
          status: 'pending'
        }
      });

      if (reverseTransaction) {
        await reverseTransaction.updateStatus('completed');
        await reverseTransaction.item.markAsSold();
      }

      // Update Green Scores for both users
      await this.updateGreenScores(transaction);
      if (reverseTransaction) {
        await this.updateGreenScores(reverseTransaction);
      }

      return { transaction, reverseTransaction };
    } catch (error) {
      throw new Error(`Failed to confirm swap: ${error.message}`);
    }
  }

  async initiateBorrow(borrowData) {
    try {
      const {
        borrowerId,
        lenderId,
        itemId,
        rentalAmount,
        duration, // in days
        startDate,
        endDate,
        notes = null
      } = borrowData;

      // Validate item exists and is available
      const item = await Item.findByPk(itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      if (item.isSold) {
        throw new Error('Item is not available for rental');
      }

      if (item.sellerId !== lenderId) {
        throw new Error('Item ownership mismatch');
      }

      // Calculate fees
      const platformFee = parseFloat((rentalAmount * this.platformFeeRate).toFixed(2));
      const transactionFee = parseFloat((rentalAmount * this.transactionFeeRate).toFixed(2));
      const netAmount = rentalAmount - platformFee - transactionFee;

      // Create rental transaction
      const transaction = await Transaction.create({
        buyerId: borrowerId,
        sellerId: lenderId,
        itemId: itemId,
        amount: rentalAmount,
        status: 'pending',
        transactionType: 'rental',
        platformFee,
        transactionFee,
        estimatedDelivery: new Date(startDate),
        actualDelivery: new Date(endDate),
        notes: `Rental for ${duration} days: ${notes}`
      });

      return transaction;
    } catch (error) {
      throw new Error(`Failed to initiate borrow: ${error.message}`);
    }
  }

  async getUserTransactionHistory(userId, filters = {}) {
    try {
      const {
        status,
        transactionType,
        startDate,
        endDate,
        limit = 20,
        offset = 0,
        role = 'both' // 'buyer', 'seller', 'both'
      } = filters;

      let whereClause = {};
      
      if (role === 'buyer') {
        whereClause.buyerId = userId;
      } else if (role === 'seller') {
        whereClause.sellerId = userId;
      } else {
        whereClause[Op.or] = [
          { buyerId: userId },
          { sellerId: userId }
        ];
      }

      if (status) whereClause.status = status;
      if (transactionType) whereClause.transactionType = transactionType;

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
        if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
      }

      const transactions = await Transaction.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'buyer',
            attributes: ['id', 'name', 'avatar', 'email']
          },
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'avatar', 'email']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'title', 'images', 'price', 'category', 'condition']
          },
          {
            model: NGO,
            as: 'ngo',
            attributes: ['id', 'name', 'logo']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        transactions: transactions.rows,
        total: transactions.count,
        hasMore: transactions.count > offset + parseInt(limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch transaction history: ${error.message}`);
    }
  }

  async handleStripeWebhook(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.processPayment(event.data.object.id);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object.id);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  async handlePaymentFailure(paymentIntentId) {
    try {
      const transaction = await Transaction.findOne({
        where: { paymentId: paymentIntentId }
      });

      if (transaction) {
        await transaction.updateStatus('cancelled', 'Payment failed');
      }
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }
}

module.exports = new PaymentService();
