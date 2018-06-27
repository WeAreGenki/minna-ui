'use strict';

module.exports = {
  transform: {
    '^.+\\.m?js$': 'babel-jest',
    '^.+\\.(html|svg)$': '@minna-ui/jest-config/lib/svelte-transform.js',
    '^.+\\.css$': '@minna-ui/jest-config/lib/null-transform.js',
  },
  testPathIgnorePatterns: [
    '/dist/',
    '/export/',
    '/node_modules/',
    '/public/',
  ],
  moduleFileExtensions: [
    'html',
    'js',
    'json',
    'mjs',
  ],
  collectCoverageFrom: [
    '**/*.{html,js,mjs}',
    '!.*rc.js',
    '!**/.*rc.js',
    '!*.config.js',
    '!**/*.config.js',
    '!**/jest-preset.js',
  ],
  coveragePathIgnorePatterns: [
    '/dist/',
    '/export/',
    '/fixtures/',
    '/node_modules/',
    '/public/',
    '/test/',
  ],
  coverageDirectory: '<rootDir>/test/unit/coverage',
  watchPathIgnorePatterns: [
    '/dist/',
    '/export/',
    '/public/',
  ],
};
