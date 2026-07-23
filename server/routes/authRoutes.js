const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { logSystemEvent } = require('../middleware/logger');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'bookcase_super_secret_jwt_key_2026', {
    expiresIn: '30d'
  });
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user account
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, fullName, phone, address } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this email or username already exists' });
    }

    const user = await User.create({
      username,
      email,
      password,
      profile: { fullName, phone, address }
    });

    // Log user registration event to MongoDB
    await logSystemEvent({
      level: 'audit',
      action: 'USER_REGISTERED',
      message: `New user account created for ${username} (${email})`,
      userId: user._id
    });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      await logSystemEvent({
        level: 'warn',
        action: 'LOGIN_FAILED',
        message: `Failed login attempt for email: ${email}`
      });
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Log successful login
    await logSystemEvent({
      level: 'audit',
      action: 'USER_LOGIN',
      message: `User ${user.username} logged in successfully`,
      userId: user._id
    });

    res.json({
      success: true,
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 */
router.get('/profile', protect, async (req, res) => {
  res.json({
    success: true,
    data: req.user
  });
});

module.exports = router;
