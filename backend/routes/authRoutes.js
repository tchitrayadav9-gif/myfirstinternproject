const express = require('express');
const { 
  loginUser, 
  registerUser, 
  getMe,
  updateProfile,
  changePassword,
  getDashboardStats
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const forgotPasswordController = require('../controllers/forgotPasswordController');
const resetPasswordController = require('../controllers/resetPasswordController');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser); // Public endpoint for Signup page
router.post('/forgot-password', forgotPasswordController);
router.post('/reset-password/:token', resetPasswordController);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.get('/dashboard-stats', protect, getDashboardStats);

module.exports = router;
