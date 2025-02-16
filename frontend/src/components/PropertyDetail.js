import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  School,
  Train,
  Car,
  Info
} from 'lucide-react';

// Simplified UI Components
const Card = ({ children, className = '' }) => (
  <div className={`border rounded-lg ${className}`}>{children}</div>
);

const Button = ({ 
  children, 
  variant = 'primary', 
  onClick, 
  className = '' 
}) => {
  const baseClasses = 'px-4 py-2 rounded-md flex items-center';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50'
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

const Tabs = ({ children, defaultValue = 'overview', onChange }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleTabChange = (tabValue) => {
    setActiveTab(tabValue);
    onChange && onChange(tabValue);
  };

  return (
    <div>
      <div className="flex border-b mb-4">
        {React.Children.map(children, child => 
          child.type === Tabs.TabsTrigger 
            ? React.cloneElement(child, { 
                isActive: child.props.value === activeTab,
                onActivate: () => handleTabChange(child.props.value)
              }) 
            : child
        )}
      </div>
      {React.Children.map(children, child => 
        child.type === Tabs.TabsContent && child.props.value === activeTab 
          ? child 
          : null
      )}
    </div>
  );
};

Tabs.TabsTrigger = ({ 
  value, 
  children, 
  isActive = false, 
  onActivate 
}) => (
  <button
    className={`
      px-4 py-2 
      ${isActive ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-600'}
    `}
    onClick={onActivate}
  >
    {children}
  </button>
);

Tabs.TabsContent = ({ value, children }) => children;

const PropertyDetail = ({ 
  property, 
  onScheduleTour, 
  onSave, 
  onShare 
}) => {
  // Default property data
  const defaultProperty = {
    id: 1,
    address: '123 Main St',
    city: 'Seattle',
    state: 'WA',
    price: 550000,
    beds: 3,
    baths: 2,
    sqft: 1800,
    description: 'Beautiful home in a great neighborhood with modern amenities.',
    type: 'Single Family',
    images: [
      'https://via.placeholder.com/600x400',
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200',
      'https://via.placeholder.com/300x200'
    ]
  };

  const currentProperty = { ...defaultProperty, ...property };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Property Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              ${currentProperty.price.toLocaleString()}
            </h1>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              <span>
                {currentProperty.address}, {currentProperty.city}, {currentProperty.state}
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => onSave && onSave(currentProperty.id)}
            >
              <Heart className="w-5 h-5 mr-2" />
              Save
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onShare && onShare(currentProperty)}
            >
              <Share2 className="w-5 h-5 mr-2" />
              Share
            </Button>
            <Button 
              onClick={() => onScheduleTour && onScheduleTour(currentProperty.id)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Tour
            </Button>
          </div>
        </div>

        {/* Property Images */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="col-span-2 row-span-2">
            <img
              src={currentProperty.images[0]}
              alt="Main property view"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          {currentProperty.images.slice(1).map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Property view ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Tabs Content */}
        <Tabs defaultValue="overview">
          <Tabs.TabsTrigger value="overview">Overview</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="features">Features</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="neighborhood">Neighborhood</Tabs.TabsTrigger>
          <Tabs.TabsTrigger value="history">History</Tabs.TabsTrigger>

          <Tabs.TabsContent value="overview">
            <Card>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: Bed, label: 'beds', value: currentProperty.beds },
                    { icon: Bath, label: 'baths', value: currentProperty.baths },
                    { icon: Square, label: 'sqft', value: currentProperty.sqft.toLocaleString() }
                  ].map(({ icon: Icon, label, value }) => (
                    <div 
                      key={label} 
                      className="text-center p-4 bg-gray-50 rounded-lg"
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <div className="text-lg font-semibold">
                        {value} {label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">About This Home</h3>
                    <p className="text-gray-600">{currentProperty.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex items-start">
                      <Info className="w-5 h-5 mr-3 mt-1 text-blue-600" />
                      <div>
                        <div className="font-semibold text-blue-800">Property Analysis</div>
                        <div className="text-sm text-blue-700">
                          This home is priced 5% below similar properties in the area.
                          School ratings and commute times are favorable.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Tabs.TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// PropTypes for type checking and documentation
PropertyDetail.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.number.isRequired,
    address: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    state: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    beds: PropTypes.number,
    baths: PropTypes.number,
    sqft: PropTypes.number,
    description: PropTypes.string,
    type: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.string)
  }),
  onScheduleTour: PropTypes.func,
  onSave: PropTypes.func,
  onShare: PropTypes.func
};

export default PropertyDetail; 