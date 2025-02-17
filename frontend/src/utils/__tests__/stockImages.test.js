import axios from 'axios';
import { 
  getPropertyStockImages, 
  getPropertyTypeImage, 
  scoreImageRelevance 
} from '../stockImages';

// Mock axios and localStorage
jest.mock('axios');
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    })
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Stock Images Utility', () => {
  beforeEach(() => {
    // Reset mocks
    axios.get.mockClear();
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();

    // Set up environment
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
});
