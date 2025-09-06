const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendPasswordResetEmail(email, resetToken, userName) {
    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      const mailOptions = {
        from: `"EcoFriend" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset Request - EcoFriend',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h1>🌱 EcoFriend</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              <h2>Password Reset Request</h2>
              <p>Hello ${userName},</p>
              <p>We received a request to reset your password for your EcoFriend account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Reset Password
                </a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <p><strong>This link will expire in 1 hour.</strong></p>
              <p>If you didn't request this password reset, please ignore this email.</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">
                This email was sent from EcoFriend. If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email, userName) {
    try {
      const mailOptions = {
        from: `"EcoFriend" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Welcome to EcoFriend! 🌱',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h1>🌱 Welcome to EcoFriend!</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              <h2>Hello ${userName}!</h2>
              <p>Welcome to EcoFriend, the eco-friendly marketplace where you can buy, sell, and donate items while making a positive impact on the environment.</p>
              
              <h3>🎉 You've earned 100 Green Points!</h3>
              <p>As a welcome gift, we've added 100 points to your Green Score. Start earning more points by:</p>
              <ul>
                <li>🛍️ Buying eco-friendly items</li>
                <li>💰 Selling your unused items</li>
                <li>🎁 Donating to verified NGOs</li>
                <li>♻️ Participating in sustainable practices</li>
              </ul>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL}/dashboard" 
                   style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Start Your Eco Journey
                </a>
              </div>
              
              <p>Thank you for joining our mission to create a more sustainable future!</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 12px;">
                This email was sent from EcoFriend. If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't throw error for welcome email as it's not critical
      return { success: false, error: error.message };
    }
  }

  async sendEmailVerification(email, verificationToken, userName) {
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      
      const mailOptions = {
        from: `"EcoFriend" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - EcoFriend',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #4CAF50; color: white; padding: 20px; text-align: center;">
              <h1>🌱 EcoFriend</h1>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              <h2>Verify Your Email Address</h2>
              <p>Hello ${userName},</p>
              <p>Please verify your email address to complete your EcoFriend account setup.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  Verify Email
                </a>
              </div>
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account with EcoFriend, please ignore this email.</p>
            </div>
          </div>
        `
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email verification sent:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Error sending email verification:', error);
      throw new Error('Failed to send email verification');
    }
  }
}

module.exports = new EmailService();
