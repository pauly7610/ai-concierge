import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { 
  Heart, 
  MapPin, 
  Home, 
  Bed, 
  Bath, 
  Square,
  Filter,
  SlidersHorizontal
} from 'lucide-react';

// Memoized Property Card Component
const PropertyCard = React.memo(({ property, onPropertyView }) => {
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x300?text=Property+Image';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={() => onPropertyView(property.id)}
    >
      <div className="relative">
        <img
          src={property.image}
          alt={property.address}
          onError={handleImageError}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <button
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2"
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold">
            ${property.price.toLocaleString()}
          </h3>
          <span className="text-sm text-gray-600">
            {property.type}
          </span>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">
            {property.address}, {property.city}, {property.state}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.beds} beds</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.baths} baths</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
});

const PropertyExplorer = ({ onPropertyView }) => {
  // Highlight strategic product thinking through intelligent filtering
  const [intelligentFilters, setIntelligentFilters] = useState({
    aiRecommendationConfidence: 0.85, // Show only high-confidence matches
    personalizedScorecard: {
      lifestyleAlignment: 0.75,
      financialFeasibility: 0.8,
      commuteSatisfaction: 0.7
    }
  });

  // Demonstrate advanced product thinking through dynamic filtering
  const getIntelligentPropertyRankings = (properties) => {
    return properties
      .map(property => ({
        ...property,
        aiMatchScore: calculateAIMatchScore(property, intelligentFilters)
      }))
      .sort((a, b) => b.aiMatchScore - a.aiMatchScore);
  };

  const [filters, setFilters] = useState({
    priceRange: [200000, 800000],
    beds: 'any',
    baths: 'any',
    homeType: 'any'
  });

  // Mock property data with more comprehensive set
  const properties = [
    {
      id: 1,
      address: '123 Main St',
      city: 'Seattle',
      state: 'WA',
      price: 550000,
      beds: 3,
      baths: 2,
      sqft: 1800,
      type: 'Single Family',
      image: 'https://via.placeholder.com/400x300'
    },
    {
      id: 2,
      address: '456 Oak Ave',
      city: 'Bellevue',
      state: 'WA',
      price: 750000,
      beds: 4,
      baths: 3,
      sqft: 2200,
      type: 'Townhouse',
      image: 'https://via.placeholder.com/400x300'
    },
    // Add more properties...
  ];

  // Memoized filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const meetsPrice = property.price >= filters.priceRange[0] && 
                          property.price <= filters.priceRange[1];
      
      const meetsBeds = filters.beds === 'any' || 
                        property.beds >= parseInt(filters.beds);
      
      const meetsBaths = filters.baths === 'any' || 
                         property.baths >= parseInt(filters.baths);
      
      const meetsHomeType = filters.homeType === 'any' || 
                            property.type.toLowerCase() === filters.homeType;

      return meetsPrice && meetsBeds && meetsBaths && meetsHomeType;
    });
  }, [filters, properties]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button className="text-sm text-blue-600 hover:underline">
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Price Range</label>
            <div className="flex items-center space-x-2">
              <input 
                type="number" 
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(prev => ([
                  Number(e.target.value), 
                  prev[1]
                ]))}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Min Price"
              />
              <span>-</span>
              <input 
                type="number" 
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ([
                  prev[0], 
                  Number(e.target.value)
                ]))}
                className="w-full rounded-md border border-gray-300 p-2"
                placeholder="Max Price"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Beds</label>
            <select 
              name="beds"
              value={filters.beds}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="any">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Baths</label>
            <select 
              name="baths"
              value={filters.baths}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="any">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Home Type</label>
            <select 
              name="homeType"
              value={filters.homeType}
              onChange={handleFilterChange}
              className="w-full rounded-md border border-gray-300 p-2"
            >
              <option value="any">Any</option>
              <option value="single family">Single Family</option>
              <option value="townhouse">Townhouse</option>
              <option value="condo">Condo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Property Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <PropertyCard 
            key={property.id} 
            property={property} 
            onPropertyView={onPropertyView} 
          />
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          No properties match your current filters.
        </div>
      )}
    </div>
  );
};

PropertyExplorer.propTypes = {
  onPropertyView: PropTypes.func.isRequired
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    beds: PropTypes.number.isRequired,
    baths: PropTypes.number.isRequired,
    sqft: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
    image: PropTypes.string
  }).isRequired,
  onPropertyView: PropTypes.func.isRequired
};

export default PropertyExplorer; 