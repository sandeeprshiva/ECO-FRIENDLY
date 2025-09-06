const { EcoAction, User, sequelize } = require('../models');
const { Op } = require('sequelize');

class EcoActionService {
  async createEcoAction(actionData, userId) {
    try {
      const ecoAction = await EcoAction.create({
        ...actionData,
        userId
      });

      return ecoAction;
    } catch (error) {
      throw new Error(`Failed to create eco action: ${error.message}`);
    }
  }

  async getEcoActions(filters = {}) {
    try {
      const {
        category,
        impactLevel,
        isVerified,
        status = 'published',
        limit = 20,
        offset = 0,
        search
      } = filters;

      const whereClause = { status };

      if (category) whereClause.category = category;
      if (impactLevel) whereClause.impactLevel = impactLevel;
      if (isVerified !== undefined) whereClause.isVerified = isVerified;

      if (search) {
        whereClause[Op.or] = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { tags: { [Op.contains]: [search] } }
        ];
      }

      const ecoActions = await EcoAction.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'avatar']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        ecoActions: ecoActions.rows,
        total: ecoActions.count,
        hasMore: ecoActions.count > offset + parseInt(limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch eco actions: ${error.message}`);
    }
  }

  async getEcoActionById(id) {
    try {
      const ecoAction = await EcoAction.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'name', 'avatar']
          }
        ]
      });

      if (!ecoAction) {
        throw new Error('Eco action not found');
      }

      return ecoAction;
    } catch (error) {
      throw new Error(`Failed to fetch eco action: ${error.message}`);
    }
  }

  async updateEcoAction(id, updateData, userId, userRole) {
    try {
      const ecoAction = await EcoAction.findByPk(id);
      if (!ecoAction) {
        throw new Error('Eco action not found');
      }

      // Check if user can update this action
      if (ecoAction.userId !== userId && userRole !== 'admin' && userRole !== 'moderator') {
        throw new Error('Unauthorized to update this eco action');
      }

      await ecoAction.update(updateData);
      return ecoAction;
    } catch (error) {
      throw new Error(`Failed to update eco action: ${error.message}`);
    }
  }

  async deleteEcoAction(id, userId, userRole) {
    try {
      const ecoAction = await EcoAction.findByPk(id);
      if (!ecoAction) {
        throw new Error('Eco action not found');
      }

      // Check if user can delete this action
      if (ecoAction.userId !== userId && userRole !== 'admin') {
        throw new Error('Unauthorized to delete this eco action');
      }

      await ecoAction.destroy();
      return { message: 'Eco action deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete eco action: ${error.message}`);
    }
  }

  async verifyEcoAction(id, verifiedBy) {
    try {
      const ecoAction = await EcoAction.findByPk(id);
      if (!ecoAction) {
        throw new Error('Eco action not found');
      }

      await ecoAction.update({
        isVerified: true,
        verificationDate: new Date(),
        verifiedBy
      });

      return ecoAction;
    } catch (error) {
      throw new Error(`Failed to verify eco action: ${error.message}`);
    }
  }

  async getEcoActionStats() {
    try {
      const stats = await EcoAction.findAll({
        attributes: [
          'category',
          'impactLevel',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('carbonFootprintReduction')), 'totalCarbonReduction'],
          [sequelize.fn('SUM', sequelize.col('waterSaved')), 'totalWaterSaved'],
          [sequelize.fn('SUM', sequelize.col('wasteReduced')), 'totalWasteReduced']
        ],
        where: { status: 'published' },
        group: ['category', 'impactLevel']
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch eco action stats: ${error.message}`);
    }
  }
}

module.exports = new EcoActionService();
