const { Achievement, UserAchievement, User, Transaction, Item, EcoImpact, sequelize } = require('../models');
const { Op } = require('sequelize');

class AchievementService {
  constructor() {
    this.achievementDefinitions = this.getAchievementDefinitions();
  }

  getAchievementDefinitions() {
    return [
      // Green Score Achievements
      {
        name: 'Green Novice',
        description: 'Reach 100 Green Score points',
        category: 'green_score',
        badgeIcon: '🌱',
        badgeColor: '#4CAF50',
        points: 10,
        rarity: 'common',
        requirements: { greenScore: 100 }
      },
      {
        name: 'Green Expert',
        description: 'Reach 500 Green Score points',
        category: 'green_score',
        badgeIcon: '🌿',
        badgeColor: '#8BC34A',
        points: 25,
        rarity: 'uncommon',
        requirements: { greenScore: 500 }
      },
      {
        name: 'Green Master',
        description: 'Reach 1000 Green Score points',
        category: 'green_score',
        badgeIcon: '🌳',
        badgeColor: '#2E7D32',
        points: 50,
        rarity: 'rare',
        requirements: { greenScore: 1000 }
      },

      // Transaction Achievements
      {
        name: 'First Purchase',
        description: 'Make your first purchase',
        category: 'transactions',
        badgeIcon: '🛒',
        badgeColor: '#2196F3',
        points: 5,
        rarity: 'common',
        requirements: { purchases: 1 }
      },
      {
        name: 'Frequent Buyer',
        description: 'Make 10 purchases',
        category: 'transactions',
        badgeIcon: '🛍️',
        badgeColor: '#1976D2',
        points: 15,
        rarity: 'uncommon',
        requirements: { purchases: 10 }
      },
      {
        name: 'Shopping Master',
        description: 'Make 50 purchases',
        category: 'transactions',
        badgeIcon: '💳',
        badgeColor: '#0D47A1',
        points: 30,
        rarity: 'rare',
        requirements: { purchases: 50 }
      },

      // Listing Achievements
      {
        name: 'First Listing',
        description: 'Create your first item listing',
        category: 'listings',
        badgeIcon: '📝',
        badgeColor: '#FF9800',
        points: 5,
        rarity: 'common',
        requirements: { listings: 1 }
      },
      {
        name: 'Active Seller',
        description: 'Create 10 listings',
        category: 'listings',
        badgeIcon: '🏪',
        badgeColor: '#F57C00',
        points: 15,
        rarity: 'uncommon',
        requirements: { listings: 10 }
      },
      {
        name: 'Marketplace Master',
        description: 'Create 50 listings',
        category: 'listings',
        badgeIcon: '🏬',
        badgeColor: '#E65100',
        points: 30,
        rarity: 'rare',
        requirements: { listings: 50 }
      },

      // Donation Achievements
      {
        name: 'First Donation',
        description: 'Make your first donation',
        category: 'donations',
        badgeIcon: '❤️',
        badgeColor: '#E91E63',
        points: 10,
        rarity: 'common',
        requirements: { donations: 1 }
      },
      {
        name: 'Generous Giver',
        description: 'Make 5 donations',
        category: 'donations',
        badgeIcon: '🎁',
        badgeColor: '#C2185B',
        points: 25,
        rarity: 'uncommon',
        requirements: { donations: 5 }
      },
      {
        name: 'Philanthropist',
        description: 'Make 20 donations',
        category: 'donations',
        badgeIcon: '🌟',
        badgeColor: '#880E4F',
        points: 50,
        rarity: 'epic',
        requirements: { donations: 20 }
      },

      // Eco Impact Achievements
      {
        name: 'CO2 Saver',
        description: 'Save 10 kg of CO2',
        category: 'eco_impact',
        badgeIcon: '🌍',
        badgeColor: '#4CAF50',
        points: 10,
        rarity: 'common',
        requirements: { co2Saved: 10 }
      },
      {
        name: 'Climate Hero',
        description: 'Save 100 kg of CO2',
        category: 'eco_impact',
        badgeIcon: '🌎',
        badgeColor: '#2E7D32',
        points: 25,
        rarity: 'rare',
        requirements: { co2Saved: 100 }
      },
      {
        name: 'Water Saver',
        description: 'Save 100 liters of water',
        category: 'eco_impact',
        badgeIcon: '💧',
        badgeColor: '#2196F3',
        points: 15,
        rarity: 'uncommon',
        requirements: { waterSaved: 100 }
      },
      {
        name: 'Waste Warrior',
        description: 'Reduce 50 kg of waste',
        category: 'eco_impact',
        badgeIcon: '♻️',
        badgeColor: '#8BC34A',
        points: 20,
        rarity: 'uncommon',
        requirements: { wasteReduced: 50 }
      },

      // Special Achievements
      {
        name: 'Early Adopter',
        description: 'Join in the first month',
        category: 'special',
        badgeIcon: '🚀',
        badgeColor: '#9C27B0',
        points: 25,
        rarity: 'epic',
        requirements: { earlyAdopter: true }
      },
      {
        name: 'Streak Master',
        description: 'Maintain a 30-day activity streak',
        category: 'special',
        badgeIcon: '🔥',
        badgeColor: '#FF5722',
        points: 50,
        rarity: 'legendary',
        requirements: { streak: 30 }
      }
    ];
  }

  async initializeAchievements() {
    try {
      for (const achievementData of this.achievementDefinitions) {
        await Achievement.findOrCreate({
          where: { name: achievementData.name },
          defaults: achievementData
        });
      }
      console.log('Achievements initialized successfully');
    } catch (error) {
      console.error('Error initializing achievements:', error);
    }
  }

  async checkAndAwardAchievements(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) return [];

      const userStats = await this.getUserStats(userId);
      const earnedAchievements = [];

      // Get all active achievements
      const achievements = await Achievement.findAll({
        where: { isActive: true }
      });

      for (const achievement of achievements) {
        // Check if user already has this achievement
        const existingUserAchievement = await UserAchievement.findOne({
          where: { userId, achievementId: achievement.id }
        });

        if (existingUserAchievement) continue;

        // Check if user meets requirements
        const meetsRequirements = await this.checkRequirements(userStats, achievement.requirements);
        
        if (meetsRequirements) {
          // Award the achievement
          const userAchievement = await UserAchievement.create({
            userId,
            achievementId: achievement.id,
            earnedAt: new Date(),
            progress: 100
          });

          // Add Green Score points for the achievement
          await this.awardAchievementPoints(userId, achievement.points);

          earnedAchievements.push({
            achievement: achievement.toJSON(),
            userAchievement: userAchievement.toJSON()
          });
        }
      }

      return earnedAchievements;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }

  async getUserStats(userId) {
    const user = await User.findByPk(userId);
    
    const purchases = await Transaction.count({
      where: { buyerId: userId, transactionType: 'sale' }
    });

    const donations = await Transaction.count({
      where: { buyerId: userId, transactionType: 'donation' }
    });

    const listings = await Item.count({
      where: { sellerId: userId }
    });

    const ecoImpact = await EcoImpact.findAll({
      attributes: [
        [sequelize.fn('SUM', sequelize.col('co2Saved')), 'totalCo2Saved'],
        [sequelize.fn('SUM', sequelize.col('waterSaved')), 'totalWaterSaved'],
        [sequelize.fn('SUM', sequelize.col('wasteReduced')), 'totalWasteReduced']
      ],
      where: { userId }
    });

    const stats = ecoImpact[0] || {
      totalCo2Saved: 0,
      totalWaterSaved: 0,
      totalWasteReduced: 0
    };

    return {
      greenScore: user.greenScore,
      purchases,
      donations,
      listings,
      co2Saved: parseFloat(stats.totalCo2Saved) || 0,
      waterSaved: parseFloat(stats.totalWaterSaved) || 0,
      wasteReduced: parseFloat(stats.totalWasteReduced) || 0,
      earlyAdopter: this.isEarlyAdopter(user.createdAt),
      streak: await this.getUserStreak(userId)
    };
  }

  async checkRequirements(userStats, requirements) {
    for (const [key, value] of Object.entries(requirements)) {
      if (userStats[key] < value) {
        return false;
      }
    }
    return true;
  }

  async awardAchievementPoints(userId, points) {
    const user = await User.findByPk(userId);
    if (user) {
      const newScore = Math.min(user.greenScore + points, 1000);
      await user.update({ greenScore: newScore });
    }
  }

  isEarlyAdopter(createdAt) {
    const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return new Date(createdAt) <= oneMonthAgo;
  }

  async getUserStreak(userId) {
    // Simplified streak calculation
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

  async getUserAchievements(userId) {
    const userAchievements = await UserAchievement.findAll({
      where: { userId },
      include: [{
        model: Achievement,
        as: 'achievement'
      }],
      order: [['earnedAt', 'DESC']]
    });

    return userAchievements.map(ua => ({
      id: ua.id,
      earnedAt: ua.earnedAt,
      progress: ua.progress,
      isNotified: ua.isNotified,
      achievement: ua.achievement
    }));
  }

  async getAchievementProgress(userId, achievementId) {
    const achievement = await Achievement.findByPk(achievementId);
    if (!achievement) return null;

    const userStats = await this.getUserStats(userId);
    const progress = this.calculateProgress(userStats, achievement.requirements);

    return {
      achievement,
      progress,
      isEarned: progress >= 100
    };
  }

  calculateProgress(userStats, requirements) {
    let totalProgress = 0;
    let totalRequirements = 0;

    for (const [key, value] of Object.entries(requirements)) {
      totalRequirements += value;
      totalProgress += Math.min(userStats[key] || 0, value);
    }

    return totalRequirements > 0 ? Math.round((totalProgress / totalRequirements) * 100) : 0;
  }

  async getLeaderboard(limit = 10) {
    const users = await User.findAll({
      attributes: [
        'id', 'name', 'avatar', 'greenScore',
        [sequelize.fn('COUNT', sequelize.literal('"UserAchievements"."id"')), 'achievementCount']
      ],
      include: [{
        model: UserAchievement,
        as: 'userAchievements',
        attributes: [],
        required: false
      }],
      group: ['User.id'],
      order: [
        [sequelize.literal('achievementCount'), 'DESC'],
        ['greenScore', 'DESC']
      ],
      limit
    });

    return users;
  }

  async markAsNotified(userAchievementId) {
    await UserAchievement.update(
      { isNotified: true },
      { where: { id: userAchievementId } }
    );
  }
}

module.exports = new AchievementService();
