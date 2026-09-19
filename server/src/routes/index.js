const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');
const productRoutes = require('./product.routes');
const wishlistRoutes = require('./wishlist.routes');
const eventRoutes = require('./event.routes');
const resourceRoutes = require('./resource.routes');
const bookingRoutes = require('./booking.routes');
const clubRoutes = require('./club.routes');

/**
 * Main API Router
 * Feature routes mounted here incrementally.
 */
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/events', eventRoutes);
router.use('/resources', resourceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/clubs', clubRoutes);

module.exports = router;
