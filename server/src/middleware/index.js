const { errorHandler, notFoundHandler } = require('./error.middleware');
const { authenticate, authorize } = require('./auth.middleware');

/**
 * Middleware Registry
 * Centralized export for application-wide and route-level middlewares.
 */
module.exports = {
  errorHandler,
  notFoundHandler,
  authenticate,
  authorize,
};
