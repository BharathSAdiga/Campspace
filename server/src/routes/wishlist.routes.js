const express = require('express');
const router = express.Router();
const { getWishlist, add, remove } = require('../controllers/wishlist.controller');
const { authenticate } = require('../middleware/auth.middleware');

// All wishlist routes require authentication
router.use(authenticate);

router.get('/', getWishlist);
router.post('/:productId', add);
router.delete('/:productId', remove);

module.exports = router;
