const { NGO, User, Item, Transaction, sequelize } = require('../models');
const { Op } = require('sequelize');

class NGOService {
  async createNGO(ngoData) {
    try {
      const ngo = await NGO.create(ngoData);
      return ngo;
    } catch (error) {
      throw new Error(`Failed to create NGO: ${error.message}`);
    }
  }

  async getNGOs(filters = {}) {
    try {
      const {
        isVerified,
        isActive = true,
        focusArea,
        search,
        minRating,
        limit = 20,
        offset = 0,
        sortBy = 'rating',
        sortOrder = 'DESC'
      } = filters;

      const whereClause = { isActive };

      if (isVerified !== undefined) whereClause.isVerified = isVerified;
      if (focusArea) whereClause.focusAreas = { [Op.contains]: [focusArea] };
      if (minRating) whereClause.rating = { [Op.gte]: minRating };

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { mission: { [Op.iLike]: `%${search}%` } },
          { focusAreas: { [Op.contains]: [search] } }
        ];
      }

      const ngos = await NGO.findAndCountAll({
        where: whereClause,
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        ngos: ngos.rows,
        total: ngos.count,
        hasMore: ngos.count > offset + parseInt(limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch NGOs: ${error.message}`);
    }
  }

  async getNGOById(id) {
    try {
      const ngo = await NGO.findByPk(id);
      if (!ngo) {
        throw new Error('NGO not found');
      }
      return ngo;
    } catch (error) {
      throw new Error(`Failed to fetch NGO: ${error.message}`);
    }
  }

  async updateNGO(id, updateData, userId, userRole) {
    try {
      const ngo = await NGO.findByPk(id);
      if (!ngo) {
        throw new Error('NGO not found');
      }

      // Check if user can update this NGO
      if (ngo.verifiedBy !== userId && !['admin', 'moderator'].includes(userRole)) {
        throw new Error('Unauthorized to update this NGO');
      }

      await ngo.update(updateData);
      return ngo;
    } catch (error) {
      throw new Error(`Failed to update NGO: ${error.message}`);
    }
  }

  async verifyNGO(id, verifiedBy) {
    try {
      const ngo = await NGO.findByPk(id);
      if (!ngo) {
        throw new Error('NGO not found');
      }

      await ngo.update({
        isVerified: true,
        verificationDate: new Date(),
        verifiedBy
      });

      return ngo;
    } catch (error) {
      throw new Error(`Failed to verify NGO: ${error.message}`);
    }
  }

  async deleteNGO(id, userId, userRole) {
    try {
      const ngo = await NGO.findByPk(id);
      if (!ngo) {
        throw new Error('NGO not found');
      }

      // Check if user can delete this NGO
      if (ngo.verifiedBy !== userId && userRole !== 'admin') {
        throw new Error('Unauthorized to delete this NGO');
      }

      await ngo.destroy();
      return { message: 'NGO deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete NGO: ${error.message}`);
    }
  }

  async getNGOStats(ngoId = null) {
    try {
      const whereClause = ngoId ? { ngoId } : {};

      const stats = await NGO.findAll({
        attributes: [
          'id',
          'name',
          'isVerified',
          [sequelize.fn('COUNT', sequelize.literal('DISTINCT "Items"."id"')), 'totalItems'],
          [sequelize.fn('SUM', sequelize.literal('"Transactions"."amount"')), 'totalDonations'],
          [sequelize.fn('AVG', sequelize.literal('"Transactions"."amount"')), 'avgDonation'],
          [sequelize.fn('COUNT', sequelize.literal('DISTINCT "Transactions"."id"')), 'totalTransactions']
        ],
        include: [
          {
            model: Item,
            as: 'items',
            attributes: [],
            required: false
          },
          {
            model: Transaction,
            as: 'transactions',
            attributes: [],
            required: false,
            where: whereClause
          }
        ],
        group: ['NGO.id', 'NGO.name', 'NGO.isVerified']
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch NGO statistics: ${error.message}`);
    }
  }

  async getNGOItems(ngoId, filters = {}) {
    try {
      const {
        category,
        condition,
        transactionType,
        isActive = true,
        limit = 20,
        offset = 0
      } = filters;

      const whereClause = { ngoId, isActive };

      if (category) whereClause.category = category;
      if (condition) whereClause.condition = condition;
      if (transactionType) whereClause.transactionType = transactionType;

      const items = await Item.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'avatar']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        items: items.rows,
        total: items.count,
        hasMore: items.count > offset + parseInt(limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch NGO items: ${error.message}`);
    }
  }

  async updateNGOStats(ngoId) {
    try {
      const ngo = await NGO.findByPk(ngoId);
      if (!ngo) {
        throw new Error('NGO not found');
      }

      // Update total items count
      const itemCount = await Item.count({ where: { ngoId } });
      await ngo.update({ totalItems: itemCount });

      // Update total donations
      const donationStats = await Transaction.findAll({
        attributes: [
          [sequelize.fn('SUM', sequelize.col('ngoDonation')), 'totalDonations']
        ],
        where: { ngoId }
      });

      const totalDonations = donationStats[0]?.dataValues.totalDonations || 0;
      await ngo.update({ totalDonations });

      return ngo;
    } catch (error) {
      throw new Error(`Failed to update NGO stats: ${error.message}`);
    }
  }

  async addNGOReview(ngoId, rating, reviewText, userId) {
    try {
      const ngo = await NGO.findByPk(ngoId);
      if (!ngo) {
        throw new Error('NGO not found');
      }

      // Update NGO rating
      await ngo.updateRating(rating);

      // In a real application, you would also create a review record
      // For now, we'll just update the NGO's rating

      return ngo;
    } catch (error) {
      throw new Error(`Failed to add NGO review: ${error.message}`);
    }
  }
}

module.exports = new NGOService();
