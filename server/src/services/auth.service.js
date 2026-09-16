const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Generate JWT token for an authenticated user
 */
const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'campusconnect_super_secret_jwt_key_2026_dev_mode';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn }
  );
};

/**
 * Register a new user
 */
const register = async ({ name, email, password, role, department, campusId, phone, bio }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('An account with this email address already exists');
    error.statusCode = 400;
    throw error;
  }

  // Prevent direct registration as admin without explicit internal logic
  // Allow student and organizer self-registration
  const assignedRole = role === 'admin' ? 'student' : (role || 'student');

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: assignedRole,
    department: department ? department.trim() : '',
    campusId: campusId ? campusId.trim() : '',
    phone: phone ? phone.trim() : '',
    bio: bio ? bio.trim() : '',
  });

  const token = generateToken(user);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Authenticate user credentials and return session
 */
const login = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Find user and explicitly select password field
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Your account is deactivated. Please contact campus administration.');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);

  return {
    user: user.toJSON(),
    token,
  };
};

/**
 * Fetch user profile by ID
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user.toJSON();
};

/**
 * Update allowed user profile fields
 */
const updateProfile = async (userId, updateData) => {
  const allowedFields = ['name', 'department', 'campusId', 'phone', 'bio', 'avatar'];
  const sanitizedUpdates = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      sanitizedUpdates[field] = typeof updateData[field] === 'string' ? updateData[field].trim() : updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: sanitizedUpdates },
    { new: true, runValidators: true }
  );

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user.toJSON();
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};
