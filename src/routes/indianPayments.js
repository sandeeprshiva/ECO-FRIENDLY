const express = require('express');
const router = express.Router();
const indianPaymentController = require('../controllers/indianPaymentController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Payment initiation and processing
router.post('/initiate', authenticateToken, indianPaymentController.initiatePayment);
router.post('/process', authenticateToken, indianPaymentController.processPayment);
router.post('/webhook', express.raw({type: 'application/json'}), indianPaymentController.handleRazorpayWebhook);

// Quick donation options
router.get('/donations/quick-options/:ngoId', optionalAuth, indianPaymentController.getQuickDonationOptions);

// EMI options
router.get('/emi/quote', optionalAuth, indianPaymentController.getEMIQuote);

// GST calculations
router.post('/gst/calculate', optionalAuth, indianPaymentController.calculateGST);
router.post('/gst/calculate-multiple', optionalAuth, indianPaymentController.calculateGSTForMultipleItems);
router.get('/gst/rates', optionalAuth, indianPaymentController.getGSTRates);
router.get('/gst/breakdown', optionalAuth, indianPaymentController.getGSTBreakdown);
router.post('/gst/validate', optionalAuth, indianPaymentController.validateGSTNumber);
router.get('/gst/compliance', optionalAuth, indianPaymentController.getGSTComplianceInfo);

// GST invoice generation
router.get('/gst/invoice/:transactionId', authenticateToken, indianPaymentController.generateGSTInvoice);

// Payment methods
router.get('/methods', optionalAuth, indianPaymentController.getPaymentMethods);

module.exports = router;
