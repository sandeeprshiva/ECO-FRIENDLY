const transactionService = require('../services/transactionService');
const paymentService = require('../services/paymentService');

class TransactionController {
  async initiateTransaction(req, res) {
    try {
      const buyerId = req.user.id;
      const transactionData = {
        ...req.body,
        buyerId
      };

      const result = await paymentService.initiateTransaction(transactionData);

      res.status(201).json({
        message: 'Transaction initiated successfully',
        data: {
          transaction: result.transaction,
          paymentIntent: result.paymentIntent
        }
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to initiate transaction',
        message: error.message
      });
    }
  }

  async processPayment(req, res) {
    try {
      const { paymentIntentId } = req.body;

      if (!paymentIntentId) {
        return res.status(400).json({
          error: 'Payment intent ID is required'
        });
      }

      const transaction = await paymentService.processPayment(paymentIntentId);

      res.json({
        message: 'Payment processed successfully',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Payment processing failed',
        message: error.message
      });
    }
  }

  async createTransaction(req, res) {
    try {
      const buyerId = req.user.id;
      const transactionData = req.body;

      const transaction = await transactionService.createTransaction(transactionData, buyerId);

      res.status(201).json({
        message: 'Transaction created successfully',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to create transaction',
        message: error.message
      });
    }
  }

  async getTransactions(req, res) {
    try {
      const filters = req.query;
      const result = await transactionService.getTransactions(filters);

      res.json({
        message: 'Transactions retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch transactions',
        message: error.message
      });
    }
  }

  async getTransactionById(req, res) {
    try {
      const { id } = req.params;
      
      const transaction = await transactionService.getTransactionById(id);

      res.json({
        message: 'Transaction retrieved successfully',
        data: transaction
      });
    } catch (error) {
      res.status(404).json({
        error: 'Transaction not found',
        message: error.message
      });
    }
  }

  async updateTransactionStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const userId = req.user.id;

      const transaction = await transactionService.updateTransactionStatus(id, status, notes, userId);

      res.json({
        message: 'Transaction status updated successfully',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to update transaction status',
        message: error.message
      });
    }
  }

  async cancelTransaction(req, res) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.user.id;

      const transaction = await transactionService.cancelTransaction(id, reason, userId);

      res.json({
        message: 'Transaction cancelled successfully',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to cancel transaction',
        message: error.message
      });
    }
  }

  async processRefund(req, res) {
    try {
      const { id } = req.params;
      const { amount, reason } = req.body;
      const processedBy = req.user.id;

      const transaction = await transactionService.processRefund(id, amount, reason, processedBy);

      res.json({
        message: 'Refund processed successfully',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to process refund',
        message: error.message
      });
    }
  }

  async getTransactionStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await transactionService.getTransactionStats(userId);

      res.json({
        message: 'Transaction statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch transaction statistics',
        message: error.message
      });
    }
  }

  async getUserTransactions(req, res) {
    try {
      const userId = req.user.id;
      const filters = req.query;

      const result = await transactionService.getUserTransactions(userId, filters);

      res.json({
        message: 'User transactions retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch user transactions',
        message: error.message
      });
    }
  }

  async getUserTransactionHistory(req, res) {
    try {
      const { id: userId } = req.params;
      const filters = req.query;

      // Check if user is requesting their own history or is admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Unauthorized to view this user\'s transaction history'
        });
      }

      const result = await paymentService.getUserTransactionHistory(userId, filters);

      res.json({
        message: 'User transaction history retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch user transaction history',
        message: error.message
      });
    }
  }

  async initiateSwap(req, res) {
    try {
      const initiatorId = req.user.id;
      const swapData = {
        ...req.body,
        initiatorId
      };

      const result = await paymentService.initiateSwap(swapData);

      res.status(201).json({
        message: 'Swap initiated successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to initiate swap',
        message: error.message
      });
    }
  }

  async confirmSwap(req, res) {
    try {
      const { transactionId } = req.params;
      const userId = req.user.id;

      // Verify user is part of this transaction
      const transaction = await transactionService.getTransactionById(transactionId);
      if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
        return res.status(403).json({
          error: 'Unauthorized to confirm this swap'
        });
      }

      const result = await paymentService.confirmSwap(transactionId);

      res.json({
        message: 'Swap confirmed successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to confirm swap',
        message: error.message
      });
    }
  }

  async initiateBorrow(req, res) {
    try {
      const borrowerId = req.user.id;
      const borrowData = {
        ...req.body,
        borrowerId
      };

      const transaction = await paymentService.initiateBorrow(borrowData);

      res.status(201).json({
        message: 'Borrow initiated successfully',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to initiate borrow',
        message: error.message
      });
    }
  }

  async confirmBorrow(req, res) {
    try {
      const { transactionId } = req.params;
      const userId = req.user.id;

      // Verify user is the lender
      const transaction = await transactionService.getTransactionById(transactionId);
      if (transaction.sellerId !== userId) {
        return res.status(403).json({
          error: 'Unauthorized to confirm this borrow'
        });
      }

      await transaction.updateStatus('confirmed');

      res.json({
        message: 'Borrow confirmed successfully',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to confirm borrow',
        message: error.message
      });
    }
  }

  async returnItem(req, res) {
    try {
      const { transactionId } = req.params;
      const userId = req.user.id;

      // Verify user is the borrower
      const transaction = await transactionService.getTransactionById(transactionId);
      if (transaction.buyerId !== userId) {
        return res.status(403).json({
          error: 'Unauthorized to return this item'
        });
      }

      await transaction.updateStatus('returned');

      res.json({
        message: 'Item returned successfully',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to return item',
        message: error.message
      });
    }
  }

  async handleStripeWebhook(req, res) {
    try {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.log(`Webhook signature verification failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      await paymentService.handleStripeWebhook(event);

      res.json({ received: true });
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(500).json({
        error: 'Webhook processing failed',
        message: error.message
      });
    }
  }
}

module.exports = new TransactionController();
