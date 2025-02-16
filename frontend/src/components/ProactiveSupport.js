import React from 'react';

const ProactiveSupport = ({ onDismiss }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Need Help Finding Your Home?</h3>
      <p className="mb-4">It looks like you're having trouble finding the right property. Our AI assistant can help!</p>
      <div className="flex space-x-4">
        <button 
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Chat with AI Assistant
        </button>
        <button 
          onClick={onDismiss}
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default ProactiveSupport; 