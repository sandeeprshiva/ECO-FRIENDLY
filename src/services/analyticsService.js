const { User, Item, Transaction, EcoImpact, sequelize } = require('../models');
const { Op } = require('sequelize');

class AnalyticsService {
  async getUserAnalytics(userId, timeRange = '30d') {
    try {
      const dateFilter = this.getDateFilter(timeRange);
      
      // Get user basic info
      const user = await User.findByPk(userId, {
        attributes: ['id', 'name', 'email', 'greenScore', 'location', 'createdAt']
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Get transaction statistics
      const transactionStats = await this.getUserTransactionStats(userId, dateFilter);
      
      // Get item statistics
      const itemStats = await this.getUserItemStats(userId, dateFilter);
      
      // Get eco impact statistics
      const ecoImpactStats = await this.getUserEcoImpactStats(userId, dateFilter);
      
      // Get recent activity
      const recentActivity = await this.getUserRecentActivity(userId, 10);
      
      // Get achievements
      const achievements = await this.getUserAchievements(userId);
      
      // Get monthly trends
      const monthlyTrends = await this.getUserMonthlyTrends(userId, 12);

      return {
        user: user.toJSON(),
        transactionStats,
        itemStats,
        ecoImpactStats,
        recentActivity,
        achievements,
        monthlyTrends,
        timeRange
      };
    } catch (error) {
      throw new Error(`Failed to get user analytics: ${error.message}`);
    }
  }

  async getCommunityAnalytics(timeRange = '30d') {
    try {
      const dateFilter = this.getDateFilter(timeRange);
      
      // Get top users by Green Score
      const topUsers = await this.getTopUsersByGreenScore(10);
      
      // Get top users by eco impact
      const topEcoUsers = await this.getTopUsersByEcoImpact(10, dateFilter);
      
      // Get community statistics
      const communityStats = await this.getCommunityStats(dateFilter);
      
      // Get category popularity
      const categoryStats = await this.getCategoryStats(dateFilter);
      
      // Get transaction trends
      const transactionTrends = await this.getTransactionTrends(dateFilter);
      
      // Get eco impact leaderboard
      const ecoImpactLeaderboard = await this.getEcoImpactLeaderboard(10, dateFilter);

      return {
        topUsers,
        topEcoUsers,
        communityStats,
        categoryStats,
        transactionTrends,
        ecoImpactLeaderboard,
        timeRange
      };
    } catch (error) {
      throw new Error(`Failed to get community analytics: ${error.message}`);
    }
  }

  async getUserTransactionStats(userId, dateFilter) {
    const whereClause = {
      [Op.or]: [{ buyerId: userId }, { sellerId: userId }],
      createdAt: dateFilter
    };

    const stats = await Transaction.findAll({
      attributes: [
        'transactionType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
        [sequelize.fn('AVG', sequelize.col('amount')), 'avgAmount']
      ],
      where: whereClause,
      group: ['transactionType']
    });

    const totalTransactions = await Transaction.count({
      where: whereClause
    });

    const totalSpent = await Transaction.sum('amount', {
      where: { buyerId: userId, createdAt: dateFilter }
    });

    const totalEarned = await Transaction.sum('amount', {
      where: { sellerId: userId, createdAt: dateFilter }
    });

    return {
      byType: stats,
      totalTransactions,
      totalSpent: totalSpent || 0,
      totalEarned: totalEarned || 0
    };
  }

  async getUserItemStats(userId, dateFilter) {
    const whereClause = {
      sellerId: userId,
      createdAt: dateFilter
    };

    const stats = await Item.findAll({
      attributes: [
        'category',
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('price')), 'totalValue'],
        [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']
      ],
      where: whereClause,
      group: ['category', 'status']
    });

    const totalListings = await Item.count({
      where: whereClause
    });

    const soldItems = await Item.count({
      where: { ...whereClause, isSold: true }
    });

    const totalViews = await Item.sum('views', {
      where: whereClause
    });

    return {
      byCategory: stats,
      totalListings,
      soldItems,
      totalViews: totalViews || 0,
      sellRate: totalListings > 0 ? (soldItems / totalListings) * 100 : 0
    };
  }

  async getUserEcoImpactStats(userId, dateFilter) {
    const whereClause = {
      userId: userId,
      createdAt: dateFilter
    };

    const stats = await EcoImpact.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('co2Saved')), 'totalCo2Saved'],
        [sequelize.fn('SUM', sequelize.col('waterSaved')), 'totalWaterSaved'],
        [sequelize.fn('SUM', sequelize.col('wasteReduced')), 'totalWasteReduced'],
        [sequelize.fn('SUM', sequelize.col('energySaved')), 'totalEnergySaved'],
        [sequelize.fn('SUM', sequelize.col('treesEquivalent')), 'totalTreesEquivalent'],
        [sequelize.fn('AVG', sequelize.col('impactScore')), 'avgImpactScore'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalActions']
      ],
      where: whereClause
    });

    const byType = await EcoImpact.findAll({
      attributes: [
        'impactType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('co2Saved')), 'co2Saved'],
        [sequelize.fn('SUM', sequelize.col('waterSaved')), 'waterSaved']
      ],
      where: whereClause,
      group: ['impactType']
    });

    return {
      totals: stats[0] || {
        totalCo2Saved: 0,
        totalWaterSaved: 0,
        totalWasteReduced: 0,
        totalEnergySaved: 0,
        totalTreesEquivalent: 0,
        avgImpactScore: 0,
        totalActions: 0
      },
      byType
    };
  }

  async getUserRecentActivity(userId, limit = 10) {
    const activities = await Transaction.findAll({
      where: {
        [Op.or]: [{ buyerId: userId }, { sellerId: userId }]
      },
      include: [
        {
          model: Item,
          as: 'item',
          attributes: ['id', 'title', 'images', 'category']
        },
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'name', 'avatar']
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'avatar']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit
    });

    return activities.map(activity => ({
      id: activity.id,
      type: activity.transactionType,
      status: activity.status,
      amount: activity.amount,
      item: activity.item,
      otherUser: activity.buyerId === userId ? activity.seller : activity.buyer,
      createdAt: activity.createdAt
    }));
  }

  async getUserAchievements(userId) {
    const user = await User.findByPk(userId);
    if (!user) return [];

    const achievements = [];

    // Green Score achievements
    if (user.greenScore >= 1000) achievements.push({ id: 'green_master', name: 'Green Master', description: 'Reached 1000 Green Score points' });
    else if (user.greenScore >= 500) achievements.push({ id: 'green_expert', name: 'Green Expert', description: 'Reached 500 Green Score points' });
    else if (user.greenScore >= 100) achievements.push({ id: 'green_novice', name: 'Green Novice', description: 'Reached 100 Green Score points' });

    // Transaction achievements
    const totalTransactions = await Transaction.count({
      where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }] }
    });

    if (totalTransactions >= 100) achievements.push({ id: 'transaction_master', name: 'Transaction Master', description: 'Completed 100+ transactions' });
    else if (totalTransactions >= 50) achievements.push({ id: 'transaction_expert', name: 'Transaction Expert', description: 'Completed 50+ transactions' });
    else if (totalTransactions >= 10) achievements.push({ id: 'transaction_novice', name: 'Transaction Novice', description: 'Completed 10+ transactions' });

    // Item listing achievements
    const totalListings = await Item.count({ where: { sellerId: userId } });
    if (totalListings >= 50) achievements.push({ id: 'listing_master', name: 'Listing Master', description: 'Created 50+ listings' });
    else if (totalListings >= 20) achievements.push({ id: 'listing_expert', name: 'Listing Expert', description: 'Created 20+ listings' });
    else if (totalListings >= 5) achievements.push({ id: 'listing_novice', name: 'Listing Novice', description: 'Created 5+ listings' });

    // Donation achievements
    const donations = await Transaction.count({
      where: { buyerId: userId, transactionType: 'donation' }
    });
    if (donations >= 20) achievements.push({ id: 'donation_master', name: 'Donation Master', description: 'Made 20+ donations' });
    else if (donations >= 10) achievements.push({ id: 'donation_expert', name: 'Donation Expert', description: 'Made 10+ donations' });
    else if (donations >= 1) achievements.push({ id: 'donation_novice', name: 'Donation Novice', description: 'Made your first donation' });

    // Eco impact achievements
    const ecoStats = await EcoImpact.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('co2Saved')), 'totalCo2Saved'],
        [sequelize.fn('SUM', sequelize.col('waterSaved')), 'totalWaterSaved']
      ],
      where: { userId }
    });

    const totalCo2 = ecoStats[0]?.totalCo2Saved || 0;
    const totalWater = ecoStats[0]?.totalWaterSaved || 0;

    if (totalCo2 >= 100) achievements.push({ id: 'co2_hero', name: 'CO2 Hero', description: 'Saved 100+ kg of CO2' });
    if (totalWater >= 1000) achievements.push({ id: 'water_hero', name: 'Water Hero', description: 'Saved 1000+ liters of water' });

    return achievements;
  }

  async getUserMonthlyTrends(userId, months = 12) {
    const trends = [];
    const currentDate = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);

      const monthStats = await this.getUserTransactionStats(userId, {
        [Op.gte]: startDate,
        [Op.lte]: endDate
      });

      trends.push({
        month: startDate.toISOString().slice(0, 7),
        transactions: monthStats.totalTransactions,
        spent: monthStats.totalSpent,
        earned: monthStats.totalEarned
      });
    }

    return trends;
  }

  async getTopUsersByGreenScore(limit = 10) {
    return await User.findAll({
      attributes: ['id', 'name', 'avatar', 'greenScore', 'location'],
      order: [['greenScore', 'DESC']],
      limit
    });
  }

  async getTopUsersByEcoImpact(limit = 10, dateFilter) {
    const users = await User.findAll({
      attributes: [
        'id', 'name', 'avatar', 'greenScore', 'location',
        [sequelize.fn('SUM', sequelize.literal('"EcoImpacts"."co2Saved"')), 'totalCo2Saved'],
        [sequelize.fn('SUM', sequelize.literal('"EcoImpacts"."waterSaved"')), 'totalWaterSaved'],
        [sequelize.fn('COUNT', sequelize.literal('"EcoImpacts"."id"')), 'totalActions']
      ],
      include: [{
        model: EcoImpact,
        as: 'ecoImpacts',
        attributes: [],
        where: dateFilter,
        required: true
      }],
      group: ['User.id', 'User.name', 'User.avatar', 'User.greenScore', 'User.location'],
      order: [[sequelize.literal('"totalCo2Saved"'), 'DESC']],
      limit
    });

    return users;
  }

  async getCommunityStats(dateFilter) {
    const totalUsers = await User.count();
    const activeUsers = await User.count({
      where: {
        lastLogin: {
          [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      }
    });

    const totalItems = await Item.count({
      where: { isActive: true, createdAt: dateFilter }
    });

    const totalTransactions = await Transaction.count({
      where: { createdAt: dateFilter }
    });

    const totalValue = await Transaction.sum('amount', {
      where: { createdAt: dateFilter }
    });

    const totalEcoImpact = await EcoImpact.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('co2Saved')), 'totalCo2Saved'],
        [sequelize.fn('SUM', sequelize.col('waterSaved')), 'totalWaterSaved'],
        [sequelize.fn('SUM', sequelize.col('wasteReduced')), 'totalWasteReduced'],
        [sequelize.fn('SUM', sequelize.col('energySaved')), 'totalEnergySaved']
      ],
      where: { createdAt: dateFilter }
    });

    return {
      totalUsers,
      activeUsers,
      totalItems,
      totalTransactions,
      totalValue: totalValue || 0,
      ecoImpact: totalEcoImpact[0] || {
        totalCo2Saved: 0,
        totalWaterSaved: 0,
        totalWasteReduced: 0,
        totalEnergySaved: 0
      }
    };
  }

  async getCategoryStats(dateFilter) {
    return await Item.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('price')), 'totalValue'],
        [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice']
      ],
      where: { isActive: true, createdAt: dateFilter },
      group: ['category'],
      order: [[sequelize.literal('count'), 'DESC']]
    });
  }

  async getTransactionTrends(dateFilter) {
    const trends = await Transaction.findAll({
      attributes: [
        'transactionType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
      ],
      where: { createdAt: dateFilter },
      group: ['transactionType']
    });

    return trends;
  }

  async getEcoImpactLeaderboard(limit = 10, dateFilter) {
    return await User.findAll({
      attributes: [
        'id', 'name', 'avatar', 'greenScore',
        [sequelize.fn('SUM', sequelize.literal('"EcoImpacts"."co2Saved"')), 'co2Saved'],
        [sequelize.fn('SUM', sequelize.literal('"EcoImpacts"."waterSaved"')), 'waterSaved'],
        [sequelize.fn('SUM', sequelize.literal('"EcoImpacts"."wasteReduced"')), 'wasteReduced']
      ],
      include: [{
        model: EcoImpact,
        as: 'ecoImpacts',
        attributes: [],
        where: dateFilter,
        required: true
      }],
      group: ['User.id'],
      order: [[sequelize.literal('"co2Saved"'), 'DESC']],
      limit
    });
  }

  getDateFilter(timeRange) {
    const now = new Date();
    let startDate;

    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    return {
      [Op.gte]: startDate,
      [Op.lte]: now
    };
  }
}

module.exports = new AnalyticsService();
