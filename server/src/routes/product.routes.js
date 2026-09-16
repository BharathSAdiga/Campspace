const express = require('express');
const router = express.Router();
const {
  create,
  getAll,
  getById,
  update,
  remove,
  updateStatus,
} = require('../controllers/product.controller');
const { authenticate } = require('../middleware/auth.middleware');

/**
 * Public Routes
 */
router.get('/', getAll);
router.get('/:id', getById);

/**
 * Protected Routes (Require Authentication)
 * Ownership checks enforced in service/controller
 */
router.post('/', authenticate, create);
router.put('/:id', authenticate, update);
router.delete('/:id', authenticate, remove);
router.patch('/:id/status', authenticate, updateStatus);

module.exports = router;
