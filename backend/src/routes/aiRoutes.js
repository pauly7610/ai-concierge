const express = require('express');
const { 
  generateRecommendations, 
  explainRecommendation,
  generatePropertyInsights,
  analyzeMarketTrends,
  predictInvestmentPotential
} = require('../controllers/aiRecommendationController');
const authMiddleware = require('../middleware/authMiddleware');
const { rateLimit } = require('../middleware/rateLimitMiddleware');
const { validateAIRequest } = require('../validators/aiValidator');

const router = express.Router();

// Advanced Recommendation Engine
router.get('/recommendations', [
  authMiddleware,
  rateLimit(100), // 100 requests per hour
  validateAIRequest,
  async (req, res) => {
    try {
      const { 
        userId, 
        preferences = {}, 
        advancedFilters = {} 
      } = req.query;

      // Multi-layered recommendation generation
      const recommendations = await generateRecommendations({
        userId,
        preferences,
        advancedFilters,
        strategies: [
          'personalizedMatching',
          'machineLearningEnhancement',
          'trendBasedWeighting'
        ]
      });

      res.json({
        recommendations,
        metadata: {
          confidenceScore: recommendations.confidenceScore,
          generatedAt: new Date(),
          strategyUsed: recommendations.strategyUsed
        }
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Recommendation generation failed',
        details: error.message 
      });
    }
  }
]);

// Comprehensive Property Insights
router.get('/insights/:propertyId', [
  authMiddleware,
  rateLimit(50), // 50 requests per hour
  async (req, res) => {
    try {
      const { propertyId } = req.params;
      const insights = await generatePropertyInsights(propertyId, {
        includeDetailedAnalysis: true,
        generateAIDescription: true,
        predictMaintenanceCosts: true
      });

      res.json({
        propertyId,
        insights,
        aiConfidenceLevel: insights.confidenceLevel,
        lastUpdated: new Date()
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Property insights generation failed',
        details: error.message 
      });
    }
  }
]);

// Advanced Market Analysis
router.post('/market-analysis', [
  authMiddleware,
  rateLimit(30), // 30 requests per hour
  validateAIRequest,
  async (req, res) => {
    try {
      const { 
        location, 
        propertyType, 
        investmentHorizon 
      } = req.body;

      const marketAnalysis = await analyzeMarketTrends({
        location,
        propertyType,
        investmentHorizon,
        analysisDepth: 'comprehensive',
        predictiveModels: [
          'priceTrajectory',
          'rentalYieldPrediction',
          'investmentRiskAssessment'
        ]
      });

      res.json({
        marketAnalysis,
        generatedAt: new Date(),
        disclaimer: 'Predictive analysis, actual results may vary'
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Market analysis failed',
        details: error.message 
      });
    }
  }
]);

// Investment Potential Prediction
router.post('/investment-potential', [
  authMiddleware,
  rateLimit(25), // 25 requests per hour
  validateAIRequest,
  async (req, res) => {
    try {
      const { 
        propertyDetails, 
        investmentCriteria 
      } = req.body;

      const investmentPotential = await predictInvestmentPotential({
        propertyDetails,
        investmentCriteria,
        modelVersion: 'v2.1',
        riskAssessment: true
      });

      res.json({
        investmentPotential,
        riskProfile: investmentPotential.riskProfile,
        recommendedAction: investmentPotential.recommendedAction,
        confidenceScore: investmentPotential.confidenceScore
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Investment potential assessment failed',
        details: error.message 
      });
    }
  }
]);

// Experimental: AI-Powered Property Matching
router.post('/match-properties', [
  authMiddleware,
  rateLimit(40), // 40 requests per hour
  validateAIRequest,
  async (req, res) => {
    try {
      const { 
        userProfile, 
        matchingCriteria 
      } = req.body;

      const matchedProperties = await findOptimalPropertyMatches({
        userProfile,
        matchingCriteria,
        matchingAlgorithm: 'advanced-ml-matching',
        includeExperimentalMatches: true
      });

      res.json({
        matchedProperties,
        matchingStrategy: 'machine-learning-enhanced',
        totalMatchesConsidered: matchedProperties.length
      });
    } catch (error) {
      res.status(500).json({ 
        error: 'Property matching failed',
        details: error.message 
      });
    }
  }
]);

module.exports = router;