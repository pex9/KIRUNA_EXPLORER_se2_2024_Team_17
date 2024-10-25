module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.m?js$': 'babel-jest', // or any other transform you prefer
  },
  moduleFileExtensions: ['js', 'mjs', 'json', 'node'],
  testMatch: ['**/__tests__/**/*.test.js', '**/?(*.)+(spec|test).js'],
};