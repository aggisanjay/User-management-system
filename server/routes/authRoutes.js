const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const {
  registerValidator,
  loginValidator,
  refreshTokenValidator,
} = require('../validators/authValidator');

// POST /api/auth/register
router.post('/register', registerValidator, validate, authController.register);

// POST /api/auth/login
router.post('/login', loginValidator, validate, authController.login);

// POST /api/auth/refresh
router.post('/refresh', refreshTokenValidator, validate, authController.refreshToken);

// POST /api/auth/logout
router.post('/logout', authController.logout);

module.exports = router;
