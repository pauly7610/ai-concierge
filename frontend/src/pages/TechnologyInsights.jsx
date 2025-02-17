import React from 'react';
import TechnologyShowcase from '../components/TechnologyShowcase';

const TechnologyInsightsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Technology Insights
      </h1>
      <TechnologyShowcase />
      
      <section className="mt-12 bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">
          Our Technology Philosophy
        </h2>
        <p className="text-gray-700">
          We leverage cutting-edge technologies to create an intelligent, 
          user-centric real estate discovery platform.
        </p>
      </section>
    </div>
  );
};

export default TechnologyInsightsPage; 