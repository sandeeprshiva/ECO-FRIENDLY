const { User, Item, Transaction, EcoImpact } = require('../models');
const { Op } = require('sequelize');

class GreenScoreService {
  constructor() {
    // Green Score point values
    this.pointValues = {
      listing: 10,
      sale: 20,
      donation: 50,
      purchase: 5,
      exchange: 15,
      rental: 8,
      return: 3
    };

    // Bonus multipliers
    this.bonusMultipliers = {
      firstTime: 2, // 2x points for first-time actions
      streak: 1.5, // 1.5x points for consecutive days
      ecoFriendly: 1.2, // 1.2x points for eco-friendly items
      verified: 1.1 // 1.1x points for verified users
    };
  }

  async calculateGreenScore(userId, action, itemData = null) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      let basePoints = this.pointValues[action] || 0;
      let totalPoints = basePoints;

      // Apply bonuses
      const bonuses = await this.calculateBonuses(userId, action, itemData);
      totalPoints = Math.round(totalPoints * bonuses.multiplier);

      // Add bonus points
      totalPoints += bonuses.extraPoints;

      // Cap at 1000 points per action
      totalPoints = Math.min(totalPoints, 1000);

      // Update user's Green Score
      const newScore = Math.min(user.greenScore + totalPoints, 1000);
      await user.update({ greenScore: newScore });

      // Log the score update
      await this.logScoreUpdate(userId, action, basePoints, totalPoints, bonuses);

      return {
        action,
        basePoints,
        totalPoints,
        newScore,
        bonuses
      };
    } catch (error) {
      throw new Error(`Failed to calculate Green Score: ${error.message}`);
    }
  }

  async calculateBonuses(userId, action, itemData) {
    const bonuses = {
      multiplier: 1,
      extraPoints: 0,
      reasons: []
    };

    // First-time action bonus
    const isFirstTime = await this.isFirstTimeAction(userId, action);
    if (isFirstTime) {
      bonuses.multiplier *= this.bonusMultipliers.firstTime;
      bonuses.reasons.push('First-time action bonus');
    }

    // Streak bonus
    const streakDays = await this.getUserStreak(userId);
    if (streakDays >= 7) {
      bonuses.multiplier *= this.bonusMultipliers.streak;
      bonuses.reasons.push(`${streakDays}-day streak bonus`);
    }

    // Eco-friendly item bonus
    if (itemData && itemData.category) {
      const ecoFriendlyCategories = ['electronics', 'clothing', 'furniture', 'books'];
      if (ecoFriendlyCategories.includes(itemData.category)) {
        bonuses.multiplier *= this.bonusMultipliers.ecoFriendly;
        bonuses.reasons.push('Eco-friendly item bonus');
      }
    }

    // Verified user bonus
    const user = await User.findByPk(userId);
    if (user && user.isVerified) {
      bonuses.multiplier *= this.bonusMultipliers.verified;
      bonuses.reasons.push('Verified user bonus');
    }

    // Special action bonuses
    if (action === 'donation') {
      bonuses.extraPoints += 25; // Extra points for donations
      bonuses.reasons.push('Donation bonus');
    }

    if (action === 'exchange') {
      bonuses.extraPoints += 10; // Extra points for exchanges
      bonuses.reasons.push('Exchange bonus');
    }

    return bonuses;
  }

  async isFirstTimeAction(userId, action) {
    const whereClause = { userId };

    switch (action) {
      case 'listing':
        return await Item.count({ where: { sellerId: userId } }) === 1;
      case 'sale':
        return await Transaction.count({ where: { sellerId: userId, transactionType: 'sale' } }) === 1;
      case 'donation':
        return await Transaction.count({ where: { buyerId: userId, transactionType: 'donation' } }) === 1;
      case 'purchase':
        return await Transaction.count({ where: { buyerId: userId, transactionType: 'sale' } }) === 1;
      case 'exchange':
        return await Transaction.count({ where: { [Op.or]: [{ buyerId: userId }, { sellerId: userId }], transactionType: 'exchange' } }) === 1;
      case 'rental':
        return await Transaction.count({ where: { buyerId: userId, transactionType: 'rental' } }) === 1;
      default:
        return false;
    }
  }

  async getUserStreak(userId) {
    // Get user's last 30 days of activity
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const activities = await Transaction.findAll({
      where: {
        [Op.or]: [{ buyerId: userId }, { sellerId: userId }],
        createdAt: { [Op.gte]: thirtyDaysAgo }
      },
      attributes: ['createdAt'],
      order: [['createdAt', 'DESC']]
    });

    if (activities.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const dayStart = new Date(currentDate);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasActivity = activities.some(activity => {
        const activityDate = new Date(activity.createdAt);
        return activityDate >= dayStart && activityDate <= dayEnd;
      });

      if (hasActivity) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  async logScoreUpdate(userId, action, basePoints, totalPoints, bonuses) {
    // In a real implementation, you might want to log this to a separate table
    console.log(`Green Score Update - User: ${userId}, Action: ${action}, Base: ${basePoints}, Total: ${totalPoints}, Bonuses: ${JSON.stringify(bonuses)}`);
  }

  async updateGreenScoreForTransaction(transaction) {
    try {
      const { buyerId, sellerId, transactionType, amount } = transaction;

      // Update buyer's score
      if (buyerId) {
        const buyerAction = this.getBuyerAction(transactionType);
        if (buyerAction) {
          await this.calculateGreenScore(buyerId, buyerAction, { amount });
        }
      }

      // Update seller's score
      if (sellerId) {
        const sellerAction = this.getSellerAction(transactionType);
        if (sellerAction) {
          await this.calculateGreenScore(sellerId, sellerAction, { amount });
        }
      }
    } catch (error) {
      console.error('Error updating Green Score for transaction:', error);
    }
  }

  getBuyerAction(transactionType) {
    const actionMap = {
      'sale': 'purchase',
      'donation': 'donation',
      'exchange': 'exchange',
      'rental': 'rental'
    };
    return actionMap[transactionType];
  }

  getSellerAction(transactionType) {
    const actionMap = {
      'sale': 'sale',
      'donation': 'donation',
      'exchange': 'exchange',
      'rental': 'rental'
    };
    return actionMap[transactionType];
  }

  async updateGreenScoreForListing(itemId) {
    try {
      const item = await Item.findByPk(itemId);
      if (!item) return;

      await this.calculateGreenScore(item.sellerId, 'listing', {
        category: item.category,
        price: item.price
      });
    } catch (error) {
      console.error('Error updating Green Score for listing:', error);
    }
  }

  async getGreenScoreLeaderboard(limit = 10, timeRange = '30d') {
    try {
      const dateFilter = this.getDateFilter(timeRange);
      
      const users = await User.findAll({
        attributes: [
          'id', 'name', 'avatar', 'greenScore', 'location',
          [sequelize.fn('COUNT', sequelize.literal('"Transactions"."id"')), 'totalTransactions']
        ],
        include: [{
          model: Transaction,
          as: 'purchases',
          attributes: [],
          where: dateFilter,
          required: false
        }],
        group: ['User.id'],
        order: [['greenScore', 'DESC']],
        limit
      });

      return users;
    } catch (error) {
      throw new Error(`Failed to get Green Score leaderboard: ${error.message}`);
    }
  }

  async getUserGreenScoreHistory(userId, days = 30) {
    try {
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
      
      // Get daily score changes (simplified - in reality you'd track this in a separate table)
      const transactions = await Transaction.findAll({
        where: {
          [Op.or]: [{ buyerId: userId }, { sellerId: userId }],
          createdAt: { [Op.gte]: startDate }
        },
        attributes: ['createdAt', 'transactionType', 'amount'],
        order: [['createdAt', 'ASC']]
      });

      const dailyScores = [];
      let currentScore = 0;

      for (let i = 0; i < days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        date.setHours(0, 0, 0, 0);

        const dayEnd = new Date(date);
        dayEnd.setHours(23, 59, 59, 999);

        const dayTransactions = transactions.filter(t => 
          t.createdAt >= date && t.createdAt <= dayEnd
        );

        let dayPoints = 0;
        dayTransactions.forEach(transaction => {
          if (transaction.buyerId === userId) {
            dayPoints += this.pointValues[this.getBuyerAction(transaction.transactionType)] || 0;
          }
          if (transaction.sellerId === userId) {
            dayPoints += this.pointValues[this.getSellerAction(transaction.transactionType)] || 0;
          }
        });

        currentScore += dayPoints;
        dailyScores.push({
          date: date.toISOString().slice(0, 10),
          points: dayPoints,
          totalScore: currentScore,
          transactions: dayTransactions.length
        });
      }

      return dailyScores;
    } catch (error) {
      throw new Error(`Failed to get Green Score history: ${error.message}`);
    }
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

module.exports = new GreenScoreService();
