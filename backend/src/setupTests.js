// Optional: Add any global test setup for backend
const mongoose = require('mongoose');

// Optional: Connect to a test database
beforeAll(async () => {
  const url = process.env.MONGO_TEST_URI || 'mongodb://localhost:27017/test_database';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.close();
}); 