const express = require('express');
const router = express.Router();
const ecoImpactController = require('../controllers/ecoImpactController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// Eco Impact routes
router.get('/', optionalAuth, ecoImpactController.getEcoImpacts);
router.post('/', authenticateToken, ecoImpactController.createEcoImpact);
router.get('/stats', optionalAuth, ecoImpactController.getEcoImpactStats);
router.get('/global-stats', optionalAuth, ecoImpactController.getGlobalEcoImpactStats);
router.get('/category-stats', optionalAuth, ecoImpactController.getEcoImpactByCategory);
router.get('/top-users', optionalAuth, ecoImpactController.getTopEcoUsers);
router.get('/my-impact', authenticateToken, ecoImpactController.getUserEcoImpactStats);
router.get('/:id', optionalAuth, ecoImpactController.getEcoImpactById);
router.put('/:id', authenticateToken, ecoImpactController.updateEcoImpact);
router.delete('/:id', authenticateToken, ecoImpactController.deleteEcoImpact);
router.patch('/:id/verify', authenticateToken, ecoImpactController.verifyEcoImpact);

module.exports = router;
