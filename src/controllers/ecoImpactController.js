const ecoImpactService = require('../services/ecoImpactService');

class EcoImpactController {
  async createEcoImpact(req, res) {
    try {
      const impactData = req.body;

      const ecoImpact = await ecoImpactService.createEcoImpact(impactData);

      res.status(201).json({
        message: 'Eco impact created successfully',
        data: ecoImpact
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to create eco impact',
        message: error.message
      });
    }
  }

  async getEcoImpacts(req, res) {
    try {
      const filters = req.query;
      const result = await ecoImpactService.getEcoImpacts(filters);

      res.json({
        message: 'Eco impacts retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch eco impacts',
        message: error.message
      });
    }
  }

  async getEcoImpactById(req, res) {
    try {
      const { id } = req.params;
      
      const ecoImpact = await ecoImpactService.getEcoImpactById(id);

      res.json({
        message: 'Eco impact retrieved successfully',
        data: ecoImpact
      });
    } catch (error) {
      res.status(404).json({
        error: 'Eco impact not found',
        message: error.message
      });
    }
  }

  async updateEcoImpact(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      const ecoImpact = await ecoImpactService.updateEcoImpact(id, updateData, userId, userRole);

      res.json({
        message: 'Eco impact updated successfully',
        data: ecoImpact
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to update eco impact',
        message: error.message
      });
    }
  }

  async deleteEcoImpact(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const result = await ecoImpactService.deleteEcoImpact(id, userId, userRole);

      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to delete eco impact',
        message: error.message
      });
    }
  }

  async verifyEcoImpact(req, res) {
    try {
      const { id } = req.params;
      const verifiedBy = req.user.id;

      const ecoImpact = await ecoImpactService.verifyEcoImpact(id, verifiedBy);

      res.json({
        message: 'Eco impact verified successfully',
        data: ecoImpact
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to verify eco impact',
        message: error.message
      });
    }
  }

  async getEcoImpactStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await ecoImpactService.getUserEcoImpactStats(userId);

      res.json({
        message: 'Eco impact statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch eco impact statistics',
        message: error.message
      });
    }
  }

  async getGlobalEcoImpactStats(req, res) {
    try {
      const stats = await ecoImpactService.getGlobalEcoImpactStats();

      res.json({
        message: 'Global eco impact statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch global eco impact statistics',
        message: error.message
      });
    }
  }

  async getEcoImpactByCategory(req, res) {
    try {
      const stats = await ecoImpactService.getEcoImpactByCategory();

      res.json({
        message: 'Eco impact by category retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch eco impact by category',
        message: error.message
      });
    }
  }

  async getTopEcoUsers(req, res) {
    try {
      const limit = req.query.limit || 10;
      const users = await ecoImpactService.getTopEcoUsers(limit);

      res.json({
        message: 'Top eco users retrieved successfully',
        data: users
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch top eco users',
        message: error.message
      });
    }
  }

  async getUserEcoImpactStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await ecoImpactService.getUserEcoImpactStats(userId);

      res.json({
        message: 'User eco impact statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch user eco impact statistics',
        message: error.message
      });
    }
  }
}

module.exports = new EcoImpactController();
