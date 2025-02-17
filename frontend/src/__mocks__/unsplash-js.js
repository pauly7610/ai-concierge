module.exports = {
  createApi: jest.fn(() => ({
    photos: {
      search: jest.fn().mockResolvedValue({
        response: {
          results: [
            {
              urls: { 
                regular: 'https://example.com/test-image.jpg',
                small: 'https://example.com/small-image.jpg'
              },
              description: 'Modern suburban home with large yard',
              user: { name: 'Test Photographer' }
            }
          ]
        }
      })
    }
  }))
}; 