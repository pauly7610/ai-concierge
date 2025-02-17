const express = require('express');
const UserController = require('../controllers/userController');
const { 
  registerValidator, 
  loginValidator 
} = require('../validators/userValidator');
const authMiddleware = require('../../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register', 
  registerValidator, 
  UserController.register
);

router.post(
  '/login', 
  loginValidator, 
  UserController.login
);

router.get(
  '/profile', 
  authMiddleware, 
  async (req, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      res.status(500).json({ 
        message: 'Profile retrieval failed' 
      });
    }
  }
);

module.exports = router;
