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
  });
});
