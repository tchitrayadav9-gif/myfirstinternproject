const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const connectDB = require('../config/db');

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

  console.log('Login Started');
  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide corporate email and password.' });
    }

    console.log('Searching User');
    console.log('Searching MongoDB...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User Not Found');
      console.log('Database query result: null');
      return res.status(401).json({ message: 'Invalid credentials. User not found.' });
    }

    console.log('User Found');

    // Accounts created without password cannot use this flow
    if (!user.password) {
      return res.status(400).json({ message: 'This account does not have a local password configured.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password Mismatch');
      return res.status(401).json({ message: 'Invalid credentials. Password incorrect.' });
    }

    console.log('Password Verified');
    console.log('Password Match');

    const token = generateToken(user._id || user.id);
    console.log('JWT Generated');
    console.log('Login Success');

    res.json({
      success: true,
      token,
      user: {
        _id: user._id || user.id,
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        avatarUrl: user.avatarUrl
      }
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

  console.log('Signup Started');
  try {
    await connectDB();
    console.log('MongoDB Connected');

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password.' });
    }

    console.log('Validation Passed');

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Corporate email is already registered.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Hash Created');

    console.log('Saving User...');
    // Normalize role to lowercase as per Task 4: Store: role = "admin", role = "employee"
    const normalizedRole = (role && role.toLowerCase().includes('admin')) ? 'admin' : 'employee';

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      department: department || 'Engineering',
      avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256&h=256'
    });

    console.log('User Saved');

    // Wait until MongoDB confirms insertion
    const confirmedUser = await User.findById(user._id || user.id);
    if (!confirmedUser) {
      throw new Error('Database insertion verification failed.');
    }

    console.log('User Saved Successfully');
    console.log('MongoDB ObjectId:', confirmedUser._id || confirmedUser.id);
    console.log('Email:', confirmedUser.email);
    console.log('Role:', confirmedUser.role);

    res.status(201).json({
      success: true,
      _id: confirmedUser._id || confirmedUser.id,
      name: confirmedUser.name,
      email: confirmedUser.email,
      role: confirmedUser.role,
      department: confirmedUser.department,
      avatarUrl: confirmedUser.avatarUrl,
      token: generateToken(confirmedUser._id || confirmedUser.id)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: `Server error during user creation: ${error.message}` });
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

    // Accounts without password cannot use this flow
    if (!user.password) {
      return res.status(400).json({ message: 'Passwords cannot be changed for accounts without an existing password.' });
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
  getMe,
  updateProfile,
  changePassword
};
