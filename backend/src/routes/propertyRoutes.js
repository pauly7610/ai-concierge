const express = require('express');
const { 
  createProperty, 
  getProperties, 
  getPropertyById,
  updateProperty,
  deleteProperty,
  searchProperties,
  getPropertyStatistics
} = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');
const { validatePropertyCreation } = require('../utils/validationUtils');

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/search', searchProperties);
router.get('/statistics', getPropertyStatistics);
router.get('/:id', getPropertyById);

// Protected routes
router.post('/', 
  authMiddleware, 
  validatePropertyCreation, 
  createProperty
);

router.put('/:id', 
  authMiddleware, 
  validatePropertyCreation, 
  updateProperty
);

router.delete('/:id', 
  authMiddleware, 
  deleteProperty
);

module.exports = router;