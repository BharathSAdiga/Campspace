const wishlistService = require('../services/wishlist.service');
const { isValidObjectId } = require('../validators/product.validator');

/**
 * @desc    Get current user's wishlist
 * @route   GET /api/wishlist
 * @access  Private (Authenticated)
 */
const getWishlist = async (req, res, next) => {
  try {
    const userId = req.user.id || req.user._id;
    const result = await wishlistService.getWishlist(userId);

    res.status(200).json({
      success: true,
      count: result.count,
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add product to user's wishlist
 * @route   POST /api/wishlist/:productId
 * @access  Private (Authenticated)
 */
const add = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const userId = req.user.id || req.user._id;
    const result = await wishlistService.addToWishlist(userId, productId);

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remove product from user's wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private (Authenticated)
 */
const remove = async (req, res, next) => {
  try {
    const { productId } = req.params;

    if (!isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format',
      });
    }

    const userId = req.user.id || req.user._id;
    const result = await wishlistService.removeFromWishlist(userId, productId);

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: result.data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  add,
  remove,
};
