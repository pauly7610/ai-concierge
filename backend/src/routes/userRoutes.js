const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  deleteUserAccount,
  resetPassword
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const { 
  validateUserRegistration, 
  validateUserLogin 
} = require('../utils/validationUtils');

const router = express.Router();

// Authentication routes
router.post('/register', validateUserRegistration, registerUser);
router.post('/login', validateUserLogin, loginUser);
router.post('/reset-password', resetPassword);

// Protected user routes
router.route('/profile')
  .get(authMiddleware, getUserProfile)
  .put(authMiddleware, updateUserProfile)
  .delete(authMiddleware, deleteUserAccount);

module.exports = router;