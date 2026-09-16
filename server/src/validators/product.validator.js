const mongoose = require('mongoose');
const {
  PRODUCT_CATEGORIES,
  PRODUCT_CONDITIONS,
  PRODUCT_STATUS,
} = require('../models/Product');

/**
 * Validate MongoDB ObjectId
 * @param {String} id
 * @returns {Boolean}
 */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Validate Product Creation Payload
 * @param {Object} data - req.body
 * @returns {Object} { isValid, errors, sanitized }
 */
const validateCreateProductInput = (data) => {
  const errors = {};

  const title = typeof data.title === 'string' ? data.title.trim() : '';
  const description = typeof data.description === 'string' ? data.description.trim() : '';
  const price = data.price !== undefined && data.price !== null ? Number(data.price) : NaN;
  const category = typeof data.category === 'string' ? data.category.trim() : '';
  const condition = typeof data.condition === 'string' ? data.condition.trim() : '';
  const location = typeof data.location === 'string' ? data.location.trim() : 'Campus Pickup';
  const images = Array.isArray(data.images)
    ? data.images.filter((img) => typeof img === 'string' && img.trim() !== '')
    : [];

  // Title validation
  if (!title) {
    errors.title = 'Title is required';
  } else if (title.length < 3 || title.length > 120) {
    errors.title = 'Title must be between 3 and 120 characters';
  }

  // Description validation
  if (!description) {
    errors.description = 'Description is required';
  } else if (description.length < 10 || description.length > 2000) {
    errors.description = 'Description must be between 10 and 2000 characters';
  }

  // Price validation
  if (isNaN(price)) {
    errors.price = 'Valid price is required';
  } else if (price < 0) {
    errors.price = 'Price cannot be negative';
  }

  // Category validation
  if (!category) {
    errors.category = 'Category is required';
  } else if (!PRODUCT_CATEGORIES.includes(category)) {
    errors.category = `Invalid category. Allowed: ${PRODUCT_CATEGORIES.join(', ')}`;
  }

  // Condition validation
  if (!condition) {
    errors.condition = 'Condition is required';
  } else if (!PRODUCT_CONDITIONS.includes(condition)) {
    errors.condition = `Invalid condition. Allowed: ${PRODUCT_CONDITIONS.join(', ')}`;
  }

  // Location validation
  if (location && location.length > 100) {
    errors.location = 'Location cannot exceed 100 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      title,
      description,
      price,
      category,
      condition,
      location: location || 'Campus Pickup',
      images,
    },
  };
};

/**
 * Validate Product Update Payload
 * @param {Object} data - req.body
 * @returns {Object} { isValid, errors, sanitized }
 */
const validateUpdateProductInput = (data) => {
  const errors = {};
  const sanitized = {};

  if (data.title !== undefined) {
    const title = typeof data.title === 'string' ? data.title.trim() : '';
    if (!title || title.length < 3 || title.length > 120) {
      errors.title = 'Title must be between 3 and 120 characters';
    } else {
      sanitized.title = title;
    }
  }

  if (data.description !== undefined) {
    const description = typeof data.description === 'string' ? data.description.trim() : '';
    if (!description || description.length < 10 || description.length > 2000) {
      errors.description = 'Description must be between 10 and 2000 characters';
    } else {
      sanitized.description = description;
    }
  }

  if (data.price !== undefined) {
    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      errors.price = 'Price must be a valid non-negative number';
    } else {
      sanitized.price = price;
    }
  }

  if (data.category !== undefined) {
    const category = typeof data.category === 'string' ? data.category.trim() : '';
    if (!PRODUCT_CATEGORIES.includes(category)) {
      errors.category = `Invalid category. Allowed: ${PRODUCT_CATEGORIES.join(', ')}`;
    } else {
      sanitized.category = category;
    }
  }

  if (data.condition !== undefined) {
    const condition = typeof data.condition === 'string' ? data.condition.trim() : '';
    if (!PRODUCT_CONDITIONS.includes(condition)) {
      errors.condition = `Invalid condition. Allowed: ${PRODUCT_CONDITIONS.join(', ')}`;
    } else {
      sanitized.condition = condition;
    }
  }

  if (data.location !== undefined) {
    const location = typeof data.location === 'string' ? data.location.trim() : '';
    if (location.length > 100) {
      errors.location = 'Location cannot exceed 100 characters';
    } else {
      sanitized.location = location || 'Campus Pickup';
    }
  }

  if (data.images !== undefined) {
    if (Array.isArray(data.images)) {
      sanitized.images = data.images.filter((img) => typeof img === 'string' && img.trim() !== '');
    } else {
      errors.images = 'Images must be an array of URL strings';
    }
  }

  if (data.status !== undefined) {
    if (!PRODUCT_STATUS.includes(data.status)) {
      errors.status = `Invalid status. Allowed: ${PRODUCT_STATUS.join(', ')}`;
    } else {
      sanitized.status = data.status;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized,
  };
};

/**
 * Validate Status Update Payload
 * @param {String} status
 * @returns {Object} { isValid, error }
 */
const validateStatusInput = (status) => {
  if (!status || !PRODUCT_STATUS.includes(status)) {
    return {
      isValid: false,
      error: `Status must be one of: ${PRODUCT_STATUS.join(', ')}`,
    };
  }
  return { isValid: true, error: null };
};

module.exports = {
  isValidObjectId,
  validateCreateProductInput,
  validateUpdateProductInput,
  validateStatusInput,
};
