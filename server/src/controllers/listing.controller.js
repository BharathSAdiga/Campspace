const listingService = require('../services/listing.service');

/**
 * Controller to handle Marketplace HTTP requests
 */
class ListingController {
  /**
   * Get all listings with filters, search, and pagination
   * GET /api/v1/marketplace/listings
   */
  async getListings(req, res, next) {
    try {
      const {
        search,
        category,
        condition,
        status,
        minPrice,
        maxPrice,
        sort,
        page,
        limit,
      } = req.query;

      const result = await listingService.getListings({
        search,
        category,
        condition,
        status,
        minPrice,
        maxPrice,
        sort,
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        message: 'Listings retrieved successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get single listing details by ID
   * GET /api/v1/marketplace/listings/:id
   */
  async getListingById(req, res, next) {
    try {
      const listing = await listingService.getListingById(req.params.id);

      res.status(200).json({
        success: true,
        message: 'Listing retrieved successfully',
        data: { listing },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new listing
   * POST /api/v1/marketplace/listings
   */
  async createListing(req, res, next) {
    try {
      const listing = await listingService.createListing(req.user._id, req.body);

      res.status(201).json({
        success: true,
        message: 'Listing published successfully',
        data: { listing },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a listing
   * PUT /api/v1/marketplace/listings/:id
   */
  async updateListing(req, res, next) {
    try {
      const listing = await listingService.updateListing(
        req.user._id,
        req.user.role,
        req.params.id,
        req.body
      );

      res.status(200).json({
        success: true,
        message: 'Listing updated successfully',
        data: { listing },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a listing
   * DELETE /api/v1/marketplace/listings/:id
   */
  async deleteListing(req, res, next) {
    try {
      const result = await listingService.deleteListing(
        req.user._id,
        req.user.role,
        req.params.id
      );

      res.status(200).json({
        success: true,
        message: 'Listing removed successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get listings created by the authenticated user
   * GET /api/v1/marketplace/my-listings
   */
  async getMyListings(req, res, next) {
    try {
      const listings = await listingService.getMyListings(req.user._id);

      res.status(200).json({
        success: true,
        message: 'My listings retrieved successfully',
        data: { listings },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ListingController();
