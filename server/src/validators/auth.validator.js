const validator = require('validator');

/**
 * Validate user registration input
 */
const validateRegisterInput = (req, res, next) => {
  const { name, email, password, role, department, campusId } = req.body;
  const errors = [];

  if (!name || validator.isEmpty(name.trim())) {
    errors.push('Name is required');
  }

  if (!email || !validator.isEmail(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (role && !['student', 'organizer', 'admin'].includes(role)) {
    errors.push('Role must be one of: student, organizer, admin');
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
 * Validate user login input
 */
const validateLoginInput = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !validator.isEmail(email.trim())) {
    errors.push('A valid email address is required');
  }

  if (!password || validator.isEmpty(password)) {
    errors.push('Password is required');
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
 * Validate profile update input
 */
const validateUpdateProfileInput = (req, res, next) => {
  const { name, department, campusId, phone, bio } = req.body;
  const errors = [];

  if (name !== undefined && validator.isEmpty(name.trim())) {
    errors.push('Name cannot be empty');
  }

  if (bio !== undefined && bio.length > 500) {
    errors.push('Bio cannot exceed 500 characters');
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
  validateRegisterInput,
  validateLoginInput,
  validateUpdateProfileInput,
};
