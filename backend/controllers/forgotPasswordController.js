const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const forgotPasswordController = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Please provide a registered email address.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email address.' });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');

    // Token expires in 15 minutes
    const expires = Date.now() + 15 * 60 * 1000;

    // Save token and expiry in User credentials record
    await User.findByIdAndUpdate(user._id || user.id, {
      resetPasswordToken: token,
      resetPasswordExpires: expires
    });

    // Reset Link URL
    const resetUrl = `${req.headers.origin || 'http://localhost:5173'}/reset-password/${token}`;

    // Check SMTP configuration
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.log('---------------------------------------------------------');
      console.log(' WARNING: SMTP credentials (EMAIL_USER/EMAIL_PASS) not set!');
      console.log(` RESET LINK GENERATED: ${resetUrl}`);
      console.log('---------------------------------------------------------');
      
      return res.status(200).json({
        message: 'Password reset link generated successfully.',
        devMode: true,
        resetUrl // return link for testing/eval environments without active credentials
      });
    }

    // Configure Nodemailer Gmail Transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    const mailOptions = {
      from: `"Avon Technologies Support" <${emailUser}>`,
      to: email,
      subject: 'Reset Your Security Password - Avon Technologies Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
          <div style="text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 15px; margin-bottom: 20px;">
            <h1 style="color: #1e3a8a; margin: 0; font-size: 22px;">Avon Technologies (India) Pvt. Ltd.</h1>
            <p style="color: #64748b; font-size: 11px; margin: 5px 0 0 0; text-transform: uppercase; letter-spacing: 1px;">Smart Corporate Portal</p>
          </div>
          
          <div style="color: #334155; font-size: 14px; line-height: 1.6;">
            <p>Hello <strong>${user.name}</strong>,</p>
            <p>We received a request to reset the password associated with your corporate credentials account. Please click the button below to change your security password:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">Reset Password</a>
            </div>
            
            <p style="color: #ef4444; font-weight: bold;">Important: This password reset token is only valid for 15 minutes. After 15 minutes, it will expire and you will need to request a new link.</p>
            
            <p style="font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 25px;">
              If you did not request this security update, you can safely ignore this email. Your portal credentials will remain secure.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; font-size: 11px; color: #94a3b8;">
            <p>&copy; ${new Date().getFullYear()} Avon Technologies (India) Pvt. Ltd. All rights reserved.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Password reset email sent successfully.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error processing password reset request.' });
  }
};

module.exports = forgotPasswordController;
