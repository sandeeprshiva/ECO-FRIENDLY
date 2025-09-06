const ngoService = require('../services/ngoService');

class NGOController {
  async createNGO(req, res) {
    try {
      const ngoData = req.body;

      const ngo = await ngoService.createNGO(ngoData);

      res.status(201).json({
        message: 'NGO created successfully',
        data: ngo
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to create NGO',
        message: error.message
      });
    }
  }

  async getNGOs(req, res) {
    try {
      const filters = req.query;
      const result = await ngoService.getNGOs(filters);

      res.json({
        message: 'NGOs retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch NGOs',
        message: error.message
      });
    }
  }

  async getNGOById(req, res) {
    try {
      const { id } = req.params;
      
      const ngo = await ngoService.getNGOById(id);

      res.json({
        message: 'NGO retrieved successfully',
        data: ngo
      });
    } catch (error) {
      res.status(404).json({
        error: 'NGO not found',
        message: error.message
      });
    }
  }

  async updateNGO(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const userId = req.user.id;
      const userRole = req.user.role;

      const ngo = await ngoService.updateNGO(id, updateData, userId, userRole);

      res.json({
        message: 'NGO updated successfully',
        data: ngo
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to update NGO',
        message: error.message
      });
    }
  }

  async deleteNGO(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const userRole = req.user.role;

      const result = await ngoService.deleteNGO(id, userId, userRole);

      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to delete NGO',
        message: error.message
      });
    }
  }

  async verifyNGO(req, res) {
    try {
      const { id } = req.params;
      const verifiedBy = req.user.id;

      const ngo = await ngoService.verifyNGO(id, verifiedBy);

      res.json({
        message: 'NGO verified successfully',
        data: ngo
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to verify NGO',
        message: error.message
      });
    }
  }

  async getNGOStats(req, res) {
    try {
      const ngoId = req.query.ngoId;
      const stats = await ngoService.getNGOStats(ngoId);

      res.json({
        message: 'NGO statistics retrieved successfully',
        data: stats
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch NGO statistics',
        message: error.message
      });
    }
  }

  async getNGOItems(req, res) {
    try {
      const { id } = req.params;
      const filters = req.query;

      const result = await ngoService.getNGOItems(id, filters);

      res.json({
        message: 'NGO items retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to fetch NGO items',
        message: error.message
      });
    }
  }

  async addNGOReview(req, res) {
    try {
      const { id } = req.params;
      const { rating, reviewText } = req.body;
      const userId = req.user.id;

      const ngo = await ngoService.addNGOReview(id, rating, reviewText, userId);

      res.json({
        message: 'NGO review added successfully',
        data: ngo
      });
    } catch (error) {
      res.status(400).json({
        error: 'Failed to add NGO review',
        message: error.message
      });
    }
  }
}

module.exports = new NGOController();
