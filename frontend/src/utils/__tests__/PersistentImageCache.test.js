import { PersistentImageCache } from '../stockImages';

describe('PersistentImageCache', () => {
  let cache;
  let mockStorage;

  beforeEach(() => {
    // Create a fresh mock storage before each test
    mockStorage = {
      store: {},
      getItem: jest.fn((key) => mockStorage.store[key]),
      setItem: jest.fn((key, value) => {
        mockStorage.store[key] = value;
      }),
      removeItem: jest.fn((key) => {
        delete mockStorage.store[key];
      }),
      clear: jest.fn(() => {
        mockStorage.store = {};
      }),
      // Add method to help with testing
      getAllKeys: () => Object.keys(mockStorage.store)
    };

    // Mock localStorage in the window object
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });

    // Create a fresh cache instance
    cache = new PersistentImageCache();
  });

  afterEach(() => {
    // Clean up after each test
    jest.restoreAllMocks();
    mockStorage.clear();
  });

  it('should set and get cache entries', () => {
    const testKey = 'testKey';
    const testData = { url: 'https://example.com/image.jpg' };
    
    cache.set(testKey, testData);
    const result = cache.get(testKey);
    
    expect(result).toEqual(testData);
    expect(mockStorage.setItem).toHaveBeenCalledTimes(1);
    expect(mockStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should return null for non-existent cache entries', () => {
    const result = cache.get('nonexistent');
    expect(result).toBeNull();
    expect(mockStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should handle expired cache entries', () => {
    const testKey = 'expiredKey';
    const testData = { url: 'https://example.com/image.jpg' };
    
    // Set cache with negative expiration (already expired)
    cache.set(testKey, testData, -1000);
    const result = cache.get(testKey);
    
    expect(result).toBeNull();
    expect(mockStorage.removeItem).toHaveBeenCalledWith(
      `ZILLOW_IMAGE_CACHE_${testKey}`
    );
  });

  it('should handle JSON parsing errors', () => {
    // Mock invalid JSON in storage
    mockStorage.getItem.mockReturnValueOnce('invalid json');
    
    const result = cache.get('testKey');
    
    expect(result).toBeNull();
    expect(mockStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should clear all cache entries', () => {
    // Set up multiple cache entries
    const testEntries = {
      'key1': { url: 'https://example.com/1.jpg' },
      'key2': { url: 'https://example.com/2.jpg' },
      'key3': { url: 'https://example.com/3.jpg' }
    };

    // Populate cache
    Object.entries(testEntries).forEach(([key, value]) => {
      cache.set(key, value);
    });

    // Clear the cache
    cache.clear();

    // Verify all cache entries were removed
    Object.keys(testEntries).forEach(key => {
      expect(cache.get(key)).toBeNull();
    });

    // Verify removeItem was called for each cache entry
    expect(mockStorage.removeItem).toHaveBeenCalledTimes(
      Object.keys(testEntries).length
    );
  });

  it('should preserve non-cache entries in localStorage', () => {
    // Add a non-cache entry to localStorage
    mockStorage.setItem('NON_CACHE_KEY', 'some value');
    
    // Add a cache entry
    cache.set('testKey', { url: 'https://example.com/image.jpg' });
    
    // Clear the cache
    cache.clear();
    
    // Verify non-cache entry still exists
    expect(mockStorage.getItem('NON_CACHE_KEY')).toBe('some value');
  });

  it('should handle cache size limits', () => {
    // Assuming MAX_CACHE_SIZE is 100
    const maxEntries = 101; // One more than the limit
    
    // Add more entries than the cache limit
    for (let i = 0; i < maxEntries; i++) {
      cache.set(`key${i}`, { url: `https://example.com/image${i}.jpg` });
    }
    
    // Verify oldest entries were removed
    expect(cache.get('key0')).toBeNull();
    expect(cache.get(`key${maxEntries - 1}`)).not.toBeNull();
  });

  it('should handle concurrent operations', async () => {
    const promises = [
      cache.set('key1', { url: 'https://example.com/1.jpg' }),
      cache.set('key2', { url: 'https://example.com/2.jpg' }),
      cache.get('key1'),
      cache.clear()
    ];
    
    await Promise.all(promises);
    
    // Verify the cache is in a consistent state
    expect(mockStorage.getAllKeys()).toHaveLength(0);
  });
});