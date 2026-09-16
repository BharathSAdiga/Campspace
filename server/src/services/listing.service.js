const Listing = require('../models/Listing');

/**
 * Service to handle Marketplace listing business logic
 */
class ListingService {
  /**
   * Fetch listings with advanced filtering, full-text regex search, sorting, and pagination
   */
  async getListings({
    search,
    category,
    condition,
    status = 'available',
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 12,
  }) {
    const query = {};

    // Filter by status (default to available, 'all' allows everything)
    if (status && status !== 'all') {
      query.status = status;
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Condition filter
    if (condition && condition !== 'All') {
      query.condition = condition;
    }

    // Price range filters
    if (minPrice !== undefined && minPrice !== '' && !isNaN(minPrice)) {
      query.price = { ...(query.price || {}), $gte: Number(minPrice) };
    }
    if (maxPrice !== undefined && maxPrice !== '' && !isNaN(maxPrice)) {
      query.price = { ...(query.price || {}), $lte: Number(maxPrice) };
    }

    // Search query across title and description
    if (search && search.trim() !== '') {
      const sanitized = search.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
        { location: { $regex: sanitized, $options: 'i' } },
      ];
    }

    // Sorting strategy
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') {
      sortOption = { price: 1, createdAt: -1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1, createdAt: -1 };
    } else if (sort === 'popular') {
      sortOption = { viewsCount: -1, createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate('seller', 'name email department phone campusId avatar')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Listing.countDocuments(query),
    ]);

    return {
      listings,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1,
        hasNextPage: pageNum < Math.ceil(total / limitNum),
        hasPrevPage: pageNum > 1,
      },
    };
  }

  /**
   * Fetch a single listing by ID and increment its view count
   */
  async getListingById(id) {
    const listing = await Listing.findByIdAndUpdate(
      id,
      { $inc: { viewsCount: 1 } },
      { new: true }
    ).populate('seller', 'name email department phone campusId avatar');

    if (!listing) {
      const error = new Error('Listing not found');
      error.status = 404;
      throw error;
    }

    return listing;
  }

  /**
   * Create a new campus marketplace listing
   */
  async createListing(userId, listingData) {
    const listing = new Listing({
      ...listingData,
      seller: userId,
      viewsCount: 0,
    });

    const savedListing = await listing.save();
    return await Listing.findById(savedListing._id).populate(
      'seller',
      'name email department phone campusId avatar'
    );
  }

  /**
   * Update an existing listing (restricted to seller or admin)
   */
  async updateListing(userId, userRole, listingId, updateData) {
    const listing = await Listing.findById(listingId);

    if (!listing) {
      const error = new Error('Listing not found');
      error.status = 404;
      throw error;
    }

    if (listing.seller.toString() !== userId.toString() && userRole !== 'admin') {
      const error = new Error('You do not have permission to modify this listing');
      error.status = 403;
      throw error;
    }

    // Allowed updatable fields
    const allowedFields = [
      'title',
      'description',
      'price',
      'category',
      'condition',
      'images',
      'status',
      'location',
    ];

    allowedFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        listing[field] = updateData[field];
      }
    });

    const updated = await listing.save();
    return await Listing.findById(updated._id).populate(
      'seller',
      'name email department phone campusId avatar'
    );
  }

  /**
   * Delete a listing (restricted to seller or admin)
   */
  async deleteListing(userId, userRole, listingId) {
    const listing = await Listing.findById(listingId);

    if (!listing) {
      const error = new Error('Listing not found');
      error.status = 404;
      throw error;
    }

    if (listing.seller.toString() !== userId.toString() && userRole !== 'admin') {
      const error = new Error('You do not have permission to delete this listing');
      error.status = 403;
      throw error;
    }

    await Listing.findByIdAndDelete(listingId);
    return { id: listingId };
  }

  /**
   * Get all listings posted by a specific user
   */
  async getMyListings(userId) {
    return await Listing.find({ seller: userId })
      .sort({ createdAt: -1 })
      .populate('seller', 'name email department phone campusId avatar')
      .lean();
  }
}

module.exports = new ListingService();
