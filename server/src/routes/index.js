const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const wishlistRoutes = require('./wishlist.routes');
const eventRoutes = require('./event.routes');

/**
 * Main API Router
 * Feature routes mounted here incrementally.
 */
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/events', eventRoutes);

module.exports = router;
