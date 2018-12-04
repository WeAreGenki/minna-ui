/* tslint:disable object-literal-sort-keys */

'use strict';

module.exports = {
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.m?jsx?$': 'babel-jest',
    '^.+\\.(htmlx?|svg)$': '@minna-ui/jest-config/lib/svelte-transform.js',
    '^.+\\.css$': '@minna-ui/jest-config/lib/null-transform.js',
  },
  transformIgnorePatterns: ['node_modules/(?!svelte/)'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.jsx?$',
  testPathIgnorePatterns: ['/__sapper__/', '/dist/', '/node_modules/'],
  moduleFileExtensions: ['html', 'htmlx', 'js', 'jsx', 'json', 'mjs', 'node'],
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
  watchPathIgnorePatterns: ['/__sapper__/', '/dist/', '/node_modules/'],
};
