import { PersistentImageCache } from '../stockImages';

describe('PersistentImageCache', () => {
  let cache;
  let mockStorage;
  let realDateNow;

  beforeEach(() => {
    // Save real Date.now and mock it
    realDateNow = Date.now;
    const currentTime = 1739888028000; // Set a fixed timestamp
    Date.now = jest.fn(() => currentTime);

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
      getAllKeys: () => Object.keys(mockStorage.store)
    };

    // Mock localStorage
    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });

    // Create fresh cache instance
    cache = new PersistentImageCache();
  });

  afterEach(() => {
    // Restore real Date.now
    Date.now = realDateNow;
    jest.restoreAllMocks();
    mockStorage.clear();
  });

  it('should set and get cache entries', () => {
    const testKey = 'testKey';
    const testData = { url: 'https://example.com/image.jpg' };
    
    cache.set(testKey, testData);
    
    // Get raw value from storage to verify format
    const rawStored = mockStorage.getItem(`ZILLOW_IMAGE_CACHE_${testKey}`);
    const parsed = JSON.parse(rawStored);
    expect(parsed).toEqual({
      data: testData,
      expiry: expect.any(Number)
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
    const currentTime = Date.now();
    
    // Set data
    cache.set(testKey, testData);
    
    // Move time forward past expiration
    Date.now = jest.fn(() => currentTime + (24 * 60 * 60 * 1000 + 1));
    
    const result = cache.get(testKey);
    expect(result).toBeNull();
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
      'key2': { url: 'https://example.com/2.jpg' }
    };

    // Add a non-cache entry
    mockStorage.setItem('NON_CACHE_KEY', 'preserved');

    // Populate cache
    Object.entries(testEntries).forEach(([key, value]) => {
      cache.set(key, value);
    });

    // Verify initial state
    expect(Object.keys(mockStorage.store).filter(key => 
      key.startsWith('ZILLOW_IMAGE_CACHE_')
    )).toHaveLength(2);

    // Clear the cache
    cache.clear();

    // Verify final state
    const remainingCacheKeys = Object.keys(mockStorage.store).filter(key => 
      key.startsWith('ZILLOW_IMAGE_CACHE_')
    );
    expect(remainingCacheKeys).toHaveLength(0);
    expect(mockStorage.store['NON_CACHE_KEY']).toBe('preserved');
  });

  it('should handle cache size limits', () => {
    const currentTime = Date.now();
    const entries = [
      { key: 'first', value: { url: 'first.jpg' }, time: currentTime },
      { key: 'second', value: { url: 'second.jpg' }, time: currentTime + 1000 },
      { key: 'third', value: { url: 'third.jpg' }, time: currentTime + 2000 }
    ];

    // Add entries with different timestamps
    entries.forEach(({ key, value, time }) => {
      Date.now = jest.fn(() => time);
      cache.set(key, value);
    });

    // Add new entry to trigger size limit
    Date.now = jest.fn(() => currentTime + 3000);
    cache.set('fourth', { url: 'fourth.jpg' });

    // Get the remaining keys
    const remainingKeys = Object.keys(mockStorage.store)
      .filter(key => key.startsWith('ZILLOW_IMAGE_CACHE_'))
      .map(key => key.replace('ZILLOW_IMAGE_CACHE_', ''));

    // Verify most recent entries are kept
    expect(remainingKeys).not.toContain('first');
    expect(remainingKeys).toContain('fourth');
  });
});