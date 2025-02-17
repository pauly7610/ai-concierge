const { PersistentImageCache } = require('../stockImages');

// Create a more robust localStorage mock
const createLocalStorageMock = () => {
  let store = {};
  return {
    getItem: jest.fn(key => {
      const item = store[key];
      return item ? JSON.stringify(item) : null;
    }),
    setItem: jest.fn((key, value) => {
      store[key] = JSON.parse(value);
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0
  };
};

describe('PersistentImageCache', () => {
  let cache;
  let localStorageMock;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();
    Object.defineProperty(window, 'localStorage', { 
      value: localStorageMock,
      writable: true 
    });
    cache = new PersistentImageCache();
    localStorageMock.clear(); // Reset store before each test
  });

  it('sets and retrieves cache entries', () => {
    const testData = { data: 'testValue' };
    const testKey = 'testKey';
    
    cache.set(testKey, testData);
    const retrievedValue = cache.get(testKey);
    
    expect(retrievedValue).toEqual(testData);
  });

  it('expires entries after cache duration', () => {
    jest.useFakeTimers();
    const testKey = 'expiredKey';
    const testData = { data: 'oldValue' };
    
    cache.set(testKey, testData, -1000); // Set expiry in the past
    const retrievedValue = cache.get(testKey);
    
    expect(retrievedValue).toBeNull();
    
    jest.useRealTimers();
  });

  it('handles JSON parsing errors', () => {
    // Simulate a corrupt localStorage entry
    localStorageMock.getItem.mockReturnValueOnce('invalid json');
    
    const retrievedValue = cache.get('corruptKey');
    expect(retrievedValue).toBeNull();
  });

  it('clears entire cache', () => {
    const mockKeys = ['ZILLOW_IMAGE_CACHE_key1', 'ZILLOW_IMAGE_CACHE_key2'];
    
    // Create a spy function
    const removeItemSpy = jest.fn();
    
    // Mock Object.keys to return our mock keys
    Object.keys = jest.fn().mockReturnValue(mockKeys);
    
    // Create cache with mocked localStorage
    const cache = new PersistentImageCache();
    cache.storage = {
      removeItem: removeItemSpy
    };

    cache.clear();

    // Use expect().toEqual() instead of .toBe()
    expect(removeItemSpy.mock.calls.length).toEqual(2);
    mockKeys.forEach(key => {
      expect(removeItemSpy).toHaveBeenCalledWith(key);
    });
  });
});
