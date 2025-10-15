const Task = require('../models/Task');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      priority,
      dueDate
    });

    await task.save();

    // Create analytics record
    await Analytics.create({
      userId: assignedTo,
      taskId: task._id,
      action: 'assigned'
    });

    // Populate user details
    await task.populate('assignedTo', 'name email');
    await task.populate('assignedBy', 'name email');

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const { status, assignedTo, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tasks = await Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Task.countDocuments(filter);

    res.json({
      tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = { assignedTo: req.user._id };
    if (status) filter.status = status;

    const tasks = await Task.find(filter)
      .populate('assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    const task = await Task.findOne({ _id: taskId, assignedTo: req.user._id });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const oldStatus = task.status;
    task.status = status;
    await task.save();

    // Create analytics record for status change
    await Analytics.create({
      userId: req.user._id,
      taskId: task._id,
      action: status === 'completed' ? 'completed' : 'started',
      completionTime: status === 'completed' ? task.completionTime : null
    });

    res.json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(
      taskId,
      updates,
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email').populate('assignedBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findByIdAndDelete(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Delete related analytics
    await Analytics.deleteMany({ taskId });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getUserTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
  getTaskById
};
