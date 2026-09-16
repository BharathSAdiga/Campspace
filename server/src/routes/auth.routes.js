const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateProfileInput,
} = require('../validators/auth.validator');
const { authenticate } = require('../middleware/auth.middleware');

// Public endpoints
router.post('/register', validateRegisterInput, authController.register);
router.post('/login', validateLoginInput, authController.login);

// Protected endpoints
router.get('/me', authenticate, authController.getMe);
router.put('/profile', authenticate, validateUpdateProfileInput, authController.updateProfile);

module.exports = router;
