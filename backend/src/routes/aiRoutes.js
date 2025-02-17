const express = require('express');
const { 
  generateRecommendations, 
  explainRecommendation,
  generatePropertyInsights
} = require('../controllers/aiRecommendationController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// AI-powered recommendation routes
router.get('/recommendations', authMiddleware, generateRecommendations);
router.get('/explain/:propertyId', authMiddleware, explainRecommendation);
router.get('/insights/:propertyId', authMiddleware, generatePropertyInsights);

// Additional AI routes can be added here
router.post('/analyze-market', authMiddleware, async (req, res) => {
  try {
    // Placeholder for market analysis
    const marketAnalysis = await analyzeRealEstateMarket(req.body);
    res.json(marketAnalysis);
  } catch (error) {
    res.status(500).json({ error: 'Market analysis failed' });
  }
});

module.exports = router;