const validator = require('validator');
const { USER_ROLES } = require('../models/User');

/**
 * Validate Registration Request Body
 * @param {Object} data - req.body
 * @returns {Object} { isValid: boolean, errors: Object }
 */
const validateRegisterInput = (data) => {
  const errors = {};

  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const password = typeof data.password === 'string' ? data.password : '';
  const role = typeof data.role === 'string' ? data.role.trim().toLowerCase() : 'student';

  // Name validation
  if (validator.isEmpty(name)) {
    errors.name = 'Name is required';
  } else if (!validator.isLength(name, { min: 2, max: 60 })) {
    errors.name = 'Name must be between 2 and 60 characters';
  }

  // Email validation
  if (validator.isEmpty(email)) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Please provide a valid email address';
  }

  // Password validation
  if (validator.isEmpty(password)) {
    errors.password = 'Password is required';
  } else if (!validator.isLength(password, { min: 6 })) {
    errors.password = 'Password must be at least 6 characters long';
  }

  // Role validation
  if (role && !USER_ROLES.includes(role)) {
    errors.role = `Role must be one of: ${USER_ROLES.join(', ')}`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      name,
      email,
      password,
      role: role || 'student',
    },
  };
};

/**
 * Validate Login Request Body
 * @param {Object} data - req.body
 * @returns {Object} { isValid: boolean, errors: Object }
 */
const validateLoginInput = (data) => {
  const errors = {};

  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const password = typeof data.password === 'string' ? data.password : '';

  if (validator.isEmpty(email)) {
    errors.email = 'Email is required';
  } else if (!validator.isEmail(email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (validator.isEmpty(password)) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitized: {
      email,
      password,
    },
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};
