const analyticsService = require('../services/analyticsService');
const greenScoreService = require('../services/greenScoreService');
const achievementService = require('../services/achievementService');

class AnalyticsController {
  async getUserAnalytics(req, res) {
    try {
      const { id: userId } = req.params;
      const { timeRange = '30d' } = req.query;

      // Check if user is requesting their own analytics or is admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Unauthorized to view this user\'s analytics'
        });
      }

      const analytics = await analyticsService.getUserAnalytics(userId, timeRange);

      res.json({
        message: 'User analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch user analytics',
        message: error.message
      });
    }
  }

  async getCommunityAnalytics(req, res) {
    try {
      const { timeRange = '30d' } = req.query;

      const analytics = await analyticsService.getCommunityAnalytics(timeRange);

      res.json({
        message: 'Community analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch community analytics',
        message: error.message
      });
    }
  }

  async getGreenScoreLeaderboard(req, res) {
    try {
      const { timeRange = '30d', limit = 10 } = req.query;

      const leaderboard = await greenScoreService.getGreenScoreLeaderboard(
        parseInt(limit),
        timeRange
      );

      res.json({
        message: 'Green Score leaderboard retrieved successfully',
        data: leaderboard
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch Green Score leaderboard',
        message: error.message
      });
    }
  }

  async getUserGreenScoreHistory(req, res) {
    try {
      const { id: userId } = req.params;
      const { days = 30 } = req.query;

      // Check if user is requesting their own history or is admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Unauthorized to view this user\'s Green Score history'
        });
      }

      const history = await greenScoreService.getUserGreenScoreHistory(
        userId,
        parseInt(days)
      );

      res.json({
        message: 'Green Score history retrieved successfully',
        data: history
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch Green Score history',
        message: error.message
      });
    }
  }

  async getUserAchievements(req, res) {
    try {
      const { id: userId } = req.params;

      // Check if user is requesting their own achievements or is admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Unauthorized to view this user\'s achievements'
        });
      }

      const achievements = await achievementService.getUserAchievements(userId);

      res.json({
        message: 'User achievements retrieved successfully',
        data: achievements
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch user achievements',
        message: error.message
      });
    }
  }

  async getAchievementLeaderboard(req, res) {
    try {
      const { limit = 10 } = req.query;

      const leaderboard = await achievementService.getLeaderboard(parseInt(limit));

      res.json({
        message: 'Achievement leaderboard retrieved successfully',
        data: leaderboard
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch achievement leaderboard',
        message: error.message
      });
    }
  }

  async checkAchievements(req, res) {
    try {
      const userId = req.user.id;

      const earnedAchievements = await achievementService.checkAndAwardAchievements(userId);

      res.json({
        message: 'Achievements checked successfully',
        data: {
          earnedAchievements,
          count: earnedAchievements.length
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to check achievements',
        message: error.message
      });
    }
  }

  async getAchievementProgress(req, res) {
    try {
      const { achievementId } = req.params;
      const userId = req.user.id;

      const progress = await achievementService.getAchievementProgress(userId, achievementId);

      if (!progress) {
        return res.status(404).json({
          error: 'Achievement not found'
        });
      }

      res.json({
        message: 'Achievement progress retrieved successfully',
        data: progress
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch achievement progress',
        message: error.message
      });
    }
  }

  async markAchievementAsNotified(req, res) {
    try {
      const { userAchievementId } = req.params;
      const userId = req.user.id;

      // Verify ownership
      const userAchievement = await UserAchievement.findByPk(userAchievementId);
      if (!userAchievement || userAchievement.userId !== userId) {
        return res.status(403).json({
          error: 'Unauthorized to modify this achievement'
        });
      }

      await achievementService.markAsNotified(userAchievementId);

      res.json({
        message: 'Achievement marked as notified successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to mark achievement as notified',
        message: error.message
      });
    }
  }

  async getEcoImpactAnalytics(req, res) {
    try {
      const { id: userId } = req.params;
      const { timeRange = '30d' } = req.query;

      // Check if user is requesting their own analytics or is admin
      if (req.user.id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({
          error: 'Unauthorized to view this user\'s eco impact analytics'
        });
      }

      const analytics = await analyticsService.getUserEcoImpactStats(userId, timeRange);

      res.json({
        message: 'Eco impact analytics retrieved successfully',
        data: analytics
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch eco impact analytics',
        message: error.message
      });
    }
  }

  async getCommunityEcoImpact(req, res) {
    try {
      const { timeRange = '30d' } = req.query;

      const analytics = await analyticsService.getCommunityAnalytics(timeRange);

      res.json({
        message: 'Community eco impact retrieved successfully',
        data: {
          totalCo2Saved: analytics.communityStats.ecoImpact.totalCo2Saved,
          totalWaterSaved: analytics.communityStats.ecoImpact.totalWaterSaved,
          totalWasteReduced: analytics.communityStats.ecoImpact.totalWasteReduced,
          totalEnergySaved: analytics.communityStats.ecoImpact.totalEnergySaved,
          leaderboard: analytics.ecoImpactLeaderboard
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch community eco impact',
        message: error.message
      });
    }
  }
}

module.exports = new AnalyticsController();
