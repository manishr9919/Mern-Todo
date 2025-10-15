const User = require('../models/User');
const Task = require('../models/Task');

const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove password from updates if present
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user has assigned tasks
    const assignedTasks = await Task.find({ assignedTo: userId });
    if (assignedTasks.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete user with assigned tasks. Please reassign or complete tasks first.' 
      });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserStats = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const completedTasks = await Task.countDocuments({ 
      assignedTo: userId, 
      status: 'completed' 
    });
    const pendingTasks = await Task.countDocuments({ 
      assignedTo: userId, 
      status: 'pending' 
    });
    const inProgressTasks = await Task.countDocuments({ 
      assignedTo: userId, 
      status: 'in-progress' 
    });

    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      stats: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        completionRate: Math.round(completionRate * 100) / 100
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats
};
