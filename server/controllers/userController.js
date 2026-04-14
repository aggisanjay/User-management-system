const userService = require('../services/userService');

/**
 * GET /api/users
 * Admin & Manager: paginated, searchable user list
 */
const getAllUsers = async (req, res, next) => {
  try {
    const { page, limit, search, role, status } = req.query;
    const result = await userService.getUsers({ page, limit, search, role, status });
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/profile
 * Authenticated: own profile
 */
const getProfile = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 * Authenticated: update own profile (name, password only)
 */
const updateProfile = async (req, res, next) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id
 * Admin: any user. Manager: non-admin users.
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await userService.getUserById(req.params.id);

    // Manager cannot view admin users
    if (req.user.role === 'manager' && user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Managers cannot view admin user details.',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users
 * Admin only: create new user
 */
const createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body, req.user.id);
    res.status(201).json({
      success: true,
      message: 'User created successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/:id
 * Admin: update any user. Manager: update non-admin users (limited fields).
 */
const updateUser = async (req, res, next) => {
  try {
    const targetUser = await userService.getUserById(req.params.id);

    // Manager restrictions
    if (req.user.role === 'manager') {
      if (targetUser.role === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Managers cannot modify admin users.',
        });
      }
      // Managers cannot assign admin role
      if (req.body.role === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Managers cannot assign admin role.',
        });
      }
    }

    const user = await userService.updateUser(req.params.id, req.body, req.user.id);
    res.status(200).json({
      success: true,
      message: 'User updated successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/users/:id
 * Admin only: soft delete (deactivate) user
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await userService.deleteUser(req.params.id, req.user.id);
    res.status(200).json({
      success: true,
      message: 'User deactivated successfully.',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getProfile,
  updateProfile,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
