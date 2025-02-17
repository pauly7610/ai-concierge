const { ImageCache } = require('../stockImages');

describe('ImageCache', () => {
  let cache;

  beforeEach(() => {
    cache = new ImageCache(10); // Small cache for testing
  });

  // Potential Issue: The import assumes ImageCache is exported from stockImages
  // Recommendation: Verify the export in stockImages.js

  it('sets and retrieves cache entries', () => {
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('expires entries after cache duration', () => {
    jest.useFakeTimers();
    
    cache.set('key1', 'value1');
    
    // Fast forward past cache duration
    jest.advanceTimersByTime(25 * 60 * 60 * 1000);
    
    expect(cache.get('key1')).toBeNull();

    jest.useRealTimers(); // Reset timers
  });

  it('prunes cache when approaching max size', () => {
    // Fill cache
    for (let i = 0; i < 9; i++) {
      cache.set(`key${i}`, `value${i}`);
    }

    // Add one more to trigger pruning
    cache.set('key9', 'value9');

    // Check cache stats
    const stats = cache.getStats();
    expect(stats.currentSize).toBeLessThan(10);
  });
});