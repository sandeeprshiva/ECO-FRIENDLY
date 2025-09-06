const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Payment routes
router.post('/initiate', authenticateToken, transactionController.initiateTransaction);
router.post('/payment', authenticateToken, transactionController.processPayment);
router.post('/webhook', express.raw({type: 'application/json'}), transactionController.handleStripeWebhook);

// Swap/Borrow routes
router.post('/swap', authenticateToken, transactionController.initiateSwap);
router.post('/swap/:transactionId/confirm', authenticateToken, transactionController.confirmSwap);
router.post('/borrow', authenticateToken, transactionController.initiateBorrow);
router.post('/borrow/:transactionId/confirm', authenticateToken, transactionController.confirmBorrow);
router.post('/borrow/:transactionId/return', authenticateToken, transactionController.returnItem);

// Transaction management routes
router.get('/', authenticateToken, transactionController.getTransactions);
router.post('/', authenticateToken, transactionController.createTransaction);
router.get('/stats', authenticateToken, transactionController.getTransactionStats);
router.get('/my-transactions', authenticateToken, transactionController.getUserTransactions);
router.get('/user/:id', authenticateToken, transactionController.getUserTransactionHistory);
router.get('/:id', authenticateToken, transactionController.getTransactionById);
router.patch('/:id/status', authenticateToken, transactionController.updateTransactionStatus);
router.patch('/:id/cancel', authenticateToken, transactionController.cancelTransaction);
router.patch('/:id/refund', authenticateToken, transactionController.processRefund);

module.exports = router;
