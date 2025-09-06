const { Transaction, User, Item, NGO, sequelize } = require('../models');
const { Op } = require('sequelize');

class TransactionService {
  async createTransaction(transactionData, buyerId) {
    try {
      const transaction = await Transaction.create({
        ...transactionData,
        buyerId
      });

      // Calculate fees
      await transaction.calculateFees();

      return transaction;
    } catch (error) {
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  }

  async getTransactions(filters = {}) {
    try {
      const {
        buyerId,
        sellerId,
        status,
        paymentMethod,
        startDate,
        endDate,
        limit = 20,
        offset = 0,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = filters;

      const whereClause = {};

      if (buyerId) whereClause.buyerId = buyerId;
      if (sellerId) whereClause.sellerId = sellerId;
      if (status) whereClause.status = status;
      if (paymentMethod) whereClause.paymentMethod = paymentMethod;

      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt[Op.gte] = new Date(startDate);
        if (endDate) whereClause.createdAt[Op.lte] = new Date(endDate);
      }

      const transactions = await Transaction.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'buyer',
            attributes: ['id', 'name', 'avatar', 'email']
          },
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'avatar', 'email']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'title', 'images', 'price', 'category']
          },
          {
            model: NGO,
            as: 'ngo',
            attributes: ['id', 'name', 'logo']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        transactions: transactions.rows,
        total: transactions.count,
        hasMore: transactions.count > offset + parseInt(limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  }

  async getTransactionById(id) {
    try {
      const transaction = await Transaction.findByPk(id, {
        include: [
          {
            model: User,
            as: 'buyer',
            attributes: ['id', 'name', 'avatar', 'email', 'phoneNumber']
          },
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'avatar', 'email', 'phoneNumber']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'title', 'description', 'images', 'price', 'category', 'condition']
          },
          {
            model: NGO,
            as: 'ngo',
            attributes: ['id', 'name', 'logo', 'description']
          }
        ]
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      return transaction;
    } catch (error) {
      throw new Error(`Failed to fetch transaction: ${error.message}`);
    }
  }

  async updateTransactionStatus(id, newStatus, notes = null, userId = null) {
    try {
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Check if user can update this transaction
      if (userId && transaction.buyerId !== userId && transaction.sellerId !== userId) {
        throw new Error('Unauthorized to update this transaction');
      }

      await transaction.updateStatus(newStatus, notes);

      // If transaction is completed, mark item as sold
      if (newStatus === 'completed') {
        const item = await Item.findByPk(transaction.itemId);
        if (item) {
          await item.markAsSold();
        }
      }

      return transaction;
    } catch (error) {
      throw new Error(`Failed to update transaction status: ${error.message}`);
    }
  }

  async cancelTransaction(id, reason, userId) {
    try {
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Check if user can cancel this transaction
      if (transaction.buyerId !== userId && transaction.sellerId !== userId) {
        throw new Error('Unauthorized to cancel this transaction');
      }

      // Only allow cancellation if transaction is not completed
      if (['completed', 'cancelled', 'refunded'].includes(transaction.status)) {
        throw new Error('Cannot cancel completed, cancelled, or refunded transaction');
      }

      await transaction.updateStatus('cancelled', reason);

      return transaction;
    } catch (error) {
      throw new Error(`Failed to cancel transaction: ${error.message}`);
    }
  }

  async getTransactionStats(userId = null) {
    try {
      const whereClause = userId ? { [Op.or]: [{ buyerId: userId }, { sellerId: userId }] } : {};

      const stats = await Transaction.findAll({
        attributes: [
          'status',
          'paymentMethod',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount'],
          [sequelize.fn('AVG', sequelize.col('amount')), 'avgAmount'],
          [sequelize.fn('SUM', sequelize.col('platformFee')), 'totalPlatformFee'],
          [sequelize.fn('SUM', sequelize.col('ngoDonation')), 'totalNgoDonation']
        ],
        where: whereClause,
        group: ['status', 'paymentMethod']
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch transaction statistics: ${error.message}`);
    }
  }

  async getUserTransactions(userId, filters = {}) {
    try {
      const {
        role = 'both', // 'buyer', 'seller', 'both'
        status,
        limit = 20,
        offset = 0
      } = filters;

      let whereClause = {};
      
      if (role === 'buyer') {
        whereClause.buyerId = userId;
      } else if (role === 'seller') {
        whereClause.sellerId = userId;
      } else {
        whereClause[Op.or] = [
          { buyerId: userId },
          { sellerId: userId }
        ];
      }

      if (status) whereClause.status = status;

      const transactions = await Transaction.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'buyer',
            attributes: ['id', 'name', 'avatar']
          },
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'avatar']
          },
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'title', 'images', 'price', 'category']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        transactions: transactions.rows,
        total: transactions.count,
        hasMore: transactions.count > offset + parseInt(limit)
      };
    } catch (error) {
      throw new Error(`Failed to fetch user transactions: ${error.message}`);
    }
  }

  async processRefund(id, amount, reason, processedBy) {
    try {
      const transaction = await Transaction.findByPk(id);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.status !== 'completed') {
        throw new Error('Can only refund completed transactions');
      }

      await transaction.updateStatus('refunded', reason);
      transaction.resolvedBy = processedBy;
      await transaction.save();

      return transaction;
    } catch (error) {
      throw new Error(`Failed to process refund: ${error.message}`);
    }
  }
}

module.exports = new TransactionService();
