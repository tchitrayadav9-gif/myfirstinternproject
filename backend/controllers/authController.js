const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id }, 
    process.env.JWT_SECRET || 'avon_smart_portal_enterprise_key_2026', 
    { expiresIn: '7d' }
  );
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide corporate email and password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    // Google-only users might not have a password
    if (!user.password) {
      return res.status(400).json({ message: 'This account is registered via Google. Please use Continue with Google.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    res.json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id || user.id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login processing.' });
  }
};

// @desc    Register a new user (Public)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password, role, department, avatarUrl } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Corporate email is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Employee',
      department: department || 'Engineering',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256'
    });

    res.status(201).json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id || user.id) // Automatically log in on signup
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during user creation.' });
  }
};

// @desc    Google OAuth Sign-In / Sign-Up
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { name, email, googleId, avatarUrl, role } = req.body;

  try {
    if (!email || !googleId) {
      return res.status(400).json({ message: 'Google authentication payload is missing parameters.' });
    }

    let user = await User.findOne({ email });

    if (user) {
      // User exists - associate googleId if not already present
      if (!user.googleId) {
        await User.findByIdAndUpdate(user._id || user.id, { googleId, avatarUrl: avatarUrl || user.avatarUrl });
      }
    } else {
      // Create a new Google-integrated account
      user = await User.create({
        name,
        email,
        googleId,
        role: role || 'Employee',
        department: 'Operations',
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256'
      });
    }

    res.json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl,
      token: generateToken(user._id || user.id)
    });
  } catch (error) {
    console.error('Google login controller error:', error);
    res.status(500).json({ message: 'Server error processing Google authentication.' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    res.json({
      _id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      avatarUrl: user.avatarUrl
    });
  } catch (error) {
    console.error('Profile fetching error:', error);
    res.status(500).json({ message: 'Server error fetching user details.' });
  }
};

module.exports = {
  loginUser,
  registerUser,
  googleLogin,
  getMe
};
