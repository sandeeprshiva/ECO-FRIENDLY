const indianPaymentService = require('../services/indianPaymentService');
const gstService = require('../services/gstService');

class IndianPaymentController {
  async initiatePayment(req, res) {
    try {
      const buyerId = req.user.id;
      const paymentData = {
        ...req.body,
        buyerId
      };

      const result = await indianPaymentService.initiateIndianPayment(paymentData);

      res.status(201).json({
        message: 'Indian payment initiated successfully',
        data: {
          transaction: result.transaction,
          order: result.order,
          gstCalculation: result.gstCalculation,
          paymentMethods: result.paymentMethods
        }
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to initiate Indian payment',
        message: error.message
      });
    }
  }

  async processPayment(req, res) {
    try {
      const { paymentId, signature } = req.body;

      if (!paymentId || !signature) {
        return res.status(400).json({
          error: 'Payment ID and signature are required'
        });
      }

      // Verify payment signature
      const isValidSignature = await indianPaymentService.verifyPaymentSignature(paymentId, signature);
      if (!isValidSignature) {
        return res.status(400).json({
          error: 'Invalid payment signature'
        });
      }

      const transaction = await indianPaymentService.processIndianPayment(paymentId);

      res.json({
        message: 'Indian payment processed successfully',
        data: transaction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Payment processing failed',
        message: error.message
      });
    }
  }

  async getQuickDonationOptions(req, res) {
    try {
      const { ngoId } = req.params;

      if (!ngoId) {
        return res.status(400).json({
          error: 'NGO ID is required'
        });
      }

      const options = await indianPaymentService.getQuickDonationOptions(ngoId);

      res.json({
        message: 'Quick donation options retrieved successfully',
        data: options
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get quick donation options',
        message: error.message
      });
    }
  }

  async getEMIQuote(req, res) {
    try {
      const { amount, months } = req.query;

      if (!amount || !months) {
        return res.status(400).json({
          error: 'Amount and months are required'
        });
      }

      const quote = await indianPaymentService.getEMIQuote(
        parseFloat(amount),
        parseInt(months)
      );

      res.json({
        message: 'EMI quote generated successfully',
        data: quote
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to generate EMI quote',
        message: error.message
      });
    }
  }

  async calculateGST(req, res) {
    try {
      const { amount, category, transactionType, isDonation } = req.body;

      if (!amount || !category) {
        return res.status(400).json({
          error: 'Amount and category are required'
        });
      }

      const gstCalculation = gstService.calculateGST(
        parseFloat(amount),
        category,
        transactionType || 'sale',
        isDonation || false
      );

      res.json({
        message: 'GST calculated successfully',
        data: gstCalculation
      });
    } catch (error) {
      res.status(400).json({
        error: 'GST calculation failed',
        message: error.message
      });
    }
  }

  async calculateGSTForMultipleItems(req, res) {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items)) {
        return res.status(400).json({
          error: 'Items array is required'
        });
      }

      const gstCalculation = gstService.calculateGSTForMultipleItems(items);

      res.json({
        message: 'GST calculated for multiple items successfully',
        data: gstCalculation
      });
    } catch (error) {
      res.status(400).json({
        error: 'GST calculation failed',
        message: error.message
      });
    }
  }

  async getGSTRates(req, res) {
    try {
      const rates = gstService.getGSTRates();

      res.json({
        message: 'GST rates retrieved successfully',
        data: rates
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get GST rates',
        message: error.message
      });
    }
  }

  async getGSTBreakdown(req, res) {
    try {
      const { amount, category } = req.query;

      if (!amount || !category) {
        return res.status(400).json({
          error: 'Amount and category are required'
        });
      }

      const breakdown = gstService.getGSTBreakdown(
        parseFloat(amount),
        category
      );

      res.json({
        message: 'GST breakdown generated successfully',
        data: breakdown
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to generate GST breakdown',
        message: error.message
      });
    }
  }

  async generateGSTInvoice(req, res) {
    try {
      const { transactionId } = req.params;
      const { sellerGST } = req.body;

      // In a real implementation, you would fetch the transaction from database
      const transaction = {
        id: transactionId,
        amount: 1000, // This would come from database
        item: {
          title: 'Sample Item',
          description: 'Sample Description',
          category: 'electronics'
        },
        seller: {
          name: 'Sample Seller'
        },
        buyer: {
          name: 'Sample Buyer'
        },
        paymentMethod: 'UPI',
        status: 'paid',
        paymentId: 'pay_sample123'
      };

      const invoice = gstService.generateGSTInvoice(transaction, sellerGST);

      res.json({
        message: 'GST invoice generated successfully',
        data: invoice
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to generate GST invoice',
        message: error.message
      });
    }
  }

  async validateGSTNumber(req, res) {
    try {
      const { gstNumber } = req.body;

      if (!gstNumber) {
        return res.status(400).json({
          error: 'GST number is required'
        });
      }

      const isValid = gstService.validateGSTNumber(gstNumber);

      res.json({
        message: 'GST number validation completed',
        data: {
          gstNumber,
          isValid
        }
      });
    } catch (error) {
      res.status(400).json({
        error: 'GST number validation failed',
        message: error.message
      });
    }
  }

  async getGSTComplianceInfo(req, res) {
    try {
      const complianceInfo = gstService.getGSTComplianceInfo();

      res.json({
        message: 'GST compliance information retrieved successfully',
        data: complianceInfo
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get GST compliance information',
        message: error.message
      });
    }
  }

  async handleRazorpayWebhook(req, res) {
    try {
      const signature = req.headers['x-razorpay-signature'];
      const body = req.body;

      if (!signature) {
        return res.status(400).json({
          error: 'Razorpay signature is required'
        });
      }

      // Verify webhook signature
      const crypto = require('crypto');
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(JSON.stringify(body))
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).json({
          error: 'Invalid webhook signature'
        });
      }

      await indianPaymentService.handleRazorpayWebhook(body);

      res.json({ received: true });
    } catch (error) {
      console.error('Razorpay webhook error:', error);
      res.status(500).json({
        error: 'Webhook processing failed',
        message: error.message
      });
    }
  }

  async getPaymentMethods(req, res) {
    try {
      const { amount } = req.query;
      const emiOption = req.query.emi === 'true';

      const paymentMethods = indianPaymentService.getAvailablePaymentMethods(
        parseFloat(amount) || 0,
        emiOption
      );

      res.json({
        message: 'Payment methods retrieved successfully',
        data: paymentMethods
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get payment methods',
        message: error.message
      });
    }
  }
}

module.exports = new IndianPaymentController();
