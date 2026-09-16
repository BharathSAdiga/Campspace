const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');

/**
 * Main API Router
 * Feature routes mounted here incrementally.
 */
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

module.exports = router;
