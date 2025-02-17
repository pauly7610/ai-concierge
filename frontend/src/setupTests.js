import '@testing-library/jest-dom';

// Optional: Add global test configuration
jest.setTimeout(10000); // Increase timeout for async tests

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock environment variables
Object.defineProperty(window, 'process', {
  value: {
    env: {
      REACT_APP_UNSPLASH_ACCESS_KEY: 'test_key'
    }
  },
  writable: true
});

// Ensure test environment always has a mock key
if (!process.env.REACT_APP_UNSPLASH_ACCESS_KEY) {
  process.env.REACT_APP_UNSPLASH_ACCESS_KEY = 'test_mock_key';
}
