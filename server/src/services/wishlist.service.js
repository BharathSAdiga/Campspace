const { Wishlist } = require('../models/Wishlist');
const { Product } = require('../models/Product');

/**
 * Retrieve the current user's wishlist, safely filtering out any deleted products
 * @param {String} userId - Authenticated user ID
 * @returns {Promise<Object>} { products: Array, count: Number }
 */
const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: 'products',
    populate: {
      path: 'seller',
      select: 'name email role',
    },
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  // Safe handling: filter out nulls in case any referenced product was deleted
  const validProducts = wishlist.products.filter((p) => p !== null && p !== undefined);

  // If there were orphan/deleted references, clean up the array in MongoDB
  if (validProducts.length !== wishlist.products.length) {
    wishlist.products = validProducts.map((p) => p._id);
    await wishlist.save();
  }

  const mappedProducts = validProducts.map((p) => {
    const item = p.toObject ? p.toObject() : p;
    item.id = item._id;
    delete item._id;
    delete item.__v;
    return item;
  });

  return {
    count: mappedProducts.length,
    data: mappedProducts,
  };
};

/**
 * Add a product to the user's wishlist, preventing duplicates
 * @param {String} userId - Authenticated user ID
 * @param {String} productId - Target product ID
 * @returns {Promise<Object>} Updated wishlist
 */
const addToWishlist = async (userId, productId) => {
  // Ensure product exists
  const product = await Product.findById(productId);
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }

  // Prevent duplicates
  const alreadyInWishlist = wishlist.products.some(
    (id) => id.toString() === productId.toString()
  );

  if (!alreadyInWishlist) {
    wishlist.products.push(productId);
    await wishlist.save();
  }

  return await getWishlist(userId);
};

/**
 * Remove a product from the user's wishlist
 * @param {String} userId - Authenticated user ID
 * @param {String} productId - Target product ID to remove
 * @returns {Promise<Object>} Updated wishlist
 */
const removeFromWishlist = async (userId, productId) => {
  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    return { count: 0, data: [] };
  }

  wishlist.products = wishlist.products.filter(
    (id) => id && id.toString() !== productId.toString()
  );

  await wishlist.save();
  return await getWishlist(userId);
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
