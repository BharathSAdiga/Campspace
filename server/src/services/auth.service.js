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

const { OAuth2Client } = require('google-auth-library');
const config = require('../config/env');

const googleClient = new OAuth2Client(config.googleClientId);

/**
 * Authenticate or Register a user via Google OAuth
 * @param {Object} payload - { credential, userInfo }
 * @returns {Object} { user, token }
 */
const googleAuthUser = async ({ credential, userInfo }) => {
  let googleId = '';
  let email = '';
  let name = '';
  let picture = '';

  if (credential && config.googleClientId) {
    // Live Google ID Token verification with Google API
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: config.googleClientId,
      });
      const payload = ticket.getPayload();
      googleId = payload.sub;
      email = payload.email ? payload.email.toLowerCase() : '';
      name = payload.name || payload.given_name || 'Google User';
      picture = payload.picture || '';
    } catch (verifyErr) {
      const error = new Error(`Google token verification failed: ${verifyErr.message}`);
      error.statusCode = 401;
      throw error;
    }
  } else if (credential && !config.googleClientId) {
    // Development fallback: decode ID token payload
    try {
      const parts = credential.split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf-8');
        const payload = JSON.parse(payloadJson);
        googleId = payload.sub || `google_${Date.now()}`;
        email = payload.email ? payload.email.toLowerCase() : '';
        name = payload.name || 'Google User';
        picture = payload.picture || '';
      }
    } catch (e) {
      // fallback
    }
  }

  // Support direct dev/sandbox userInfo payload
  if (!email && userInfo && userInfo.email) {
    email = userInfo.email.toLowerCase();
    name = userInfo.name || 'Google User';
    googleId = userInfo.googleId || userInfo.sub || `google_dev_${Date.now()}`;
    picture = userInfo.picture || userInfo.avatar || '';
  }

  if (!email) {
    const error = new Error('No verified email found in Google profile');
    error.statusCode = 400;
    throw error;
  }

  // 1. Look up existing user by googleId
  let user = await User.findOne({ googleId });

  // 2. If not found by googleId, check by email to link existing accounts
  if (!user) {
    user = await User.findOne({ email });
    if (user) {
      user.googleId = googleId;
      if (!user.avatar && picture) user.avatar = picture;
      await user.save();
    }
  }

  // 3. If still not found, create new Google user
  if (!user) {
    user = await User.create({
      name: name || 'Google User',
      email,
      googleId,
      avatar: picture,
      role: 'student',
      authProvider: 'google',
    });
  }

  // Generate JWT token
  const token = generateToken(user);

  return {
    user: user.toJSON(),
    token,
  };
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  googleAuthUser,
};
