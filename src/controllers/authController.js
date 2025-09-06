const authService = require('../services/authService');
const { User } = require('../models');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;
      
      const result = await authService.register({
        name,
        email,
        password
      });

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification.',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        error: 'Registration failed',
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const result = await authService.login(email, password);

      res.json({
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        error: 'Login failed',
        message: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      const userId = req.user.id;
      
      const result = await authService.logout(userId);

      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(500).json({
        error: 'Logout failed',
        message: error.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json({
        message: 'Profile retrieved successfully',
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to get profile',
        message: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      
      const user = await authService.updateProfile(userId, updateData);

      res.json({
        message: 'Profile updated successfully',
        data: {
          user
        }
      });
    } catch (error) {
      res.status(400).json({
        error: 'Profile update failed',
        message: error.message
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          error: 'Refresh token required'
        });
      }

      const result = await authService.refreshAccessToken(refreshToken);

      res.json({
        message: 'Token refreshed successfully',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        error: 'Token refresh failed',
        message: error.message
      });
    }
  }

  async forgotPassword(req, res) {
    try {
      const { email } = req.body;
      
      const result = await authService.forgotPassword(email);

      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        error: 'Password reset failed',
        message: error.message
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;
      
      const result = await authService.resetPassword(token, newPassword);

      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        error: 'Password reset failed',
        message: error.message
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.params;
      
      const result = await authService.verifyEmail(token);

      res.json({
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        error: 'Email verification failed',
        message: error.message
      });
    }
  }

  async resendVerification(req, res) {
    try {
      const userId = req.user.id;
      
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      if (user.emailVerified) {
        return res.status(400).json({
          error: 'Email already verified'
        });
      }

      // Generate new verification token
      const emailVerificationToken = require('crypto').randomBytes(32).toString('hex');
      await user.update({ emailVerificationToken });

      // Send verification email
      const emailService = require('../services/emailService');
      await emailService.sendEmailVerification(user.email, emailVerificationToken, user.name);

      res.json({
        message: 'Verification email sent successfully'
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to send verification email',
        message: error.message
      });
    }
  }
}

module.exports = new AuthController();
