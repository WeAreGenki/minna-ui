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
    '!**/bin/**',
    '!**/cli/**',
    '!.*rc.js',
    '!**/.*rc.js',
    '!*.config.js',
    '!**/*.config.js',
    '!**/jest-preset.js',
    '!**/component-externs.js',
  ],
  coveragePathIgnorePatterns: [
    '/dist/',
    '/export/',
    '/fixtures/',
    '/node_modules/',
    '/public/',
    '/test/',
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  watchPathIgnorePatterns: [
    '/dist/',
    '/export/',
    '/public/',
  ],
};
