const validator = require('validator');

const VALID_CATEGORIES = [
  'Textbooks',
  'Electronics',
  'Furniture',
  'Clothing',
  'Stationery',
  'Housing / Sublet',
  'Other',
];

const VALID_CONDITIONS = ['Brand New', 'Like New', 'Good', 'Fair', 'Poor'];

/**
 * Validate listing creation input
 */
const validateCreateListing = (req, res, next) => {
  const { title, description, price, category, condition, location } = req.body;
  const errors = [];

  if (!title || validator.isEmpty(String(title).trim())) {
    errors.push('Listing title is required');
  } else if (String(title).trim().length > 120) {
    errors.push('Listing title cannot exceed 120 characters');
  }

  if (!description || validator.isEmpty(String(description).trim())) {
    errors.push('Listing description is required');
  } else if (String(description).trim().length > 2000) {
    errors.push('Description cannot exceed 2000 characters');
  }

  if (price === undefined || price === null || isNaN(Number(price))) {
    errors.push('A valid numeric price is required');
  } else if (Number(price) < 0) {
    errors.push('Price cannot be negative');
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (!condition || !VALID_CONDITIONS.includes(condition)) {
    errors.push(`Condition must be one of: ${VALID_CONDITIONS.join(', ')}`);
  }

  if (location && String(location).length > 100) {
    errors.push('Location cannot exceed 100 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

/**
 * Validate listing update input
 */
const validateUpdateListing = (req, res, next) => {
  const { title, description, price, category, condition, status, location } = req.body;
  const errors = [];

  if (title !== undefined) {
    if (validator.isEmpty(String(title).trim())) {
      errors.push('Title cannot be empty');
    } else if (String(title).trim().length > 120) {
      errors.push('Title cannot exceed 120 characters');
    }
  }

  if (description !== undefined) {
    if (validator.isEmpty(String(description).trim())) {
      errors.push('Description cannot be empty');
    } else if (String(description).trim().length > 2000) {
      errors.push('Description cannot exceed 2000 characters');
    }
  }

  if (price !== undefined) {
    if (isNaN(Number(price)) || Number(price) < 0) {
      errors.push('Price must be a non-negative number');
    }
  }

  if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`);
  }

  if (condition !== undefined && !VALID_CONDITIONS.includes(condition)) {
    errors.push(`Condition must be one of: ${VALID_CONDITIONS.join(', ')}`);
  }

  if (status !== undefined && !['available', 'reserved', 'sold'].includes(status)) {
    errors.push('Status must be one of: available, reserved, sold');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

module.exports = {
  validateCreateListing,
  validateUpdateListing,
  VALID_CATEGORIES,
  VALID_CONDITIONS,
};
