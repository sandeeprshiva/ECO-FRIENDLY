const { Item, User, NGO, EcoImpact, sequelize } = require('../models');
const { Op } = require('sequelize');
const ecoImpactCalculationService = require('./ecoImpactCalculationService');
const greenScoreService = require('./greenScoreService');

class ItemService {
  async createItem(itemData, sellerId, images = []) {
    try {
      // Calculate eco impact automatically
      const ecoImpact = ecoImpactCalculationService.calculateItemEcoImpact(itemData);
      
      const item = await Item.create({
        ...itemData,
        sellerId,
        images: images.map(img => img.url),
        ecoSavings: ecoImpact
      });

      // Award Green Score points for listing
      await greenScoreService.updateGreenScoreForListing(item.id);

      // Create eco impact record
      await this.calculateEcoImpact(item.id, sellerId, ecoImpact, 'sale');

      return item;
    } catch (error) {
      throw new Error(`Failed to create item: ${error.message}`);
    }
  }

  async getItems(filters = {}) {
    try {
      const {
        category,
        condition,
        transactionType,
        minPrice,
        maxPrice,
        location,
        search,
        sellerId,
        ngoId,
        brand,
        model,
        year,
        minYear,
        maxYear,
        tags,
        isActive = true,
        isSold = false,
        status = 'active',
        limit = 20,
        offset = 0,
        sortBy = 'createdAt',
        sortOrder = 'DESC',
        radius, // For location-based search
        latitude,
        longitude
      } = filters;

      const whereClause = { isActive, isSold };

      // Basic filters
      if (category) whereClause.category = category;
      if (condition) whereClause.condition = condition;
      if (transactionType) whereClause.transactionType = transactionType;
      if (sellerId) whereClause.sellerId = sellerId;
      if (ngoId) whereClause.ngoId = ngoId;
      if (brand) whereClause.brand = { [Op.iLike]: `%${brand}%` };
      if (model) whereClause.model = { [Op.iLike]: `%${model}%` };
      if (status) whereClause.status = status;

      // Price range filter
      if (minPrice || maxPrice) {
        whereClause.price = {};
        if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
      }

      // Year range filter
      if (minYear || maxYear) {
        whereClause.year = {};
        if (minYear) whereClause.year[Op.gte] = parseInt(minYear);
        if (maxYear) whereClause.year[Op.lte] = parseInt(maxYear);
      } else if (year) {
        whereClause.year = parseInt(year);
      }

      // Tags filter
      if (tags) {
        const tagArray = Array.isArray(tags) ? tags : [tags];
        whereClause.tags = { [Op.overlap]: tagArray };
      }

      // Location filter
      if (location) {
        whereClause[Op.or] = [
          { location: { [Op.iLike]: `%${location}%` } },
          { '$seller.location$': { [Op.iLike]: `%${location}%` } }
        ];
      }

      // Geographic search (if coordinates provided)
      if (latitude && longitude && radius) {
        // This would require PostGIS extension for proper geographic queries
        // For now, we'll use a simple bounding box approximation
        const latRange = radius / 111; // Rough conversion: 1 degree ≈ 111 km
        const lngRange = radius / (111 * Math.cos(latitude * Math.PI / 180));
        
        whereClause.coordinates = {
          [Op.and]: [
            { [Op.gte]: longitude - lngRange },
            { [Op.lte]: longitude + lngRange },
            { [Op.gte]: latitude - latRange },
            { [Op.lte]: latitude + latRange }
          ]
        };
      }

      // Search filter
      if (search) {
        const searchConditions = [
          { title: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } },
          { brand: { [Op.iLike]: `%${search}%` } },
          { model: { [Op.iLike]: `%${search}%` } },
          { subcategory: { [Op.iLike]: `%${search}%` } }
        ];

        // Add tag search
        if (search.includes(',')) {
          const searchTags = search.split(',').map(tag => tag.trim());
          searchConditions.push({ tags: { [Op.overlap]: searchTags } });
        } else {
          searchConditions.push({ tags: { [Op.contains]: [search] } });
        }

        whereClause[Op.or] = searchConditions;
      }

      // Build order clause
      let orderClause;
      switch (sortBy) {
        case 'price':
          orderClause = [['price', sortOrder]];
          break;
        case 'title':
          orderClause = [['title', sortOrder]];
          break;
        case 'views':
          orderClause = [['views', sortOrder]];
          break;
        case 'createdAt':
        default:
          orderClause = [['createdAt', sortOrder]];
          break;
      }

      const items = await Item.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'avatar', 'location', 'greenScore', 'isVerified', 'bio']
          },
          {
            model: NGO,
            as: 'ngo',
            attributes: ['id', 'name', 'logo', 'isVerified']
          }
        ],
        order: orderClause,
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true // Important for count with joins
      });

      // Calculate pagination info
      const totalPages = Math.ceil(items.count / parseInt(limit));
      const currentPage = Math.floor(parseInt(offset) / parseInt(limit)) + 1;

      return {
        items: items.rows,
        pagination: {
          total: items.count,
          page: currentPage,
          pages: totalPages,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasNext: currentPage < totalPages,
          hasPrev: currentPage > 1
        },
        filters: {
          applied: Object.keys(filters).filter(key => filters[key] !== undefined),
          available: {
            categories: await this.getAvailableCategories(),
            conditions: ['new', 'like_new', 'good', 'fair', 'poor'],
            transactionTypes: ['sale', 'donation', 'exchange', 'rental'],
            brands: await this.getAvailableBrands(category)
          }
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch items: ${error.message}`);
    }
  }

  async getItemById(id, incrementViews = false) {
    try {
      const item = await Item.findByPk(id, {
        include: [
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'avatar', 'location', 'greenScore', 'isVerified', 'bio']
          },
          {
            model: NGO,
            as: 'ngo',
            attributes: ['id', 'name', 'logo', 'description', 'isVerified']
          }
        ]
      });

      if (!item) {
        throw new Error('Item not found');
      }

      if (incrementViews) {
        await item.incrementViews();
      }

      return item;
    } catch (error) {
      throw new Error(`Failed to fetch item: ${error.message}`);
    }
  }

  async updateItem(id, updateData, userId, userRole, images = []) {
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        throw new Error('Item not found');
      }

      // Check if user can update this item
      if (item.sellerId !== userId && !['admin', 'moderator'].includes(userRole)) {
        throw new Error('Unauthorized to update this item');
      }

      // Handle image updates
      if (images && images.length > 0) {
        updateData.images = images.map(img => img.url);
      }

      // Recalculate eco impact if relevant fields changed
      const fieldsToRecalculate = ['category', 'condition', 'transactionType', 'weight', 'age', 'material'];
      const shouldRecalculate = fieldsToRecalculate.some(field => updateData[field] !== undefined);
      
      if (shouldRecalculate) {
        const newEcoImpact = ecoImpactCalculationService.calculateItemEcoImpact({
          ...item.toJSON(),
          ...updateData
        });
        updateData.ecoSavings = newEcoImpact;
      }

      await item.update(updateData);
      return item;
    } catch (error) {
      throw new Error(`Failed to update item: ${error.message}`);
    }
  }

  async deleteItem(id, userId, userRole) {
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        throw new Error('Item not found');
      }

      // Check if user can delete this item
      if (item.sellerId !== userId && userRole !== 'admin') {
        throw new Error('Unauthorized to delete this item');
      }

      // Soft delete - mark as archived instead of destroying
      await item.update({
        status: 'archived',
        isActive: false
      });

      return { message: 'Item deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete item: ${error.message}`);
    }
  }

  async restoreItem(id, userId, userRole) {
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        throw new Error('Item not found');
      }

      // Check if user can restore this item
      if (item.sellerId !== userId && !['admin', 'moderator'].includes(userRole)) {
        throw new Error('Unauthorized to restore this item');
      }

      await item.update({
        status: 'active',
        isActive: true
      });

      return { message: 'Item restored successfully' };
    } catch (error) {
      throw new Error(`Failed to restore item: ${error.message}`);
    }
  }

  async markItemAsSold(id, userId) {
    try {
      const item = await Item.findByPk(id);
      if (!item) {
        throw new Error('Item not found');
      }

      if (item.sellerId !== userId) {
        throw new Error('Unauthorized to mark this item as sold');
      }

      await item.markAsSold();
      return item;
    } catch (error) {
      throw new Error(`Failed to mark item as sold: ${error.message}`);
    }
  }

  async getItemStats() {
    try {
      const stats = await Item.findAll({
        attributes: [
          'category',
          'condition',
          'transactionType',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
          [sequelize.fn('AVG', sequelize.col('price')), 'avgPrice'],
          [sequelize.fn('SUM', sequelize.col('price')), 'totalValue']
        ],
        where: { isActive: true },
        group: ['category', 'condition', 'transactionType']
      });

      return stats;
    } catch (error) {
      throw new Error(`Failed to fetch item statistics: ${error.message}`);
    }
  }

  async calculateEcoImpact(itemId, userId, ecoSavings, impactType = 'sale') {
    try {
      const ecoImpact = await EcoImpact.create({
        userId,
        itemId,
        co2Saved: ecoSavings.co2Saved || 0,
        waterSaved: ecoSavings.waterSaved || 0,
        wasteReduced: ecoSavings.wasteReduced || 0,
        energySaved: ecoSavings.energySaved || 0,
        impactType,
        calculationMethod: 'automatic'
      });

      await ecoImpact.calculateImpactScore();
      return ecoImpact;
    } catch (error) {
      throw new Error(`Failed to calculate eco impact: ${error.message}`);
    }
  }

  async getUserItems(userId, filters = {}) {
    try {
      const {
        status = 'active',
        limit = 20,
        offset = 0
      } = filters;

      const whereClause = { sellerId: userId };
      
      if (status === 'sold') {
        whereClause.isSold = true;
      } else if (status === 'active') {
        whereClause.isActive = true;
        whereClause.isSold = false;
      } else if (status === 'archived') {
        whereClause.status = 'archived';
      }

      const items = await Item.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: NGO,
            as: 'ngo',
            attributes: ['id', 'name', 'logo']
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
      throw new Error(`Failed to fetch user items: ${error.message}`);
    }
  }

  async getAvailableCategories() {
    try {
      const categories = await Item.findAll({
        attributes: ['category'],
        where: { isActive: true },
        group: ['category'],
        order: [['category', 'ASC']]
      });

      return categories.map(cat => cat.category);
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  }

  async getAvailableBrands(category = null) {
    try {
      const whereClause = { isActive: true };
      if (category) whereClause.category = category;

      const brands = await Item.findAll({
        attributes: ['brand'],
        where: whereClause,
        group: ['brand'],
        order: [['brand', 'ASC']]
      });

      return brands.map(brand => brand.brand).filter(brand => brand);
    } catch (error) {
      console.error('Error fetching brands:', error);
      return [];
    }
  }

  async searchItems(query, filters = {}) {
    try {
      const searchFilters = {
        ...filters,
        search: query
      };

      return await this.getItems(searchFilters);
    } catch (error) {
      throw new Error(`Failed to search items: ${error.message}`);
    }
  }

  async getFeaturedItems(limit = 10) {
    try {
      const items = await Item.findAll({
        where: {
          isActive: true,
          isSold: false,
          status: 'active'
        },
        include: [
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'avatar', 'location', 'greenScore', 'isVerified']
          }
        ],
        order: [
          ['views', 'DESC'],
          ['createdAt', 'DESC']
        ],
        limit: parseInt(limit)
      });

      return items;
    } catch (error) {
      throw new Error(`Failed to fetch featured items: ${error.message}`);
    }
  }

  async getSimilarItems(itemId, limit = 5) {
    try {
      const item = await Item.findByPk(itemId);
      if (!item) {
        throw new Error('Item not found');
      }

      const similarItems = await Item.findAll({
        where: {
          id: { [Op.ne]: itemId },
          category: item.category,
          isActive: true,
          isSold: false,
          status: 'active'
        },
        include: [
          {
            model: User,
            as: 'seller',
            attributes: ['id', 'name', 'avatar', 'location', 'greenScore', 'isVerified']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit)
      });

      return similarItems;
    } catch (error) {
      throw new Error(`Failed to fetch similar items: ${error.message}`);
    }
  }
}

module.exports = new ItemService();
