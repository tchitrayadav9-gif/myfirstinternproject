const bcrypt = require('bcryptjs');
const User = require('../models/User');

const resetPasswordController = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    if (!password || !confirmPassword) {
      return res.status(400).json({ message: 'Please provide new password and confirmation.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Find user with active, unexpired reset token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    // Hash new password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token details
    await User.findByIdAndUpdate(user._id || user.id, {
      password: hashedPassword,
      $unset: {
        resetPasswordToken: 1,
        resetPasswordExpires: 1
      }
    });

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error updating password.' });
  }
};

module.exports = resetPasswordController;
