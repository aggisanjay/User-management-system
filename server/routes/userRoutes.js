const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/rbac');
const validate = require('../middleware/validate');
const {
  createUserValidator,
  updateUserValidator,
  updateProfileValidator,
  listUsersValidator,
} = require('../validators/userValidator');

// All routes require authentication
router.use(authenticate);

// Profile routes (any authenticated user)
router.get('/profile', userController.getProfile);
router.put('/profile', updateProfileValidator, validate, userController.updateProfile);

// Admin & Manager routes
router.get(
  '/',
  authorize('admin', 'manager'),
  listUsersValidator,
  validate,
  userController.getAllUsers
);

router.get('/:id', authorize('admin', 'manager'), userController.getUserById);

// Admin only routes
router.post(
  '/',
  authorize('admin'),
  createUserValidator,
  validate,
  userController.createUser
);

router.put(
  '/:id',
  authorize('admin', 'manager'),
  updateUserValidator,
  validate,
  userController.updateUser
);

router.delete('/:id', authorize('admin'), userController.deleteUser);

module.exports = router;
