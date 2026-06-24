const express = require('express');
const { 
  loginUser, 
  registerUser, 
  googleLogin, 
  getMe,
  updateProfile,
  changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser); // Public endpoint for Signup page
router.post('/google', googleLogin); // Public endpoint for Continue with Google
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

module.exports = router;
