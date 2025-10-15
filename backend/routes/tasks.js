const express = require('express');
const router = express.Router();
const {
  createTask,
  getAllTasks,
  getUserTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getTaskById
} = require('../controllers/taskController');
const { validateTask, validateTaskStatus } = require('../middleware/validation');
const { auth, adminAuth } = require('../middleware/auth');

// @route   POST /api/tasks
// @desc    Create a new task (Admin only)
// @access  Private (Admin)
router.post('/', auth, adminAuth, validateTask, createTask);

// @route   GET /api/tasks
// @desc    Get all tasks (Admin only)
// @access  Private (Admin)
router.get('/', auth, adminAuth, getAllTasks);

// @route   GET /api/tasks/user
// @desc    Get user's tasks
// @access  Private
router.get('/user', auth, getUserTasks);

// @route   GET /api/tasks/:taskId
// @desc    Get task by ID
// @access  Private
router.get('/:taskId', auth, getTaskById);

// @route   PUT /api/tasks/:taskId
// @desc    Update task (Admin only)
// @access  Private (Admin)
router.put('/:taskId', auth, adminAuth, updateTask);

// @route   DELETE /api/tasks/:taskId
// @desc    Delete task (Admin only)
// @access  Private (Admin)
router.delete('/:taskId', auth, adminAuth, deleteTask);

// @route   PUT /api/tasks/:taskId/status
// @desc    Update task status (User)
// @access  Private
router.put('/:taskId/status', auth, validateTaskStatus, updateTaskStatus);

module.exports = router;
