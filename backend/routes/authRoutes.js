const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Hidden admin registration route
router.post('/admin-register', authController.registerAdmin); // hidden

// Login (used by both admin and teacher)
router.post('/login', authController.login);

// Admin change password (hidden route)
router.post('/admin-change-password', authController.changePassword); // hidden

module.exports = router;
