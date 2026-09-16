const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listing.controller');
const { authenticate } = require('../middleware/auth.middleware');
const {
  validateCreateListing,
  validateUpdateListing,
} = require('../validators/listing.validator');

// Public listing browsing & retrieval
router.get('/listings', listingController.getListings);
router.get('/listings/:id', listingController.getListingById);

// Authenticated actions
router.get('/my-listings', authenticate, listingController.getMyListings);
router.post('/listings', authenticate, validateCreateListing, listingController.createListing);
router.put('/listings/:id', authenticate, validateUpdateListing, listingController.updateListing);
router.delete('/listings/:id', authenticate, listingController.deleteListing);

module.exports = router;
