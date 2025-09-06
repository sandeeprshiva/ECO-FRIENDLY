const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validation');
const { 
  registerLimiter, 
  loginLimiter, 
  passwordResetLimiter, 
  authLimiter 
} = require('../middleware/rateLimiter');

// Authentication routes with rate limiting
router.post('/register', registerLimiter, validateUserRegistration, authController.register);
router.post('/login', loginLimiter, validateUserLogin, authController.login);
router.post('/logout', authLimiter, authenticateToken, authController.logout);
router.get('/profile', authLimiter, authenticateToken, authController.getProfile);
router.put('/profile', authLimiter, authenticateToken, authController.updateProfile);
router.post('/refresh', authLimiter, authController.refreshToken);
router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);
router.post('/reset-password', passwordResetLimiter, authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authLimiter, authenticateToken, authController.resendVerification);

module.exports = router;
