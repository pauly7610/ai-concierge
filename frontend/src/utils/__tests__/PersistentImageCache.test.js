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
      // Helper methods for testing
      getAllKeys: () => Object.keys(mockStorage.store),
      _getStore: () => mockStorage.store // For debugging
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
    jest.restoreAllMocks();
    mockStorage.clear();
  });

  it('should set and get cache entries', () => {
    const testKey = 'testKey';
    const testData = { url: 'https://example.com/image.jpg' };
    
    cache.set(testKey, testData);
    
    // Get raw value from storage to verify format
    const rawStored = mockStorage.getItem(`ZILLOW_IMAGE_CACHE_${testKey}`);
    expect(JSON.parse(rawStored)).toEqual({
      value: testData,
      timestamp: expect.any(Number)
    });

    // Verify retrieval
    const result = cache.get(testKey);
    expect(result).toEqual(testData);
  });

  it('should return null for non-existent cache entries', () => {
    const result = cache.get('nonexistent');
    expect(result).toBeNull();
    expect(mockStorage.getItem).toHaveBeenCalledWith('ZILLOW_IMAGE_CACHE_nonexistent');
  });

  it('should handle expired cache entries', () => {
    const testKey = 'expiredKey';
    const testData = { url: 'https://example.com/image.jpg' };
    
    // Mock Date.now() to control time
    const now = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => now);
    
    // Set cache with data that's already expired
    cache.set(testKey, testData);
    
    // Move time forward past expiration
    jest.spyOn(Date, 'now').mockImplementation(() => now + (24 * 60 * 60 * 1000 + 1));
    
    const result = cache.get(testKey);
    expect(result).toBeNull();
    expect(mockStorage.removeItem).toHaveBeenCalledWith(`ZILLOW_IMAGE_CACHE_${testKey}`);
  });

  it('should handle JSON parsing errors', () => {
    const testKey = 'invalidJson';
    mockStorage.store[`ZILLOW_IMAGE_CACHE_${testKey}`] = 'invalid json';
    
    const result = cache.get(testKey);
    expect(result).toBeNull();
  });

  it('should clear all cache entries', () => {
    // Set up multiple cache entries
    const testEntries = {
      'key1': { url: 'https://example.com/1.jpg' },
      'key2': { url: 'https://example.com/2.jpg' },
      'key3': { url: 'https://example.com/3.jpg' }
    };

    // Add a non-cache entry to verify it's not removed
    mockStorage.setItem('NON_CACHE_KEY', 'preserved');

    // Populate cache
    Object.entries(testEntries).forEach(([key, value]) => {
      cache.set(key, value);
    });

    // Clear the cache
    cache.clear();

    // Verify cache entries are removed
    Object.keys(testEntries).forEach(key => {
      const fullKey = `ZILLOW_IMAGE_CACHE_${key}`;
      expect(mockStorage.store[fullKey]).toBeUndefined();
    });

    // Verify non-cache entry is preserved
    expect(mockStorage.store['NON_CACHE_KEY']).toBe('preserved');
  });

  it('should preserve non-cache entries in localStorage', () => {
    mockStorage.setItem('NON_CACHE_KEY', JSON.stringify({ value: 'preserved' }));
    cache.set('testKey', { url: 'https://example.com/image.jpg' });
    
    cache.clear();
    
    expect(mockStorage.store['NON_CACHE_KEY']).toBeDefined();
    expect(mockStorage.store['ZILLOW_IMAGE_CACHE_testKey']).toBeUndefined();
  });

  it('should handle cache size limits', () => {
    // Mock implementation to verify size limiting
    const maxEntries = 3; // Small number for testing
    const entries = Array.from({ length: maxEntries + 1 }, (_, i) => ({
      key: `key${i}`,
      value: { url: `https://example.com/image${i}.jpg` }
    }));

    // Add entries sequentially
    entries.forEach(({ key, value }) => {
      cache.set(key, value);
    });

    // Verify only the most recent entries are kept
    expect(cache.get(entries[0].key)).toBeNull(); // Oldest entry should be removed
    expect(cache.get(entries[entries.length - 1].key)).not.toBeNull(); // Newest entry should exist
  });

  it('should maintain order of entries for cache limiting', () => {
    const entries = [
      { key: 'first', value: { url: 'first.jpg' } },
      { key: 'second', value: { url: 'second.jpg' } },
      { key: 'third', value: { url: 'third.jpg' } }
    ];

    entries.forEach(({ key, value }) => {
      cache.set(key, value);
      // Ensure some time difference between entries
      jest.advanceTimersByTime(1000);
    });

    // Access second entry to update its timestamp
    cache.get('second');
    
    // Add new entry to trigger size limit
    cache.set('fourth', { url: 'fourth.jpg' });

    // 'first' should be removed as it's oldest and unused
    expect(cache.get('first')).toBeNull();
    // 'second' should still exist as it was recently accessed
    expect(cache.get('second')).not.toBeNull();
  });

  it('should handle concurrent operations safely', async () => {
    const operations = [
      () => cache.set('key1', { url: 'image1.jpg' }),
      () => cache.get('key1'),
      () => cache.set('key2', { url: 'image2.jpg' }),
      () => cache.clear()
    ];

    await Promise.all(operations.map(op => Promise.resolve().then(op)));

    // After all operations, cache should be empty due to clear()
    expect(Object.keys(mockStorage.store).filter(key => 
      key.startsWith('ZILLOW_IMAGE_CACHE_')
    )).toHaveLength(0);
  });
});