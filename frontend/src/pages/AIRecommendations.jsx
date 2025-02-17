import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ChartBarIcon, 
  SparklesIcon, 
  TrendingUpIcon 
} from '@heroicons/react/solid';

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await axios.get('/api/ai/recommendations', {
          params: {
            preferences: {
              propertyType: ['single-family', 'condo'],
              priceRange: { min: 200000, max: 500000 }
            }
          }
        });

        setRecommendations(response.data.recommendations);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <div>Loading recommendations...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Property Recommendations</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((property) => (
          <div 
            key={property.id} 
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">{property.address}</h2>
              <div 
                className="badge bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                title="AI Confidence Score"
              >
                {property.confidenceScore}%
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span>Price: ${property.price.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-green-500 mr-2" />
                <span>Recommended Match: {property.matchPercentage}%</span>
              </div>
              
              <div className="flex items-center">
                <TrendingUpIcon className="h-5 w-5 text-purple-500 mr-2" />
                <span>Investment Potential: {property.investmentScore}/10</span>
              </div>
            </div>
            
            <button 
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;