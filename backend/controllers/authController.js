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
  const { uid, email, displayName, photoURL, role } = req.body;

  console.log('---------------------------------------------------------');
  console.log('Backend request received: POST /api/auth/google');
  console.log('Request payload:', { uid, email, displayName, photoURL, role });

  try {
    if (!email || !uid) {
      console.error('Backend: Google email or uid parameters are missing.');
      return res.status(400).json({ message: 'Google authentication payload is missing parameters (email/uid).' });
    }

    // Connect & find user in MongoDB
    console.log('Backend: Finding user in MongoDB for email:', email);
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('Backend: MongoDB connected. User already exists. Updating lastLogin...');
      user = await User.findByIdAndUpdate(
        user._id || user.id,
        {
          lastLogin: new Date(),
          googleLogin: true,
          googleId: uid,
          uid: uid,
          provider: 'Google'
        },
        { new: true }
      );
      console.log('Backend: User lastLogin and google metadata updated.');
    } else {
      console.log('Backend: MongoDB connected. Creating new user...');
      user = await User.create({
        name: displayName || email.split('@')[0],
        fullName: displayName || email.split('@')[0],
        email,
        googleId: uid,
        uid: uid,
        googleLogin: true,
        role: role || 'Employee',
        department: 'Operations',
        avatarUrl: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256',
        profileImage: photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256',
        provider: 'Google',
        createdAt: new Date(),
        lastLogin: new Date()
      });
      console.log('Backend: User successfully created in MongoDB.');
    }

    console.log('Backend: Generating JWT...');
    const token = generateToken(user._id || user.id);
    
    console.log('Backend: JWT generated successfully.');
    console.log('Backend: Google Login Process complete.');
    console.log('---------------------------------------------------------');

    res.json({
      token,
      user: {
        _id: user._id || user.id,
        id: user._id || user.id,
        name: user.fullName || user.name,
        fullName: user.fullName || user.name,
        email: user.email,
        role: user.role,
        department: user.department || 'Operations',
        avatarUrl: user.profileImage || user.avatarUrl,
        profileImage: user.profileImage || user.avatarUrl,
        provider: user.provider
      }
    });
  } catch (error) {
    console.error('CRITICAL ERROR during Backend Google Authentication:', error);
    res.status(500).json({ 
      message: `Database or JWT Error: ${error.message}`,
      error: error.message 
    });
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

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { name, avatarUrl } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || user.name,
        avatarUrl: avatarUrl || user.avatarUrl
      },
      { new: true }
    );

    // If this is an employee, we should also sync changes with the Employee model!
    if (user.role === 'Employee') {
      const Employee = require('../models/Employee');
      const emp = await Employee.findOne({ email: user.email });
      if (emp) {
        await Employee.findByIdAndUpdate(emp._id || emp.id, {
          name: name || user.name
        });
      }
    }

    res.json({
      _id: updatedUser._id || updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      avatarUrl: updatedUser.avatarUrl
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile details.' });
  }
};

// @desc    Change user password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new passwords.' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Google-only users might not have a password
    if (!user.password) {
      return res.status(400).json({ message: 'Accounts authenticated via Google cannot change passwords. Please log in with Google.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password incorrect.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(req.user.id, { password: hashedPassword });

    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error during password update.' });
  }
};

module.exports = {
  loginUser,
  registerUser,
  googleLogin,
  getMe,
  updateProfile,
  changePassword
};
