module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [
    '**/?(*.)+(spec|test).ts?(x)',
    '**/__tests__/**/*.ts?(x)',
  ],
};