import React from 'react';

const OnboardingFlow = ({ onComplete }) => {
  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Welcome to Zillow AI Concierge</h2>
      <p className="mb-6">Let's help you find your perfect home!</p>
      <button 
        onClick={onComplete}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Start Exploring
      </button>
    </div>
  );
};

export default OnboardingFlow; 