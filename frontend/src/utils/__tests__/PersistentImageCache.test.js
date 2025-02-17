const { PersistentImageCache } = require('../stockImages');

// Create a more robust localStorage mock
const createLocalStorageMock = () => {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = JSON.stringify(value);
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    })
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
    cache.set('testKey', testData);
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    const retrievedValue = cache.get('testKey');
    expect(retrievedValue).toEqual(testData);
  });

  it('expires entries after cache duration', () => {
    jest.useFakeTimers();
    
    const testData = { data: 'oldValue' };
    cache.set('expiredKey', testData);
    
    // Fast forward past cache duration
    jest.advanceTimersByTime(25 * 60 * 60 * 1000);
    
    const retrievedValue = cache.get('expiredKey');
    expect(retrievedValue).toBeNull();

    jest.useRealTimers(); // Reset timers
  });

  it('handles JSON parsing errors', () => {
    // Simulate a corrupt localStorage entry
    localStorageMock.getItem.mockReturnValueOnce('invalid json');
    
    const retrievedValue = cache.get('corruptKey');
    expect(retrievedValue).toBeNull();
  });

  it('clears entire cache', () => {
    cache.set('key1', { data: 'value1' });
    cache.set('key2', { data: 'value2' });
    
    cache.clear();

    expect(localStorageMock.removeItem).toHaveBeenCalledTimes(2);
  });
});
