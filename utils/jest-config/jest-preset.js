'use strict';

module.exports = {
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.m?js$': 'babel-jest',
    '^.+\\.(html|svg)$': '@minna-ui/jest-config/lib/svelte-transform.js',
    '^.+\\.css$': '@minna-ui/jest-config/lib/null-transform.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!svelte/)',
  ],
  testPathIgnorePatterns: [
    '/__sapper__/',
    '/dist/',
    '/node_modules/',
  ],
  moduleFileExtensions: [
    'html',
    'js',
    'json',
    'mjs',
    'ts',
  ],
  collectCoverageFrom: [
    '**/*.{html,js,mjs}',
    '!**/bin/**',
    '!**/cli/**',
    '!.*rc.js',
    '!**/.*rc.js',
    '!*.config.js',
    '!**/*.config.js',
    '!**/jest-preset.js',
    '!**/*externs.js',
  ],
  coveragePathIgnorePatterns: [
    '/__mocks__/',
    '/__sapper__/',
    '/__tests__/',
    '/dist/',
    '/fixtures/',
    '/node_modules/',
    '/test/',
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  watchPathIgnorePatterns: [
    '/__sapper__/',
    '/dist/',
  ],
};
