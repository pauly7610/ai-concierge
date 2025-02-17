// Use dynamic import to avoid breaking tests
let createApi;
try {
  const unsplashModule = require('unsplash-js');
  createApi = unsplashModule.createApi;
} catch (error) {
  console.warn('Unsplash API not available', error);
  createApi = () => null;
}

// Add to existing code
const CACHE_MAX_SIZE = 100; // Maximum number of entries
const CACHE_PRUNE_THRESHOLD = 0.8; // Prune when 80% full

// Enhanced cache management
class ImageCache {
  constructor(maxSize = CACHE_MAX_SIZE) {
    this.data = new Map();
    this.timestamps = new Map();
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    this.MAX_SIZE = maxSize;
  }

  set(key, value) {
    // Prune cache if approaching max size
    this.pruneIfNeeded();

    this.data.set(key, value);
    this.timestamps.set(key, Date.now());
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (timestamp && (Date.now() - timestamp) < this.CACHE_DURATION) {
      // Update access time to prevent early eviction
      this.timestamps.set(key, Date.now());
      return this.data.get(key);
    }
    
    // Remove expired entries
    if (timestamp) {
      this.data.delete(key);
      this.timestamps.delete(key);
    }
    
    return null;
  }

  pruneIfNeeded() {
    // Check if cache is approaching max size
    if (this.data.size >= this.MAX_SIZE * CACHE_PRUNE_THRESHOLD) {
      this.prune();
    }
  }

  prune() {
    // Sort entries by timestamp (oldest first)
    const sortedEntries = [...this.timestamps.entries()]
      .sort((a, b) => a[1] - b[1]);

    // Remove the oldest 20% of entries
    const entriesToRemove = sortedEntries.slice(0, Math.floor(this.MAX_SIZE * 0.2));

    entriesToRemove.forEach(([key]) => {
      this.data.delete(key);
      this.timestamps.delete(key);
    });

    console.log(`Pruned cache. Removed ${entriesToRemove.length} entries.`);
  }

  // Monitoring method
  getStats() {
    return {
      currentSize: this.data.size,
      maxSize: this.MAX_SIZE,
      utilizationPercentage: (this.data.size / this.MAX_SIZE) * 100
    };
  }
}

// Replace previous IMAGE_CACHE with new implementation
const IMAGE_CACHE = new ImageCache();

// Persistent Caching Option for Production
class PersistentImageCache {
  constructor() {
    this.storage = window.localStorage;
    this.CACHE_KEY = 'ZILLOW_IMAGE_CACHE';
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  }

  set(key, data, duration = 24 * 60 * 60 * 1000) {
    const cacheEntry = {
      data,
      expiry: Date.now() + duration
    };
    this.storage.setItem(`${this.CACHE_KEY}_${key}`, JSON.stringify(cacheEntry));
  }

  get(key) {
    try {
      const storedItem = this.storage.getItem(`${this.CACHE_KEY}_${key}`);
      if (!storedItem) return null;

      const cacheEntry = JSON.parse(storedItem);
      
      // Check if entry is expired
      if (Date.now() > cacheEntry.expiry) {
        this.storage.removeItem(`${this.CACHE_KEY}_${key}`);
        return null;
      }

      return cacheEntry.data;
    } catch (error) {
      console.error('Local storage retrieval failed:', error);
      return null;
    }
  }

  // Optional: Clear entire cache
  clear() {
    Object.keys(this.storage)
      .filter(key => key.startsWith(this.CACHE_KEY))
      .forEach(key => this.storage.removeItem(key));
  }
}

// Conditional cache selection
const selectCache = () => {
  // Use persistent cache in production, in-memory in development
  return process.env.NODE_ENV === 'production' 
    ? new PersistentImageCache() 
    : IMAGE_CACHE;
};

// Error class for better error handling
export class ImageFetchError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'ImageFetchError';
    this.type = type;
  }
}

// Centralized Unsplash client creation
const createUnsplashClient = () => {
  const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  
  if (!accessKey) {
    console.error('🚨 Unsplash API key is missing!');
    // Optional: Add more detailed logging or error tracking
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Tip: Check your .env file or GitHub Secrets configuration');
    }
    return null;
  }

  return createApi({
    accessKey: accessKey
  });
};

// Enhanced image relevance scoring
export const scoreImageRelevance = (image, keywords) => {
  if (!image || !keywords) return 0;

  const relevanceFactors = keywords.map(keyword => 
    image.description?.toLowerCase().includes(keyword.toLowerCase()) ? 1 : 0
  );
  
  const score = relevanceFactors.reduce((sum, factor) => sum + factor, 0) / keywords.length;
  return Math.min(score, 1); // Ensure score never exceeds 1
};

// Flexible property type image fetching
export const getPropertyTypeImage = async (type, unsplashInstance = null) => {
  const PROPERTY_TYPE_QUERIES = {
    'Single Family': ['modern suburban home', 'family house'],
    'Townhouse': ['urban townhouse', 'city living'],
    'Condo': ['luxury condo', 'apartment complex'],
    'Apartment': ['urban apartment', 'city apartment'],
    'default': ['residential property', 'modern home']
  };

  try {
    const queryOptions = PROPERTY_TYPE_QUERIES[type] || PROPERTY_TYPE_QUERIES['default'];
    const randomQuery = queryOptions[Math.floor(Math.random() * queryOptions.length)];
    
    const image = await getPropertyStockImages(randomQuery, unsplashInstance);
    
    return image || 'https://via.placeholder.com/400x300?text=Property+Image';
  } catch (error) {
    console.error(`Failed to get image for ${type}:`, error);
    return 'https://via.placeholder.com/400x300?text=Property+Image';
  }
};

// Comprehensive image fetching with robust error handling
export const getPropertyStockImages = async (query, unsplashInstance = null) => {
  // Placeholder for development/testing
  if (!process.env.REACT_APP_UNSPLASH_ACCESS_KEY && !unsplashInstance) {
    console.warn('No Unsplash API key available');
    return 'https://via.placeholder.com/400x300?text=Property+Image';
  }

  try {
    const unsplash = unsplashInstance || createUnsplashClient();
    
    if (!unsplash) {
      throw new ImageFetchError('Unsplash client not initialized', 'CONFIG_ERROR');
    }

    const result = await unsplash.photos.search({
      query,
      page: 1,
      perPage: 3,
      orientation: 'landscape'
    });

    if (result.response?.results?.[0]?.urls?.regular) {
      return result.response.results.map(photo => ({
        regular: photo.urls.regular,
        description: photo.description,
        photographer: photo.user.name
      }));
    }
    
    return 'https://via.placeholder.com/400x300?text=Property+Image';
  } catch (error) {
    console.error('Image Fetch Error:', error);
    
    // Specific error handling
    if (error.name === 'ImageFetchError') {
      // Handle configuration errors
      return 'https://via.placeholder.com/400x300?text=Configuration+Error';
    }
    
    // Network or other errors
    return 'https://via.placeholder.com/400x300?text=Property+Image';
  }
};

// Export for testing and usage
export default {
  getPropertyStockImages,
  getPropertyTypeImage,
  scoreImageRelevance,
  ImageFetchError
}; 