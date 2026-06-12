const express = require('express');
const { loginUser, registerUser, googleLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser); // Public endpoint for Signup page
router.post('/google', googleLogin); // Public endpoint for Continue with Google
router.get('/me', protect, getMe);

module.exports = router;
