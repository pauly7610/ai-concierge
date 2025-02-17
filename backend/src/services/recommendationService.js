const Property = require('../models/Property');
const Recommendation = require('../models/Recommendation');

class RecommendationService {
  async generateRecommendations(user) {
    const userPreferences = user.profile.preferences;

    const recommendationCriteria = {
      type: { $in: userPreferences.propertyTypes },
      price: {
        $gte: userPreferences.priceRange.min,
        $lte: userPreferences.priceRange.max
      }
    };

    const properties = await Property.find(recommendationCriteria);

    const recommendations = properties.map(property => ({
      property: property._id,
      matchScore: this.calculateMatchScore(property, userPreferences)
    }));

    return new Recommendation({
      user: user._id,
      properties: recommendations
    });
  }

  calculateMatchScore(property, preferences) {
    // Implement sophisticated matching algorithm
    let score = 0;
    
    // Type match
    if (preferences.propertyTypes.includes(property.type)) score += 30;
    
    // Price range match
    const priceRangeMatch = this.calculatePriceRangeMatch(
      property.price, 
      preferences.priceRange
    );
    score += priceRangeMatch;

    return Math.min(score, 100);
  }

  calculatePriceRangeMatch(price, priceRange) {
    const { min, max } = priceRange;
    const normalizedScore = 1 - Math.abs(price - ((min + max) / 2)) / ((max - min) / 2);
    return normalizedScore * 70;
  }
}

module.exports = new RecommendationService();
