import React, { useState } from 'react';
import { Bell, Menu, Search, User } from 'lucide-react';
import OnboardingFlow from './OnboardingFlow';
import PropertyExplorer from './PropertyExplorer';
import ProactiveSupport from './ProactiveSupport';

const AppLayout = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [showProactiveSupport, setShowProactiveSupport] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  const handlePropertyView = () => {
    const newCount = viewCount + 1;
    setViewCount(newCount);
    if (newCount >= 3) {
      setShowProactiveSupport(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Menu className="h-6 w-6 text-gray-600" />
              <img 
                src="/zillow-logo.png" 
                alt="Zillow Logo" 
                className="ml-4 h-10"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Search className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {!isOnboarded ? (
          <OnboardingFlow onComplete={() => setIsOnboarded(true)} />
        ) : (
          <div className="space-y-6">
            <PropertyExplorer onPropertyView={handlePropertyView} />
            
            {showProactiveSupport && (
              <ProactiveSupport 
                onDismiss={() => setShowProactiveSupport(false)}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">About</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Company</li>
                <li>Careers</li>
                <li>Press</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Products</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Buy</li>
                <li>Rent</li>
                <li>Sell</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Help Center</li>
                <li>Research</li>
                <li>Market Trends</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Contact Us</li>
                <li>Social Media</li>
                <li>Mobile Apps</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout; 