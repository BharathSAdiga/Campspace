const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/auth.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * Public Authentication Routes
 */
router.post('/register', register);
router.post('/login', login);

/**
 * Protected Authentication Routes
 */
router.get('/me', authenticate, getMe);

/**
 * Role-Restricted Verification Route
 * Demonstrates and validates backend role authorization
 */
router.get('/role-check/organizer-or-admin', authenticate, authorize('organizer', 'admin'), (req, res) => {
  res.status(200).json({
    success: true,
    message: `Access granted for role '${req.user.role}'.`,
    role: req.user.role,
  });
});

module.exports = router;
