module.exports = {
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: [
    '**/__tests__/**/*.+(js)',
    '**/?(*.)+(spec|test).+(js)'
  ]
}; 