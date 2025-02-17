const axios = require('axios');
const { 
  getPropertyStockImages, 
  getPropertyTypeImage, 
  scoreImageRelevance 
} = require('../stockImages');

// Properly mock axios
jest.mock('axios', () => ({
  get: jest.fn()
}));

// Create a more robust localStorage mock
const createLocalStorageMock = () => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
  };
};

describe('Stock Images Utility', () => {
  let localStorageMock;

  beforeEach(() => {
    // Reset mocks
    localStorageMock = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', { 
      value: localStorageMock,
      writable: true 
    });

    // Reset axios mock
    axios.get.mockReset();

    // Restore environment
    process.env.REACT_APP_UNSPLASH_ACCESS_KEY = 'test_key';
  });

  describe('getPropertyStockImages', () => {
    const mockUnsplashResponse = {
      data: [
        {
          urls: {
            full: 'https://full.image',
            regular: 'https://regular.image',
            small: 'https://small.image',
            thumb: 'https://thumb.image'
          },
          user: {
            name: 'Test Photographer',
            links: { html: 'https://photographer.link' }
          },
          alt_description: 'Test property image'
        }
      ]
    };

    it('fetches images successfully', async () => {
      axios.get.mockResolvedValue(mockUnsplashResponse);

      const images = await getPropertyStockImages('modern house');
      
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveProperty('regular', 'https://regular.image');
    });

    it('handles API errors gracefully', async () => {
      axios.get.mockRejectedValue(new Error('Network Error'));

      await expect(getPropertyStockImages('modern house'))
        .rejects.toThrow('Error configuring image request');
    });
  });

  describe('getPropertyTypeImage', () => {
    it('returns image for different property types', async () => {
      axios.get.mockResolvedValue({
        data: [{
          urls: {
            regular: 'https://test.image/house',
            small: 'https://test.image/small'
          }
        }]
      });

      const singleFamilyImage = await getPropertyTypeImage('Single Family');
      const townhouseImage = await getPropertyTypeImage('Townhouse');
      
      expect(singleFamilyImage).toContain('https://');
      expect(townhouseImage).toContain('https://');
    });
  });

  describe('scoreImageRelevance', () => {
    const mockPhoto = {
      width: 1500,
      height: 1000,
      alt_description: 'modern suburban home with large yard',
      tags: ['house', 'property', 'real estate']
    };

    it('calculates relevance score correctly', () => {
      const score = scoreImageRelevance(mockPhoto, 'modern suburban home');
      
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  it('handles missing API key', async () => {
    delete process.env.REACT_APP_UNSPLASH_ACCESS_KEY;

    await expect(getPropertyStockImages('modern house'))
      .rejects.toThrow('Missing Unsplash API key');
  });

  it('handles network timeout', async () => {
    axios.get.mockImplementation(() => new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Network Timeout')), 11000)
    ));

    await expect(getPropertyStockImages('modern house'))
      .rejects.toThrow('Network Timeout');
  });
});
