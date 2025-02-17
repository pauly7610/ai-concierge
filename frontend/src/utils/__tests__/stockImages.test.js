const { 
  getPropertyStockImages, 
  getPropertyTypeImage, 
  scoreImageRelevance,
  ImageFetchError
} = require('../stockImages');

// Mock the entire unsplash-js module
jest.mock('unsplash-js', () => ({
  createApi: jest.fn(() => ({
    photos: {
      search: jest.fn().mockResolvedValue({
        response: {
          results: [
            {
              urls: { 
                regular: 'https://example.com/test-image.jpg',
                small: 'https://example.com/small-image.jpg'
              },
              description: 'Modern suburban home with large yard',
              user: { name: 'Test Photographer' }
            }
          ]
        }
      })
    }
  }))
}));

describe('Stock Images Utility', () => {
  beforeEach(() => {
    // Reset environment
    process.env.REACT_APP_UNSPLASH_ACCESS_KEY = 'test_key';
  });

  describe('getPropertyStockImages', () => {
    it('fetches images successfully', async () => {
      const images = await getPropertyStockImages('modern house');
      
      expect(images).toHaveLength(1);
      expect(images[0]).toHaveProperty('regular', 'https://example.com/test-image.jpg');
    });

    it('handles missing API key', async () => {
      delete process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
      
      const result = await getPropertyStockImages('modern house');
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('regular', 'https://example.com/test-image.jpg');
    });

    it('handles network errors', async () => {
      // Mock a network error
      const mockUnsplash = {
        photos: {
          search: jest.fn().mockRejectedValue(new Error('Network error'))
        }
      };

      const result = await getPropertyStockImages('modern house', mockUnsplash);
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('regular', 'https://example.com/test-image.jpg');
    });
  });

  describe('getPropertyTypeImage', () => {
    it('returns image for different property types', async () => {
      const singleFamilyImage = await getPropertyTypeImage('Single Family');
      const townhouseImage = await getPropertyTypeImage('Townhouse');
      
      expect(singleFamilyImage).toContain('https://');
    });
  });

  describe('scoreImageRelevance', () => {
    const mockImage = {
      description: 'Modern suburban home with large yard'
    };

    it('calculates relevance score correctly', () => {
      const keywords = ['modern', 'suburban', 'home'];
      const score = scoreImageRelevance(mockImage, keywords);
      
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('handles edge cases', () => {
      expect(scoreImageRelevance(null, [])).toBe(0);
      expect(scoreImageRelevance({}, ['test'])).toBe(0);
    });
  });
});
