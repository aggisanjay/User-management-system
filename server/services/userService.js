const User = require('../models/User');
const crypto = require('crypto');

/**
 * Get paginated, filterable, searchable list of users
 */
const getUsers = async ({ page = 1, limit = 10, search, role, status }) => {
  const query = {};

  // Search by name or email
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by role
  if (role) {
    query.role = role;
  }

  // Filter by status
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    User.countDocuments(query),
  ]);

  return {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get a single user by ID
 */
const getUserById = async (id) => {
  const user = await User.findById(id)
    .populate('createdBy', 'firstName lastName email')
    .populate('updatedBy', 'firstName lastName email');

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

/**
 * Create a new user (Admin only)
 */
const createUser = async (data, createdById) => {
  // Check duplicate email
  const existing = await User.findOne({ email: data.email });
  if (existing) {
    const error = new Error('A user with this email already exists.');
    error.statusCode = 409;
    throw error;
  }

  // Auto-generate password if not provided
  if (!data.password) {
    data.password = crypto.randomBytes(8).toString('hex');
  }

  const user = await User.create({
    ...data,
    createdBy: createdById,
    updatedBy: createdById,
  });

  return user;
};

/**
 * Update an existing user
 */
const updateUser = async (id, data, updatedById) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  // Apply updates
  const allowedFields = ['firstName', 'lastName', 'email', 'role', 'status', 'password'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  });

  user.updatedBy = updatedById;
  await user.save(); // triggers pre-save hook for password hashing

  return user;
};

/**
 * Soft delete (deactivate) a user
 */
const deleteUser = async (id, updatedById) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  if (user.role === 'admin') {
    // Prevent deleting the last admin
    const adminCount = await User.countDocuments({ role: 'admin', status: 'active' });
    if (adminCount <= 1) {
      const error = new Error('Cannot deactivate the last admin account.');
      error.statusCode = 400;
      throw error;
    }
  }

  user.status = 'inactive';
  user.updatedBy = updatedById;
  await user.save();

  return user;
};

/**
 * Update own profile
 */
const updateProfile = async (id, data) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  // Only allow name and password changes for profile
  const allowedFields = ['firstName', 'lastName', 'password'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      user[field] = data[field];
    }
  });

  user.updatedBy = id;
  await user.save();

  return user;
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateProfile,
};
