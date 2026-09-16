const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const wishlistRoutes = require('./wishlist.routes');

/**
 * Main API Router
 * Feature routes mounted here incrementally.
 */
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/wishlist', wishlistRoutes);

module.exports = router;
