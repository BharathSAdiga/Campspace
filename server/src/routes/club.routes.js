const express = require('express');
const router = express.Router();
const { clubController } = require('../controllers');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

// Public / Discovery
router.get('/', clubController.getClubs);

// Must be before /:id
router.get('/my-clubs', authenticate, clubController.getMyClubs);

router.get('/:id', optionalAuthenticate, clubController.getClubById);

// Membership
router.post('/:id/join', authenticate, clubController.joinClub);
router.delete('/:id/leave', authenticate, clubController.leaveClub);

// Organizer / Admin endpoints
router.post('/', authenticate, authorize('organizer', 'admin'), clubController.createClub);
router.put('/:id', authenticate, authorize('organizer', 'admin'), clubController.updateClub);
router.delete('/:id', authenticate, authorize('organizer', 'admin'), clubController.deleteClub);

module.exports = router;
