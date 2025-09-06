const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// NGO routes
router.get('/', optionalAuth, ngoController.getNGOs);
router.post('/', authenticateToken, ngoController.createNGO);
router.get('/stats', ngoController.getNGOStats);
router.get('/:id', optionalAuth, ngoController.getNGOById);
router.get('/:id/items', optionalAuth, ngoController.getNGOItems);
router.put('/:id', authenticateToken, ngoController.updateNGO);
router.delete('/:id', authenticateToken, ngoController.deleteNGO);
router.patch('/:id/verify', authenticateToken, ngoController.verifyNGO);
router.post('/:id/review', authenticateToken, ngoController.addNGOReview);

module.exports = router;
