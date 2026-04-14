const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const {
  generateAccessToken,
  generateRefreshToken,
  revokeRefreshToken,
} = require('../utils/generateToken');

/**
 * Register a new user
 */
const register = async ({ firstName, lastName, email, password }) => {
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: 'user', // Self-registration always creates a 'user'
    status: 'active',
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

/**
 * Login with email and password
 */
const login = async ({ email, password }) => {
  // Find user including password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  if (user.status === 'inactive') {
    const error = new Error('Account has been deactivated. Contact an administrator.');
    error.statusCode = 403;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = await generateRefreshToken(user);

  return { user, accessToken, refreshToken };
};

/**
 * Refresh access token using a valid refresh token
 */
const refresh = async (token) => {
  const storedToken = await RefreshToken.findOne({ token });

  if (!storedToken) {
    const error = new Error('Invalid refresh token.');
    error.statusCode = 401;
    throw error;
  }

  if (storedToken.expiresAt < new Date()) {
    await revokeRefreshToken(token);
    const error = new Error('Refresh token has expired.');
    error.statusCode = 401;
    throw error;
  }

  const user = await User.findById(storedToken.userId);
  if (!user || user.status === 'inactive') {
    await revokeRefreshToken(token);
    const error = new Error('User not found or deactivated.');
    error.statusCode = 401;
    throw error;
  }

  // Rotate: revoke old, issue new
  await revokeRefreshToken(token);
  const accessToken = generateAccessToken(user);
  const newRefreshToken = await generateRefreshToken(user);

  return { user, accessToken, refreshToken: newRefreshToken };
};

/**
 * Logout — revoke the refresh token
 */
const logout = async (token) => {
  await revokeRefreshToken(token);
};

module.exports = { register, login, refresh, logout };
