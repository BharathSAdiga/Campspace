const express = require('express');
const router = express.Router();
const { bookingController } = require('../controllers');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All booking routes require authentication
router.use(authenticate);

// User endpoints
router.post('/', bookingController.createBooking);
router.get('/my', bookingController.getMyBookings);
router.patch('/:id/cancel', bookingController.cancelBooking);

// Organizer / Admin endpoints
router.get('/', authorize('organizer', 'admin'), bookingController.getAllBookings);
router.patch('/:id/approve', authorize('organizer', 'admin'), bookingController.approveBooking);
router.patch('/:id/reject', authorize('organizer', 'admin'), bookingController.rejectBooking);

module.exports = router;
