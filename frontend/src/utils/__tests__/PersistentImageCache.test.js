import { PersistentImageCache } from '../stockImages';

describe('PersistentImageCache', () => {
  let cache;
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: jest.fn(key => store[key] || null),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: jest.fn(key => {
        delete store[key];
      })
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    cache = new PersistentImageCache();
    localStorageMock.clear(); // Reset store before each test
  });

  it('sets and retrieves cache entries', () => {
    cache.set('testKey', { data: 'testValue' });
    
    expect(localStorageMock.setItem).toHaveBeenCalled();
    
    const retrievedValue = cache.get('testKey');
    expect(retrievedValue).toEqual({ data: 'testValue' });
  });

  it('expires entries after cache duration', () => {
    jest.useFakeTimers();
    
    cache.set('expiredKey', { data: 'oldValue' });
    
    // Fast forward past cache duration
    jest.advanceTimersByTime(25 * 60 * 60 * 1000);
    
    const retrievedValue = cache.get('expiredKey');
    expect(retrievedValue).toBeNull();

    jest.useRealTimers(); // Reset timers
  });

  // Additional recommended tests
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
