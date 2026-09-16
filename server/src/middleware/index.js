const { errorHandler, notFoundHandler } = require('./error.middleware');

/**
 * Middleware Registry
 * Centralized export for application-wide and route-level middlewares.
 */

module.exports = {
  errorHandler,
  notFoundHandler,
};
