import axios from 'axios';

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

export const getPropertyStockImages = async (query = 'modern house', count = 10) => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        query: query,
        count: count,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
      }
    });

    return response.data.map(photo => ({
      full: photo.urls.full,
      regular: photo.urls.regular,
      small: photo.urls.small,
      thumbnail: photo.urls.thumb,
      alt: photo.alt_description || 'Property Image'
    }));
  } catch (error) {
    console.error('Error fetching stock images:', error);
    return [];
  }
};

export const getPropertyTypeImage = async (type) => {
  const typeQueries = {
    'Single Family': 'suburban house',
    'Townhouse': 'modern townhouse',
    'Condo': 'luxury apartment',
    'default': 'real estate'
  };

  const query = typeQueries[type] || typeQueries['default'];
  const images = await getPropertyStockImages(query, 1);
  return images[0]?.regular || 'https://via.placeholder.com/400x300';
}; 