const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

/**
 * Optional Authentication Helper
 * If a valid Bearer token is provided, populates req.user.
 * If not provided, allows the request to continue unauthenticated.
 */
const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

/**
 * Event Core Endpoints
 */
// Public / discovery endpoints
router.get('/', eventController.getAll);

// Organizer / Owner endpoints (MUST be placed before /:id to prevent route shadowing)
router.get('/my-events', authenticate, eventController.getMyEvents);

router.get('/:id', optionalAuthenticate, eventController.getById);

// Organizer / Admin event management endpoints
router.post('/', authenticate, authorize('organizer', 'admin'), eventController.create);
router.put('/:id', authenticate, eventController.update);
router.delete('/:id', authenticate, eventController.remove);

/**
 * Event Registration Endpoints
 */
router.post('/:id/register', authenticate, eventController.register);
router.delete('/:id/register', authenticate, eventController.cancelRegistration);
router.get('/:id/registrations', authenticate, authorize('organizer', 'admin'), eventController.getRegistrations);

module.exports = router;
