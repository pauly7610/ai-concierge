import axios from 'axios';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const secretKey = process.env.REACT_APP_UNSPLASH_SECRET_KEY;

// Add runtime validation
if (!accessKey || !secretKey) {
  console.error('Missing Unsplash API credentials');
}

export const getPropertyStockImages = async (query = 'modern house', count = 10) => {
  try {
    const response = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        query: query,
        count: count,
        orientation: 'landscape'
      },
      headers: {
        'Authorization': `Client-ID ${accessKey}`
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