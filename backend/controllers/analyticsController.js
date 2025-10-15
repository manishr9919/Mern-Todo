const Task = require('../models/Task');
const User = require('../models/User');
const Analytics = require('../models/Analytics');

const getDashboardAnalytics = async (req, res) => {
  try {
    // Overall task statistics
    const totalTasks = await Task.countDocuments();
    const completedTasks = await Task.countDocuments({ status: 'completed' });
    const pendingTasks = await Task.countDocuments({ status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ status: 'in-progress' });

    // User statistics
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });

    // Completion rate
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Recent activity
    const recentTasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .sort({ updatedAt: -1 })
      .limit(5);

    // Task completion over time (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completionOverTime = await Analytics.aggregate([
      {
        $match: {
          action: 'completed',
          timestamp: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      overview: {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
        completionRate: Math.round(completionRate * 100) / 100
      },
      users: {
        totalUsers,
        adminUsers,
        regularUsers
      },
      recentTasks,
      completionOverTime
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserPerformance = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // User task statistics
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

    // Average completion time
    const completedTasksWithTime = await Task.find({
      assignedTo: userId,
      status: 'completed',
      completedAt: { $exists: true }
    });

    const avgCompletionTime = completedTasksWithTime.length > 0 
      ? completedTasksWithTime.reduce((sum, task) => {
          const completionTime = (task.completedAt - task.createdAt) / (1000 * 60 * 60); // hours
          return sum + completionTime;
        }, 0) / completedTasksWithTime.length
      : 0;

    // Recent activity
    const recentActivity = await Analytics.find({ userId })
      .populate('taskId', 'title status')
      .sort({ timestamp: -1 })
      .limit(10);

    // Task completion over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const completionOverTime = await Analytics.aggregate([
      {
        $match: {
          userId: user._id,
          action: 'completed',
          timestamp: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

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
        completionRate: Math.round(completionRate * 100) / 100,
        avgCompletionTime: Math.round(avgCompletionTime * 100) / 100
      },
      recentActivity,
      completionOverTime
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTaskAnalytics = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Task activity history
    const activityHistory = await Analytics.find({ taskId })
      .sort({ timestamp: -1 });

    // Calculate completion time if task is completed
    let completionTime = null;
    if (task.status === 'completed' && task.completedAt) {
      completionTime = (task.completedAt - task.createdAt) / (1000 * 60 * 60); // hours
    }

    res.json({
      task,
      activityHistory,
      completionTime: completionTime ? Math.round(completionTime * 100) / 100 : null
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboardAnalytics,
  getUserPerformance,
  getTaskAnalytics
};
