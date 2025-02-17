import { PersistentImageCache } from '../stockImages';

describe('PersistentImageCache', () => {
  let cache;
  let mockStorage;
  let realDateNow;

  beforeEach(() => {
    realDateNow = Date.now;
    const currentTime = 1739888028000;
    Date.now = jest.fn(() => currentTime);

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
      // Add method to simulate real localStorage key iteration
      key: jest.fn((index) => Object.keys(mockStorage.store)[index]),
      length: 0,
      getAllKeys: () => Object.keys(mockStorage.store)
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockStorage,
      writable: true
    });

    cache = new PersistentImageCache();
  });

  afterEach(() => {
    Date.now = realDateNow;
    jest.restoreAllMocks();
    mockStorage.clear();
  });

  // ... other tests remain the same ...

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

    // Mock the removeItem method to actually remove items
    const removeItemSpy = jest.spyOn(mockStorage, 'removeItem');
    
    // Clear the cache
    cache.clear();

    // Verify the correct keys were removed
    const removeCallKeys = removeItemSpy.mock.calls.map(call => call[0]);
    expect(removeCallKeys.sort()).toEqual([
      'ZILLOW_IMAGE_CACHE_key1',
      'ZILLOW_IMAGE_CACHE_key2'
    ].sort());
    
    // Verify non-cache key was preserved
    expect(mockStorage.getItem('NON_CACHE_KEY')).toBe('preserved');
  });

  it('should handle cache size limits', () => {
    // Set initial cache size limit for testing
    const MAX_ENTRIES = 3;
    Object.defineProperty(cache, 'MAX_ENTRIES', { value: MAX_ENTRIES });

    const entries = [
      { key: 'entry1', value: { url: 'first.jpg' } },
      { key: 'entry2', value: { url: 'second.jpg' } },
      { key: 'entry3', value: { url: 'third.jpg' } }
    ];

    // Add initial entries
    entries.forEach(({ key, value }) => {
      cache.set(key, value);
    });

    // Add one more to exceed limit
    cache.set('entry4', { url: 'fourth.jpg' });

    // Check that we still only have MAX_ENTRIES entries
    const cacheKeys = Object.keys(mockStorage.store)
      .filter(key => key.startsWith('ZILLOW_IMAGE_CACHE_'));
    expect(cacheKeys).toHaveLength(MAX_ENTRIES);

    // Verify we can still get the most recent entry
    expect(cache.get('entry4')).toEqual({ url: 'fourth.jpg' });
  });
});