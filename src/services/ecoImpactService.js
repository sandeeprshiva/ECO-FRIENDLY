const { EcoImpact, User, Item, Transaction, sequelize } = require('../models');
const { Op } = require('sequelize');

class EcoImpactService {
  async createEcoImpact(impactData) {
    try {
      const ecoImpact = await EcoImpact.create(impactData);
      await ecoImpact.calculateImpactScore();
      return ecoImpact;
    } catch (error) {
      throw new Error(`Failed to create eco impact: ${error.message}`);
    }
  }

  async getEcoImpacts(filters = {}) {
    try {
      const {
        userId,
        itemId,
        impactType,
        category,
        isVerified,
        startDate,
        endDate,
        limit = 20,
        offset = 0,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = filters;

      const whereClause = {};

      if (userId) whereClause.userId = userId;
      if (itemId) whereClause.itemId = itemId;
      if (impactType) whereClause.impactType = impactType;
      if (category) whereClause.category = category;
      if (isVerified !== undefined) whereClause.isVerified = isVerified;

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
        if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
      }

      const ecoImpacts = await EcoImpact.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'avatar', 'greenScore']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'title', 'images', 'category', 'condition']
          },
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'amount', 'status']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        ecoImpacts: ecoImpacts.rows,
        total: ecoImpacts.count,
        hasMore: ecoImpacts.count > offset + parseInt(limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch eco impacts: ${error.message}`);
    }
  }

  async getEcoImpactById(id) {
    try {
      const ecoImpact = await EcoImpact.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'avatar', 'greenScore']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'title', 'images', 'category', 'condition', 'price']
          },
          {
            model: Transaction,
            as: 'transaction',
            attributes: ['id', 'amount', 'status', 'createdAt']
          }
        ]
      });

      if (!ecoImpact) {
        throw new Error('Eco impact not found');
      }

      return ecoImpact;
    } catch (error) {
      throw new Error(`Failed to fetch eco impact: ${error.message}`);
    }
  }

  async updateEcoImpact(id, updateData, userId, userRole) {
    try {
      const ecoImpact = await EcoImpact.findByPk(id);
      if (!ecoImpact) {
        throw new Error('Eco impact not found');
      }

      // Check if user can update this eco impact
      if (ecoImpact.userId !== userId && !['admin', 'moderator'].includes(userRole)) {
        throw new Error('Unauthorized to update this eco impact');
      }

      await ecoImpact.update(updateData);
      await ecoImpact.calculateImpactScore();
      return ecoImpact;
    } catch (error) {
      throw new Error(`Failed to update eco impact: ${error.message}`);
    }
  }

  async verifyEcoImpact(id, verifiedBy) {
    try {
      const ecoImpact = await EcoImpact.findByPk(id);
      if (!ecoImpact) {
        throw new Error('Eco impact not found');
      }

      await ecoImpact.verify(verifiedBy);
      return ecoImpact;
    } catch (error) {
      throw new Error(`Failed to verify eco impact: ${error.message}`);
    }
  }

  async deleteEcoImpact(id, userId, userRole) {
    try {
      const ecoImpact = await EcoImpact.findByPk(id);
      if (!ecoImpact) {
        throw new Error('Eco impact not found');
      }

      // Check if user can delete this eco impact
      if (ecoImpact.userId !== userId && userRole !== 'admin') {
        throw new Error('Unauthorized to delete this eco impact');
      }

      await ecoImpact.destroy();
      return { message: 'Eco impact deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete eco impact: ${error.message}`);
    }
  }

  async getUserEcoImpactStats(userId) {
    try {
      const stats = await EcoImpact.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('co2Saved')), 'totalCo2Saved'],
          [sequelize.fn('SUM', sequelize.col('waterSaved')), 'totalWaterSaved'],
          [sequelize.fn('SUM', sequelize.col('wasteReduced')), 'totalWasteReduced'],
          [sequelize.fn('SUM', sequelize.col('energySaved')), 'totalEnergySaved'],
          [sequelize.fn('SUM', sequelize.col('treesEquivalent')), 'totalTreesEquivalent'],
          [sequelize.fn('AVG', sequelize.col('impactScore')), 'avgImpactScore'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalImpacts'],
          [sequelize.fn('COUNT', sequelize.literal('CASE WHEN "isVerified" = true THEN 1 END')), 'verifiedImpacts']
        ],
        where: { userId, isActive: true }
      });

      return stats[0] || {
        totalCo2Saved: 0,
        totalWaterSaved: 0,
        totalWasteReduced: 0,
        totalEnergySaved: 0,
        totalTreesEquivalent: 0,
        avgImpactScore: 0,
        totalImpacts: 0,
        verifiedImpacts: 0
      };
    } catch (error) {
      throw new Error(`Failed to fetch user eco impact stats: ${error.message}`);
    }
  }

  async getGlobalEcoImpactStats() {
    try {
      const stats = await EcoImpact.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('co2Saved')), 'totalCo2Saved'],
          [sequelize.fn('SUM', sequelize.col('waterSaved')), 'totalWaterSaved'],
          [sequelize.fn('SUM', sequelize.col('wasteReduced')), 'totalWasteReduced'],
          [sequelize.fn('SUM', sequelize.col('energySaved')), 'totalEnergySaved'],
          [sequelize.fn('SUM', sequelize.col('treesEquivalent')), 'totalTreesEquivalent'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'totalImpacts'],
          [sequelize.fn('COUNT', sequelize.literal('CASE WHEN "isVerified" = true THEN 1 END')), 'verifiedImpacts']
        ],
        where: { isActive: true }
      });

      return stats[0] || {
        totalCo2Saved: 0,
        totalWaterSaved: 0,
        totalWasteReduced: 0,
        totalEnergySaved: 0,
        totalTreesEquivalent: 0,
        totalImpacts: 0,
        verifiedImpacts: 0
      };
    } catch (error) {
      throw new Error(`Failed to fetch global eco impact stats: ${error.message}`);
    }
  }

  async getEcoImpactByCategory() {
    try {
      const stats = await EcoImpact.findAll({
        attributes: [
          'category',
          'impactType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('co2Saved')), 'totalCo2Saved'],
          [sequelize.fn('SUM', sequelize.col('waterSaved')), 'totalWaterSaved'],
          [sequelize.fn('SUM', sequelize.col('wasteReduced')), 'totalWasteReduced'],
          [sequelize.fn('AVG', sequelize.col('impactScore')), 'avgImpactScore']
        ],
        where: { isActive: true },
        group: ['category', 'impactType']
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch eco impact by category: ${error.message}`);
    }
  }

  async updateUserGreenScore(userId) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const stats = await this.getUserEcoImpactStats(userId);
      const newGreenScore = Math.min(Math.round(stats.avgImpactScore || 0), 1000);

      await user.update({ greenScore: newGreenScore });
      return user;
    } catch (error) {
      throw new Error(`Failed to update user green score: ${error.message}`);
    }
  }

  async getTopEcoUsers(limit = 10) {
    try {
      const users = await User.findAll({
        attributes: [
          'id',
          'name',
          'avatar',
          'greenScore',
          [sequelize.fn('COUNT', sequelize.literal('"EcoImpacts"."id"')), 'totalImpacts']
        ],
        include: [
          {
            model: EcoImpact,
            as: 'ecoImpacts',
            attributes: [],
            required: true,
            where: { isActive: true }
          }
        ],
        group: ['User.id', 'User.name', 'User.avatar', 'User.greenScore'],
        order: [[sequelize.literal('"User"."greenScore"'), 'DESC']],
        limit: parseInt(limit)
      });

      return users;
    } catch (error) {
      throw new Error(`Failed to fetch top eco users: ${error.message}`);
    }
  }
}

module.exports = new EcoImpactService();
