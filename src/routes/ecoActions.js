const express = require('express');
const router = express.Router();
const ecoActionController = require('../controllers/ecoActionController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Eco-actions routes
router.get('/', optionalAuth, ecoActionController.getEcoActions);
router.post('/', authenticateToken, ecoActionController.createEcoAction);
router.get('/stats', ecoActionController.getEcoActionStats);
router.get('/:id', optionalAuth, ecoActionController.getEcoActionById);
router.put('/:id', authenticateToken, ecoActionController.updateEcoAction);
router.delete('/:id', authenticateToken, ecoActionController.deleteEcoAction);
router.patch('/:id/verify', authenticateToken, ecoActionController.verifyEcoAction);

module.exports = router;
