import '@testing-library/jest-dom';

// Optional: Add global test configuration
jest.setTimeout(10000); // Increase timeout for async tests

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;
