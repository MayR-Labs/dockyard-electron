module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js', '!**/__mocks__/**'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/renderer/**/*',
    '!src/**/index.js',
    '!src/**/__mocks__/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  moduleNameMapper: {
    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^electron-store$': '<rootDir>/src/main/__tests__/__mocks__/electron-store.js',
    '^uuid$': '<rootDir>/src/main/__tests__/__mocks__/uuid.js',
  },
};
