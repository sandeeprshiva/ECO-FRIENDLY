const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// User Analytics
router.get('/user/:id', authenticateToken, analyticsController.getUserAnalytics);
router.get('/user/:id/green-score-history', authenticateToken, analyticsController.getUserGreenScoreHistory);
router.get('/user/:id/achievements', authenticateToken, analyticsController.getUserAchievements);
router.get('/user/:id/eco-impact', authenticateToken, analyticsController.getEcoImpactAnalytics);

// Community Analytics
router.get('/community', optionalAuth, analyticsController.getCommunityAnalytics);
router.get('/community/eco-impact', optionalAuth, analyticsController.getCommunityEcoImpact);

// Leaderboards
router.get('/leaderboard/green-score', optionalAuth, analyticsController.getGreenScoreLeaderboard);
router.get('/leaderboard/achievements', optionalAuth, analyticsController.getAchievementLeaderboard);

// Achievement Management
router.post('/achievements/check', authenticateToken, analyticsController.checkAchievements);
router.get('/achievements/:achievementId/progress', authenticateToken, analyticsController.getAchievementProgress);
router.patch('/achievements/:userAchievementId/notify', authenticateToken, analyticsController.markAchievementAsNotified);

module.exports = router;
