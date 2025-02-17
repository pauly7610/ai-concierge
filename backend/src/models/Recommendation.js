const mongoose = require('mongoose');

const RecommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  properties: [{
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    reasoningFactors: {
      type: [String],
      default: []
    }
  }],
  generatedAt: {
    type: Date,
    default: Date.now,
    expires: '30d'  // Auto-delete after 30 days
  },
  aiModel: {
    type: String,
    default: 'default_recommendation_model_v1'
  },
  metadata: {
    totalPropertiesConsidered: Number,
    averageMatchScore: Number
  }
}, { 
  timestamps: true,
  methods: {
    calculateAverageMatchScore() {
      const scores = this.properties.map(p => p.matchScore);
      return scores.reduce((a, b) => a + b, 0) / scores.length;
    }
  }
});

// Pre-save hook to update metadata
RecommendationSchema.pre('save', function(next) {
  this.metadata = {
    totalPropertiesConsidered: this.properties.length,
    averageMatchScore: this.calculateAverageMatchScore()
  };
  next();
});

module.exports = mongoose.model('Recommendation', RecommendationSchema);