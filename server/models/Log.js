const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ['info', 'warn', 'error', 'audit', 'security'],
    default: 'info',
    required: true
  },
  action: {
    type: String,
    required: true,
    index: true // Indexed for fast filtering by event type
  },
  message: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  userAgent: {
    type: String,
    default: ''
  },
  meta: {
    type: mongoose.Schema.Types.Mixed, // Flexible payload for request query/body or error stack trace
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // TTL Index: Automatically expires and deletes log documents after 30 days (2592000 seconds)
    expires: 2592000
  }
});

// Create index on level and createdAt for rapid diagnostic log queries
logSchema.index({ level: 1, createdAt: -1 });

module.exports = mongoose.model('Log', logSchema);
