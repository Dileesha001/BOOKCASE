const express = require('express');
const router = express.Router();
const Log = require('../models/Log');
const { protect, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/logs
 * @desc    Fetch system and activity logs with pagination and filtering
 * @access  Protected (Admin / Staff)
 */
router.get('/', protect, authorize('admin', 'staff'), async (req, res) => {
  try {
    const { level, action, limit = 50, page = 1 } = req.query;

    const query = {};
    if (level) query.level = level;
    if (action) query.action = { $regex: action, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await Log.find(query)
      .populate('user', 'username email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Log.countDocuments(query);

    res.json({
      success: true,
      count: logs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: logs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/logs/stats
 * @desc    Get logging breakdown by level and top active users
 */
router.get('/stats', protect, authorize('admin'), async (req, res) => {
  try {
    const stats = await Log.aggregate([
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalLogs = await Log.countDocuments();

    res.json({
      success: true,
      data: {
        totalLogs,
        levelBreakdown: stats
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
