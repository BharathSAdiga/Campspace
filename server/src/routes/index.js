const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');

/**
 * Main API Router
 * Feature routes mounted here incrementally.
 */
router.use('/auth', authRoutes);

module.exports = router;
