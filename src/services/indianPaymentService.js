const Razorpay = require('razorpay');
const { Transaction, User, Item, NGO, EcoImpact } = require('../models');
const ecoImpactService = require('./ecoImpactService');
const greenScoreService = require('./greenScoreService');

class IndianPaymentService {
  constructor() {
    // Only initialize Razorpay if credentials are provided
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
      });
    } else {
      console.warn('Razorpay credentials not provided. Indian payment features will be limited.');
      this.razorpay = null;
    }
    
    // GST rates for different categories
    this.gstRates = {
      'electronics': 18, // 18% GST for electronics
      'clothing': 12,    // 12% GST for clothing
      'furniture': 18,   // 18% GST for furniture
      'books': 5,        // 5% GST for books
      'sports': 18,      // 18% GST for sports items
      'beauty': 18,      // 18% GST for beauty products
      'home': 12,        // 12% GST for home items
      'automotive': 28,  // 28% GST for automotive
      'donation': 0,     // 0% GST for donations
      'default': 18      // 18% GST as default
    };

    // Platform fee rates
    this.platformFeeRate = 0.05; // 5% platform fee
    this.razorpayFeeRate = 0.02; // 2% Razorpay fee
    
    // Quick donation amounts
    this.quickDonationAmounts = [100, 500, 1000, 2000, 5000];
    
    // EMI options for high-value items
    this.emiThreshold = 5000; // ₹5000+ for EMI options
    this.emiOptions = [
      { months: 3, interest: 0 },
      { months: 6, interest: 0 },
      { months: 9, interest: 2 },
      { months: 12, interest: 3 }
    ];
  }

  async initiateIndianPayment(paymentData) {
    try {
      if (!this.razorpay) {
        throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
      }
      const {
        buyerId,
        sellerId,
        itemId,
        amount,
        transactionType = 'sale',
        ngoId = null,
        ngoDonation = 0,
        paymentMethod = 'upi', // upi, card, netbanking, wallet
        emiOption = null,
        shippingAddress = null,
        notes = null
      } = paymentData;

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

      // Calculate GST
      const gstCalculation = this.calculateGST(amount, item.category, transactionType);
      
      // Calculate fees
      const platformFee = parseFloat((amount * this.platformFeeRate).toFixed(2));
      const razorpayFee = parseFloat((amount * this.razorpayFeeRate).toFixed(2));
      const netAmount = amount - platformFee - razorpayFee - ngoDonation;

      // Create transaction record
      const transaction = await Transaction.create({
        buyerId,
        sellerId,
        itemId,
        amount,
        status: 'pending',
        platformFee,
        transactionFee: razorpayFee,
        ngoDonation,
        ngoId,
        shippingAddress,
        notes,
        transactionType,
        paymentMethod,
        currency: 'INR',
        gstAmount: gstCalculation.gstAmount,
        gstRate: gstCalculation.gstRate,
        totalAmount: gstCalculation.totalAmount,
        emiOption: emiOption ? JSON.stringify(emiOption) : null
      });

      // Create Razorpay order
      const orderOptions = {
        amount: Math.round(gstCalculation.totalAmount * 100), // Convert to paise
        currency: 'INR',
        receipt: `txn_${transaction.id}`,
        notes: {
          transactionId: transaction.id,
          itemId: itemId,
          buyerId: buyerId,
          sellerId: sellerId,
          transactionType: transactionType,
          paymentMethod: paymentMethod
        },
        payment_capture: 1
      };

      // Add EMI options for high-value items
      if (amount >= this.emiThreshold && emiOption) {
        orderOptions.emi = {
          enabled: true,
          options: this.emiOptions
        };
      }

      const order = await this.razorpay.orders.create(orderOptions);

      // Update transaction with Razorpay order ID
      await transaction.update({
        paymentId: order.id,
        paymentMethod: paymentMethod
      });

      return {
        transaction,
        order: {
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: order.status
        },
        gstCalculation,
        paymentMethods: this.getAvailablePaymentMethods(amount, emiOption)
      };
    } catch (error) {
      throw new Error(`Failed to initiate Indian payment: ${error.message}`);
    }
  }

  async processIndianPayment(paymentId, paymentData) {
    try {
      if (!this.razorpay) {
        throw new Error('Razorpay not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables.');
      }
      // Verify payment with Razorpay
      const payment = await this.razorpay.payments.fetch(paymentId);
      
      if (payment.status !== 'captured') {
        throw new Error('Payment not successful');
      }

      // Find transaction
      const transaction = await Transaction.findOne({
        where: { paymentId: paymentId },
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
      await this.distributeIndianPayment(transaction);

      // Update Green Scores
      await greenScoreService.updateGreenScoreForTransaction(transaction);

      // Create eco impact record
      await this.createEcoImpact(transaction);

      return transaction;
    } catch (error) {
      throw new Error(`Failed to process Indian payment: ${error.message}`);
    }
  }

  calculateGST(amount, category, transactionType) {
    // No GST for donations
    if (transactionType === 'donation') {
      return {
        baseAmount: amount,
        gstRate: 0,
        gstAmount: 0,
        totalAmount: amount
      };
    }

    const gstRate = this.gstRates[category] || this.gstRates.default;
    const gstAmount = parseFloat(((amount * gstRate) / 100).toFixed(2));
    const totalAmount = amount + gstAmount;

    return {
      baseAmount: amount,
      gstRate: gstRate,
      gstAmount: gstAmount,
      totalAmount: totalAmount
    };
  }

  getAvailablePaymentMethods(amount, emiOption) {
    const methods = {
      upi: {
        enabled: true,
        providers: ['google_pay', 'phonepe', 'paytm', 'bharatpe', 'mobikwik']
      },
      card: {
        enabled: true,
        providers: ['visa', 'mastercard', 'rupay', 'amex']
      },
      netbanking: {
        enabled: true,
        providers: ['sbi', 'hdfc', 'icici', 'axis', 'kotak', 'pnb']
      },
      wallet: {
        enabled: true,
        providers: ['paytm', 'mobikwik', 'freecharge', 'jio_money']
      }
    };

    // Add EMI options for high-value items
    if (amount >= this.emiThreshold) {
      methods.emi = {
        enabled: true,
        options: this.emiOptions.map(option => ({
          months: option.months,
          interest: option.interest,
          monthlyAmount: Math.round(amount / option.months)
        }))
      };
    }

    return methods;
  }

  async getQuickDonationOptions(ngoId) {
    try {
      const ngo = await NGO.findByPk(ngoId);
      if (!ngo) {
        throw new Error('NGO not found');
      }

      return this.quickDonationAmounts.map(amount => ({
        amount,
        displayAmount: `₹${amount}`,
        description: this.getDonationDescription(amount),
        ngo: {
          id: ngo.id,
          name: ngo.name,
          logo: ngo.logo
        }
      }));
    } catch (error) {
      throw new Error(`Failed to get quick donation options: ${error.message}`);
    }
  }

  getDonationDescription(amount) {
    const descriptions = {
      100: 'Small contribution to make a difference',
      500: 'Meaningful support for the cause',
      1000: 'Significant impact donation',
      2000: 'Major contribution for change',
      5000: 'Transformational donation'
    };
    return descriptions[amount] || 'Thank you for your generous contribution';
  }

  async distributeIndianPayment(transaction) {
    try {
      const { amount, platformFee, ngoDonation, ngoId, sellerId, gstAmount } = transaction;
      const netAmount = amount - platformFee - transaction.transactionFee - ngoDonation;

      // For donations, send money directly to NGO
      if (transaction.transactionType === 'donation' && ngoId) {
        const ngo = await NGO.findByPk(ngoId);
        if (ngo) {
          await ngo.addDonation(amount);
        }
      } else {
        // For regular sales, seller gets net amount
        // In a real implementation, you would transfer to seller's account
        console.log(`Transfer ₹${netAmount} to seller ${sellerId}`);
      }

      // Platform fee goes to platform account
      console.log(`Platform fee: ₹${platformFee}`);

      // NGO donation (if any)
      if (ngoDonation > 0 && ngoId) {
        const ngo = await NGO.findByPk(ngoId);
        if (ngo) {
          await ngo.addDonation(ngoDonation);
        }
      }

      // GST handling (in real implementation, this would be sent to government)
      console.log(`GST amount: ₹${gstAmount}`);
    } catch (error) {
      throw new Error(`Failed to distribute Indian payment: ${error.message}`);
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

  async handleRazorpayWebhook(event) {
    try {
      switch (event.event) {
        case 'payment.captured':
          await this.processIndianPayment(event.payload.payment.entity.id);
          break;
        case 'payment.failed':
          await this.handlePaymentFailure(event.payload.payment.entity.id);
          break;
        case 'order.paid':
          await this.handleOrderPaid(event.payload.order.entity.id);
          break;
        default:
          console.log(`Unhandled Razorpay event: ${event.event}`);
      }
    } catch (error) {
      console.error('Razorpay webhook error:', error);
      throw error;
    }
  }

  async handlePaymentFailure(paymentId) {
    try {
      const transaction = await Transaction.findOne({
        where: { paymentId: paymentId }
      });

      if (transaction) {
        await transaction.updateStatus('cancelled', 'Payment failed');
      }
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  }

  async handleOrderPaid(orderId) {
    try {
      const transaction = await Transaction.findOne({
        where: { paymentId: orderId }
      });

      if (transaction) {
        await transaction.updateStatus('paid');
      }
    } catch (error) {
      console.error('Error handling order paid:', error);
    }
  }

  async getEMIQuote(amount, months) {
    try {
      if (amount < this.emiThreshold) {
        throw new Error('EMI not available for amounts below ₹5000');
      }

      const emiOption = this.emiOptions.find(option => option.months === months);
      if (!emiOption) {
        throw new Error('Invalid EMI option');
      }

      const interestAmount = (amount * emiOption.interest) / 100;
      const totalAmount = amount + interestAmount;
      const monthlyAmount = Math.round(totalAmount / months);

      return {
        principalAmount: amount,
        interestRate: emiOption.interest,
        interestAmount: interestAmount,
        totalAmount: totalAmount,
        monthlyAmount: monthlyAmount,
        months: months
      };
    } catch (error) {
      throw new Error(`Failed to get EMI quote: ${error.message}`);
    }
  }

  async verifyPaymentSignature(paymentId, signature) {
    try {
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(paymentId)
        .digest('hex');

      return expectedSignature === signature;
    } catch (error) {
      console.error('Error verifying payment signature:', error);
      return false;
    }
  }
}

module.exports = new IndianPaymentService();
