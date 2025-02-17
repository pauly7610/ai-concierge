import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AIRecommendations from './pages/AIRecommendations';
import MarketAnalysis from './pages/MarketAnalysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/ai/recommendations" element={<AIRecommendations />} />
        <Route path="/ai/market-analysis" element={<MarketAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; 