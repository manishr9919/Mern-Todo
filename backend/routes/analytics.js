const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getUserPerformance,
  getTaskAnalytics
} = require('../controllers/analyticsController');
const { auth, adminAuth } = require('../middleware/auth');

// @route   GET /api/analytics/dashboard
// @desc    Get dashboard analytics (Admin only)
// @access  Private (Admin)
router.get('/dashboard', auth, adminAuth, getDashboardAnalytics);

// @route   GET /api/analytics/user/:userId
// @desc    Get user performance analytics
// @access  Private
router.get('/user/:userId', auth, getUserPerformance);

// @route   GET /api/analytics/task/:taskId
// @desc    Get task analytics
// @access  Private
router.get('/task/:taskId', auth, getTaskAnalytics);

module.exports = router;
