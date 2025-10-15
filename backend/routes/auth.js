const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/authController');
const { validateUser, validateLogin } = require('../middleware/validation');
const { auth } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateUser, register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, login);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, getProfile);

module.exports = router;
