const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Single Family', 'Townhouse', 'Condo', 'Apartment'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  squareFootage: {
    type: Number,
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  amenities: [String],
  images: [String],
  aiRecommendationScore: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Property', PropertySchema);