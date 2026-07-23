const Log = require('../models/Log');

/**
 * Middleware to record API activity logs directly into MongoDB
 */
const requestLogger = async (req, res, next) => {
  const start = Date.now();

  res.on('finish', async () => {
    try {
      const responseTime = Date.now() - start;
      const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info';
      
      // Do not log health check requests to avoid noise
      if (req.originalUrl === '/api/health') return;

      await Log.create({
        level: level,
        action: `${req.method} ${req.baseUrl}${req.path}`,
        message: `HTTP ${req.method} ${req.originalUrl} - Status ${res.statusCode} (${responseTime}ms)`,
        user: req.user ? req.user._id : null,
        ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
        userAgent: req.headers['user-agent'] || '',
        meta: {
          statusCode: res.statusCode,
          responseTimeMs: responseTime,
          query: req.query,
          params: req.params
        }
      });
    } catch (err) {
      console.error('Failed to save log entry to MongoDB:', err.message);
    }
  });

  next();
};

/**
 * Helper to log custom system events (e.g. user signup, stock alert, audit event)
 */
const logSystemEvent = async ({ level = 'info', action, message, userId = null, meta = {} }) => {
  try {
    await Log.create({
      level,
      action,
      message,
      user: userId,
      meta
    });
  } catch (err) {
    console.error('Failed to create system log entry:', err.message);
  }
};

module.exports = { requestLogger, logSystemEvent };
