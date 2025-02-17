import axios from 'axios';

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

  set(key, value) {
    try {
      const cacheEntry = {
        data: value,
        timestamp: Date.now()
      };
      this.storage.setItem(`${this.CACHE_KEY}_${key}`, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error('Local storage caching failed:', error);
    }
  }

  get(key) {
    try {
      const cacheEntryString = this.storage.getItem(`${this.CACHE_KEY}_${key}`);
      if (!cacheEntryString) return null;

      const cacheEntry = JSON.parse(cacheEntryString);
      
      // Check if entry is expired
      if (Date.now() - cacheEntry.timestamp > this.CACHE_DURATION) {
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

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const secretKey = process.env.REACT_APP_UNSPLASH_SECRET_KEY;

// Comprehensive error handling
class ImageFetchError extends Error {
  constructor(message, type) {
    super(message);
    this.name = 'ImageFetchError';
    this.type = type;
  }
}

// Enhanced query options with more diversity
const PROPERTY_TYPE_QUERIES = {
  'Single Family': [
    'modern suburban home with large yard',
    'traditional family house with trees',
    'spacious suburban residence with landscaping',
    'well-maintained family property with garage',
    'american suburban house with front porch',
    'mid-century modern family home'
  ],
  'Townhouse': [
    'contemporary urban townhouse with balcony',
    'modern multi-level townhome with brick facade',
    'stylish city townhouse with rooftop terrace',
    'architectural townhouse design in historic district',
    'minimalist urban townhouse',
    'townhouse with contemporary architectural elements'
  ],
  'Condo': [
    'luxury high-rise condo with city view',
    'modern urban apartment with floor-to-ceiling windows',
    'sleek city condominium with open floor plan',
    'minimalist condo interior with natural light',
    'waterfront condo with modern design',
    'downtown luxury condominium'
  ],
  'default': [
    'real estate', 
    'modern home', 
    'property', 
    'residential building', 
    'architectural home design'
  ]
};

// Usage remains the same, but now uses selected cache
export const getPropertyStockImages = async (query, count = 3) => {
  const cache = selectCache();
  
  // Check cache first
  const cacheKey = `${query}_${count}`;
  const cachedResult = cache.get(cacheKey);
  if (cachedResult) return cachedResult;

  try {
    if (!accessKey) {
      throw new ImageFetchError('Missing Unsplash API key', 'CONFIGURATION');
    }

    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        query: query,
        count: count,
        orientation: 'landscape',
        content_filter: 'high'
      },
      headers: {
        'Authorization': `Client-ID ${accessKey}`
      },
      timeout: 10000 // 10-second timeout
    });

    const processedImages = response.data.map(photo => ({
      full: photo.urls.full,
      regular: photo.urls.regular,
      small: photo.urls.small,
      thumbnail: photo.urls.thumb,
      alt: photo.alt_description || `${query} property image`,
      photographer: photo.user.name,
      photographerLink: photo.user.links.html,
      relevanceScore: scoreImageRelevance(photo, query)
    }));

    // Sort images by relevance score
    const sortedImages = processedImages.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Cache the result
    cache.set(cacheKey, sortedImages);

    return sortedImages;

  } catch (error) {
    console.error('Image Fetch Error:', error);
    
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new ImageFetchError(`API Error: ${error.response.status}`, 'API_ERROR');
    } else if (error.request) {
      // The request was made but no response was received
      throw new ImageFetchError('No response from Unsplash', 'NETWORK_ERROR');
    } else {
      // Something happened in setting up the request
      throw new ImageFetchError('Error configuring image request', 'CONFIG_ERROR');
    }
  }
};

export const getPropertyTypeImage = async (type) => {
  try {
    const queryOptions = PROPERTY_TYPE_QUERIES[type] || PROPERTY_TYPE_QUERIES['default'];
    const randomQuery = queryOptions[Math.floor(Math.random() * queryOptions.length)];
    
    const images = await getPropertyStockImages(randomQuery, 3);
    
    // Preference order with fallback
    return images[0]?.regular || 
           images[0]?.small || 
           'https://via.placeholder.com/400x300?text=Property+Image';

  } catch (error) {
    console.error(`Failed to get image for ${type}:`, error);
    return 'https://via.placeholder.com/400x300?text=Property+Image';
  }
};

// Enhanced relevance scoring
export const scoreImageRelevance = (photo, query) => {
  const keywords = query.toLowerCase().split(' ');
  
  const descriptionScore = keywords.reduce((score, keyword) => {
    const altMatch = photo.alt_description?.toLowerCase().includes(keyword) ? 1 : 0;
    const tagsMatch = photo.tags?.some(tag => tag.toLowerCase().includes(keyword)) ? 1 : 0;
    return score + altMatch + tagsMatch;
  }, 0);

  // Additional scoring factors
  const qualityScore = photo.width > 1200 ? 1 : 0;
  const aspectRatioScore = photo.width / photo.height > 1.5 ? 1 : 0;

  return (descriptionScore + qualityScore + aspectRatioScore) / 3;
};

module.exports = {
  getPropertyStockImages,
  getPropertyTypeImage,
  scoreImageRelevance,
  ImageCache,
  PersistentImageCache
}; 