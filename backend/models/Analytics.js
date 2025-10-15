const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  taskId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  action: {
    type: String,
    enum: ['assigned', 'started', 'completed'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  completionTime: {
    type: Number, // in hours
    min: 0
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Index for better query performance
analyticsSchema.index({ userId: 1, action: 1 });
analyticsSchema.index({ taskId: 1 });
analyticsSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
