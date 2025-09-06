const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { uploadMultiple } = require('../middleware/imageUpload');

// Item routes
router.get('/', optionalAuth, itemController.getItems);
router.get('/search', optionalAuth, itemController.searchItems);
router.get('/featured', optionalAuth, itemController.getFeaturedItems);
router.get('/filters', optionalAuth, itemController.getAvailableFilters);
router.get('/stats', itemController.getItemStats);
router.get('/my-items', authenticateToken, itemController.getUserItems);
router.get('/:id', optionalAuth, itemController.getItemById);
router.get('/:id/similar', optionalAuth, itemController.getSimilarItems);
router.post('/', authenticateToken, uploadMultiple, itemController.createItem);
router.put('/:id', authenticateToken, uploadMultiple, itemController.updateItem);
router.delete('/:id', authenticateToken, itemController.deleteItem);
router.patch('/:id/restore', authenticateToken, itemController.restoreItem);
router.patch('/:id/sold', authenticateToken, itemController.markItemAsSold);

module.exports = router;
