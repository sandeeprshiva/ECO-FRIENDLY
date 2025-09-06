const ecoActionService = require('../services/ecoActionService');

class EcoActionController {
  async createEcoAction(req, res) {
    try {
      const userId = req.user.id;
      const actionData = req.body;

      const ecoAction = await ecoActionService.createEcoAction(actionData, userId);

      res.status(201).json({
        message: 'Eco action created successfully',
        data: ecoAction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to create eco action',
        message: error.message
      });
    }
  }

  async getEcoActions(req, res) {
    try {
      const filters = {
        category: req.query.category,
        impactLevel: req.query.impactLevel,
        isVerified: req.query.isVerified === 'true',
        status: req.query.status || 'published',
        limit: req.query.limit || 20,
        offset: req.query.offset || 0,
        search: req.query.search
      };

      const result = await ecoActionService.getEcoActions(filters);

      res.json({
        message: 'Eco actions retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch eco actions',
        message: error.message
      });
    }
  }

  async getEcoActionById(req, res) {
    try {
      const { id } = req.params;
      
      const ecoAction = await ecoActionService.getEcoActionById(id);

      res.json({
        message: 'Eco action retrieved successfully',
        data: ecoAction
      });
    } catch (error) {
      res.status(404).json({
        error: 'Eco action not found',
        message: error.message
      });
    }
  }

  async updateEcoAction(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      const ecoAction = await ecoActionService.updateEcoAction(id, updateData, userId, userRole);

      res.json({
        message: 'Eco action updated successfully',
        data: ecoAction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to update eco action',
        message: error.message
      });
    }
  }

  async deleteEcoAction(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const result = await ecoActionService.deleteEcoAction(id, userId, userRole);

      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to delete eco action',
        message: error.message
      });
    }
  }

  async verifyEcoAction(req, res) {
    try {
      const { id } = req.params;
      const verifiedBy = req.user.id;

      const ecoAction = await ecoActionService.verifyEcoAction(id, verifiedBy);

      res.json({
        message: 'Eco action verified successfully',
        data: ecoAction
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to verify eco action',
        message: error.message
      });
    }
  }

  async getEcoActionStats(req, res) {
    try {
      const stats = await ecoActionService.getEcoActionStats();

      res.json({
        message: 'Eco action statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch eco action statistics',
        message: error.message
      });
    }
  }
}

module.exports = new EcoActionController();
