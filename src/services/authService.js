const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models');
const emailService = require('./emailService');

class AuthService {
  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    this.jwtExpiry = process.env.JWT_EXPIRY || '24h';
    this.refreshTokenExpiry = process.env.REFRESH_TOKEN_EXPIRY || '7d';
  }

  async register(userData) {
    try {
      const { name, email, password } = userData;
      
      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      // Create new user
      const user = await User.create({
        name,
        email,
        password,
        emailVerificationToken,
        greenScore: 100 // Set initial green score
      });

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Save refresh token to database
      await this.saveRefreshToken(user.id, refreshToken);

      // Send welcome email (non-blocking)
      emailService.sendWelcomeEmail(email, name).catch(err => 
        console.log('Welcome email failed:', err.message)
      );

      // Send email verification (non-blocking)
      emailService.sendEmailVerification(email, emailVerificationToken, name).catch(err => 
        console.log('Email verification failed:', err.message)
      );

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
  }

  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Validate password
      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      await user.update({ lastLogin: new Date() });

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      // Save refresh token to database
      await this.saveRefreshToken(user.id, refreshToken);

      return {
        user: user.toJSON(),
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new Error(`Login failed: ${error.message}`);
    }
  }

  generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        type: 'access'
      },
      this.jwtSecret,
      { expiresIn: this.jwtExpiry }
    );
  }

  generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id,
        type: 'refresh'
      },
      this.jwtSecret,
      { expiresIn: this.refreshTokenExpiry }
    );
  }

  verifyAccessToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid access token');
    }
  }

  verifyRefreshToken(token) {
    try {
      const decoded = jwt.verify(token, this.jwtSecret);
      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }
      return decoded;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async saveRefreshToken(userId, refreshToken) {
    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

      await User.update(
        { 
          refreshToken,
          refreshTokenExpires: expiresAt
        },
        { where: { id: userId } }
      );
    } catch (error) {
      throw new Error(`Failed to save refresh token: ${error.message}`);
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      // Verify refresh token
      const decoded = this.verifyRefreshToken(refreshToken);
      
      // Find user and check if refresh token is valid
      const user = await User.findByPk(decoded.id);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      if (user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      if (user.refreshTokenExpires && user.refreshTokenExpires < new Date()) {
        throw new Error('Refresh token expired');
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      return {
        accessToken: newAccessToken,
        user: user.toJSON()
      };
    } catch (error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
  }

  async forgotPassword(email) {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date();
      resetExpires.setHours(resetExpires.getHours() + 1); // 1 hour from now

      // Save reset token to database
      await user.update({
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      });

      // Send password reset email
      await emailService.sendPasswordResetEmail(email, resetToken, user.name);

      return { message: 'Password reset email sent successfully' };
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        where: {
          passwordResetToken: token,
          passwordResetExpires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password and clear reset token
      await user.update({
        password: newPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      });

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw new Error(`Password reset failed: ${error.message}`);
    }
  }

  async updateProfile(userId, updateData) {
    try {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Remove sensitive fields that shouldn't be updated via profile
      const { password, email, role, isActive, ...allowedUpdates } = updateData;

      await user.update(allowedUpdates);

      return user.toJSON();
    } catch (error) {
      throw new Error(`Profile update failed: ${error.message}`);
    }
  }

  async verifyEmail(token) {
    try {
      const user = await User.findOne({
        where: {
          emailVerificationToken: token
        }
      });

      if (!user) {
        throw new Error('Invalid verification token');
      }

      await user.update({
        emailVerified: true,
        emailVerificationToken: null
      });

      return { message: 'Email verified successfully' };
    } catch (error) {
      throw new Error(`Email verification failed: ${error.message}`);
    }
  }

  async logout(userId) {
    try {
      await User.update(
        { 
          refreshToken: null,
          refreshTokenExpires: null
        },
        { where: { id: userId } }
      );

      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
  }
}

module.exports = new AuthService();
