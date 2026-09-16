const productService = require('../services/product.service');
const {
  isValidObjectId,
  validateCreateProductInput,
  validateUpdateProductInput,
  validateStatusInput,
} = require('../validators/product.validator');

/**
 * @desc    Create a new product listing
 * @route   POST /api/products
 * @access  Private (Authenticated)
 */
const create = async (req, res, next) => {
  try {
    const { isValid, errors, sanitized } = validateCreateProductInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted errors.',
        errors,
      });
    }

    // Never trust client-supplied seller ID - always use authenticated user
    const sellerId = req.user.id || req.user._id;
    const product = await productService.createProduct(sanitized, sellerId);

    res.status(201).json({
      success: true,
      message: 'Product listing created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get paginated, filtered, and sorted products
 * @route   GET /api/products
 * @access  Public
 */
const getAll = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single product listing by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const product = await productService.getProductById(id);

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product listing
 * @route   PUT /api/products/:id
 * @access  Private (Owner / Admin)
 */
const update = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const { isValid, errors, sanitized } = validateUpdateProductInput(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed. Please correct the highlighted errors.',
        errors,
      });
    }

    const updatedProduct = await productService.updateProduct(id, sanitized, req.user);

    res.status(200).json({
      success: true,
      message: 'Product listing updated successfully',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete product listing
 * @route   DELETE /api/products/:id
 * @access  Private (Owner / Admin)
 */
const remove = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const result = await productService.deleteProduct(id, req.user);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update product status (e.g. ACTIVE -> SOLD -> ARCHIVED)
 * @route   PATCH /api/products/:id/status
 * @access  Private (Owner / Admin)
 */
const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const { isValid, error } = validateStatusInput(req.body.status);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    const updatedProduct = await productService.updateProductStatus(
      id,
      req.body.status,
      req.user
    );

    res.status(200).json({
      success: true,
      message: `Product status updated to ${req.body.status}`,
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get listings created by authenticated user
 * @route   GET /api/products/my-listings
 * @access  Private (Authenticated)
 */
const getMyListings = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const products = await productService.getMyProducts(userId, req.query);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
  updateStatus,
  getMyListings,
};
