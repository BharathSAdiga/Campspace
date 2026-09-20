const express = require('express');
const router = express.Router();
const { resourceController } = require('../controllers');
const { authenticate, authorize } = require('../middleware/auth.middleware');

const optionalAuthenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticate(req, res, next);
  }
  next();
};

// Public endpoints
router.get('/', resourceController.getResources);
router.get('/:id', optionalAuthenticate, resourceController.getResourceById);

// Organizer / Admin endpoints
router.post('/', authenticate, authorize('organizer', 'admin'), resourceController.createResource);
router.put('/:id', authenticate, authorize('organizer', 'admin'), resourceController.updateResource);
router.delete('/:id', authenticate, authorize('organizer', 'admin'), resourceController.deleteResource);

module.exports = router;
