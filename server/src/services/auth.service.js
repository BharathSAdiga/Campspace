const { User } = require('../models/User');
const { generateToken } = require('../utils/jwt.util');

/**
 * Register a new user
 * @param {Object} userData - { name, email, password, role }
 * @returns {Object} { user, token }
 */
const registerUser = async ({ name, email, password, role }) => {
  // Check for existing user with the same email
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    const error = new Error('Email is already registered. Please sign in or use another email.');
    error.statusCode = 409;
    throw error;
  }

  // Create new user (password is automatically hashed via pre-save hook)
  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'student',
  });

  // Generate JWT token
  const token = generateToken(newUser);

  return {
    user: newUser.toJSON(),
    token,
  };
};

/**
 * Authenticate user credentials and issue token
 * @param {Object} credentials - { email, password }
 * @returns {Object} { user, token }
 */
const loginUser = async ({ email, password }) => {
  // Retrieve user with explicit password selection
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Verify candidate password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate JWT token
  const token = generateToken(user);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Fetch current user profile by user ID
 * @param {String} userId - Mongo ID of the authenticated user
 * @returns {Object} user
 */
const getCurrentUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user.toJSON();
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
