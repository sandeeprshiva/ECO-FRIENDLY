const itemService = require('../services/itemService');
const { processUploadedImages } = require('../middleware/imageUpload');

class ItemController {
  async createItem(req, res) {
    try {
      const sellerId = req.user.id;
      const itemData = req.body;
      const images = processUploadedImages(req);

      const item = await itemService.createItem(itemData, sellerId, images);

      res.status(201).json({
        message: 'Item created successfully',
        data: item
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to create item',
        message: error.message
      });
    }
  }

  async getItems(req, res) {
    try {
      const filters = req.query;
      const result = await itemService.getItems(filters);

      res.json({
        message: 'Items retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch items',
        message: error.message
      });
    }
  }

  async getItemById(req, res) {
    try {
      const { id } = req.params;
      const incrementViews = req.query.increment === 'true';
      
      const item = await itemService.getItemById(id, incrementViews);

      res.json({
        message: 'Item retrieved successfully',
        data: item
      });
    } catch (error) {
      res.status(404).json({
        error: 'Item not found',
        message: error.message
      });
    }
  }

  async updateItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;
      const images = processUploadedImages(req);

      const item = await itemService.updateItem(id, updateData, userId, userRole, images);

      res.json({
        message: 'Item updated successfully',
        data: item
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to update item',
        message: error.message
      });
    }
  }

  async deleteItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const result = await itemService.deleteItem(id, userId, userRole);

      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to delete item',
        message: error.message
      });
    }
  }

  async markItemAsSold(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const item = await itemService.markItemAsSold(id, userId);

      res.json({
        message: 'Item marked as sold successfully',
        data: item
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to mark item as sold',
        message: error.message
      });
    }
  }

  async getItemStats(req, res) {
    try {
      const stats = await itemService.getItemStats();

      res.json({
        message: 'Item statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch item statistics',
        message: error.message
      });
    }
  }

  async getUserItems(req, res) {
    try {
      const userId = req.user.id;
      const filters = req.query;

      const result = await itemService.getUserItems(userId, filters);

      res.json({
        message: 'User items retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch user items',
        message: error.message
      });
    }
  }

  async restoreItem(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const result = await itemService.restoreItem(id, userId, userRole);

      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to restore item',
        message: error.message
      });
    }
  }

  async searchItems(req, res) {
    try {
      const { q: query, ...filters } = req.query;

      if (!query) {
        return res.status(400).json({
          error: 'Search query is required',
          message: 'Please provide a search query'
        });
      }

      const result = await itemService.searchItems(query, filters);

      res.json({
        message: 'Search completed successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Search failed',
        message: error.message
      });
    }
  }

  async getFeaturedItems(req, res) {
    try {
      const limit = req.query.limit || 10;
      const items = await itemService.getFeaturedItems(limit);

      res.json({
        message: 'Featured items retrieved successfully',
        data: items
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch featured items',
        message: error.message
      });
    }
  }

  async getSimilarItems(req, res) {
    try {
      const { id } = req.params;
      const limit = req.query.limit || 5;

      const items = await itemService.getSimilarItems(id, limit);

      res.json({
        message: 'Similar items retrieved successfully',
        data: items
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch similar items',
        message: error.message
      });
    }
  }

  async getAvailableFilters(req, res) {
    try {
      const categories = await itemService.getAvailableCategories();
      const brands = await itemService.getAvailableBrands();

      res.json({
        message: 'Available filters retrieved successfully',
        data: {
          categories,
          brands,
          conditions: ['new', 'like_new', 'good', 'fair', 'poor'],
          transactionTypes: ['sale', 'donation', 'exchange', 'rental']
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch available filters',
        message: error.message
      });
    }
  }
}

module.exports = new ItemController();
