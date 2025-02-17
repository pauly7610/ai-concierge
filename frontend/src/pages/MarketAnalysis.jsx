import React, { useState } from 'react';
import axios from 'axios';
import { 
  ChartPieIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon 
} from '@heroicons/react/solid';

const MarketAnalysis = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    location: '',
    propertyType: '',
    investmentHorizon: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/ai/market-analysis', formData);
      setAnalysis(response.data.marketAnalysis);
    } catch (error) {
      console.error('Market analysis error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Market Analysis</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <select 
            value={formData.location}
            onChange={(e) => setFormData({...formData, location: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">Select Location</option>
            <option value="urban">Urban</option>
            <option value="suburban">Suburban</option>
            <option value="rural">Rural</option>
          </select>

          <select 
            value={formData.propertyType}
            onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">Property Type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>

          <select 
            value={formData.investmentHorizon}
            onChange={(e) => setFormData({...formData, investmentHorizon: e.target.value})}
            className="p-2 border rounded"
          >
            <option value="">Investment Horizon</option>
            <option value="short">Short Term (1-3 years)</option>
            <option value="medium">Medium Term (3-5 years)</option>
            <option value="long">Long Term (5+ years)</option>
          </select>
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {loading ? 'Analyzing...' : 'Analyze Market'}
        </button>
      </form>

      {analysis && (
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <ChartPieIcon className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <h3 className="font-bold">Price Trajectory</h3>
                <p>{analysis.priceTrajectory}</p>
              </div>
            </div>

            <div className="flex items-center">
              <TrendingUpIcon className="h-10 w-10 text-green-500 mr-4" />
              <div>
                <h3 className="font-bold">Rental Yield</h3>
                <p>{analysis.rentalYieldPrediction}%</p>
              </div>
            </div>

            <div className="flex items-center">
              <ShieldCheckIcon className="h-10 w-10 text-purple-500 mr-4" />
              <div>
                <h3 className="font-bold">Risk Assessment</h3>
                <p>{analysis.riskAssessment}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysis;