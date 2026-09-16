const jwt = require('jsonwebtoken');
const config = require('../config/env');

/**
 * Generate a signed JWT token for an authenticated user
 * @param {Object} user - User document or user object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user._id || user.id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

/**
 * Verify a JWT token
 * @param {String} token - Raw JWT token string
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

module.exports = {
  generateToken,
  verifyToken,
};
