const { Product } = require('../models/Product');

/**
 * Create a new marketplace product listing
 * @param {Object} productData - Validated product fields
 * @param {String} sellerId - Authenticated user ID
 * @returns {Promise<Object>} Created product
 */
const createProduct = async (productData, sellerId) => {
  const product = await Product.create({
    ...productData,
    seller: sellerId,
  });

  return await Product.findById(product._id).populate('seller', 'name email role');
};

/**
 * Get paginated, filtered, and sorted marketplace products
 * @param {Object} query - Express query params
 * @returns {Promise<Object>} { products, pagination }
 */
const getProducts = async (query = {}) => {
  const {
    search,
    category,
    condition,
    minPrice,
    maxPrice,
    status,
    seller,
    sort,
    page = 1,
    limit = 10,
  } = query;

  // Build MongoDB filter query
  const filter = {};

  // Status filtering: defaults to 'ACTIVE' unless explicitly specified or 'ALL'
  if (status && status.toUpperCase() !== 'ALL') {
    filter.status = status.toUpperCase();
  } else if (!status) {
    filter.status = 'ACTIVE';
  }

  // Category filter (case-insensitive)
  if (category && category !== 'All') {
    filter.category = new RegExp(`^${category}$`, 'i');
  }

  // Condition filter (case-insensitive)
  if (condition && condition !== 'All') {
    filter.condition = new RegExp(`^${condition}$`, 'i');
  }

  // Seller filter
  if (seller) {
    filter.seller = seller;
  }

  // Price range filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined && !isNaN(Number(minPrice))) {
      filter.price.$gte = Number(minPrice);
    }
    if (maxPrice !== undefined && !isNaN(Number(maxPrice))) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  // Search keyword in title or description
  if (search && search.trim()) {
    const searchRegex = new RegExp(search.trim(), 'i');
    filter.$or = [{ title: searchRegex }, { description: searchRegex }];
  }

  // Sorting logic
  let sortOption = { createdAt: -1 }; // default newest first
  if (sort === 'price_asc') {
    sortOption = { price: 1, createdAt: -1 };
  } else if (sort === 'price_desc') {
    sortOption = { price: -1, createdAt: -1 };
  } else if (sort === 'oldest') {
    sortOption = { createdAt: 1 };
  }

  // Pagination bounds
  const parsedPage = Math.max(1, parseInt(page, 10) || 1);
  const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute count and query concurrently
  const [total, products] = await Promise.all([
    Product.countDocuments(filter),
    Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(parsedLimit)
      .populate('seller', 'name email role')
      .lean(),
  ]);

  const totalPages = Math.ceil(total / parsedLimit) || 1;

  return {
    products: products.map((p) => {
      p.id = p._id;
      delete p._id;
      delete p.__v;
      return p;
    }),
    pagination: {
      total,
      count: products.length,
      page: parsedPage,
      limit: parsedLimit,
      totalPages,
      hasNextPage: parsedPage < totalPages,
      hasPrevPage: parsedPage > 1,
    },
  };
};

/**
 * Get a single product listing by ID
 * @param {String} id - Product ID
 * @returns {Promise<Object>}
 */
const getProductById = async (id) => {
  const product = await Product.findById(id).populate('seller', 'name email role createdAt');
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  return product;
};

/**
 * Update a product listing with ownership check
 * @param {String} id - Product ID
 * @param {Object} updateData - Validated updates
 * @param {Object} user - Authenticated user
 * @returns {Promise<Object>}
 */
const updateProduct = async (id, updateData, user) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification: user must be seller or admin
  const isOwner = product.seller.toString() === (user.id || user._id).toString();
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    const error = new Error('Forbidden: You are not authorized to modify this listing');
    error.statusCode = 403;
    throw error;
  }

  // Prevent client from mutating the seller field
  delete updateData.seller;

  Object.assign(product, updateData);
  await product.save();

  return await Product.findById(product._id).populate('seller', 'name email role');
};

/**
 * Delete a product listing with ownership check
 * @param {String} id - Product ID
 * @param {Object} user - Authenticated user
 * @returns {Promise<Object>}
 */
const deleteProduct = async (id, user) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  const isOwner = product.seller.toString() === (user.id || user._id).toString();
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    const error = new Error('Forbidden: You are not authorized to delete this listing');
    error.statusCode = 403;
    throw error;
  }

  await product.deleteOne();

  return { message: 'Product listing successfully deleted' };
};

/**
 * Update product status (e.g. ACTIVE -> SOLD -> ARCHIVED)
 * @param {String} id - Product ID
 * @param {String} status - New status
 * @param {Object} user - Authenticated user
 * @returns {Promise<Object>}
 */
const updateProductStatus = async (id, status, user) => {
  const product = await Product.findById(id);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Ownership verification
  const isOwner = product.seller.toString() === (user.id || user._id).toString();
  const isAdmin = user.role === 'admin';

  if (!isOwner && !isAdmin) {
    const error = new Error('Forbidden: You are not authorized to update the status of this listing');
    error.statusCode = 403;
    throw error;
  }

  product.status = status;
  await product.save();

  return await Product.findById(product._id).populate('seller', 'name email role');
};

/**
 * Get products created by the authenticated user
 * @param {String} userId - Authenticated user ID
 * @param {Object} query - Optional query params
 * @returns {Promise<Array>} List of user products
 */
const getMyProducts = async (userId, query = {}) => {
  const filter = { seller: userId };
  if (query.status && query.status.toUpperCase() !== 'ALL') {
    filter.status = query.status.toUpperCase();
  }
  const sort = query.sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

  const products = await Product.find(filter)
    .sort(sort)
    .populate('seller', 'name email role')
    .lean();

  return products.map((p) => {
    p.id = p._id;
    delete p._id;
    delete p.__v;
    return p;
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getMyProducts,
};
