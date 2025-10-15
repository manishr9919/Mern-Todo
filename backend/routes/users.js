const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin)
router.get('/', auth, adminAuth, getAllUsers);

// @route   GET /api/users/:userId
// @desc    Get user by ID
// @access  Private
router.get('/:userId', auth, getUserById);

// @route   PUT /api/users/:userId
// @desc    Update user (Admin only)
// @access  Private (Admin)
router.put('/:userId', auth, adminAuth, updateUser);

// @route   DELETE /api/users/:userId
// @desc    Delete user (Admin only)
// @access  Private (Admin)
router.delete('/:userId', auth, adminAuth, deleteUser);

// @route   GET /api/users/:userId/stats
// @desc    Get user statistics
// @access  Private
router.get('/:userId/stats', auth, getUserStats);

module.exports = router;
