/* tslint:disable object-literal-sort-keys */

'use strict';

module.exports = {
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.m?jsx?$': 'babel-jest',
    '^.+\\.tsx?$': 'ts-jest', // XXX: `ts-jest` is not included by default!
    '^.+\\.(htmlx?|svg)$': '@minna-ui/jest-config/lib/svelte-transform.js',
    '^.+\\.css$': '@minna-ui/jest-config/lib/null-transform.js',
  },
  transformIgnorePatterns: ['node_modules/(?!svelte/)'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  testPathIgnorePatterns: ['/__sapper__/', '/dist/', '/node_modules/'],
  moduleFileExtensions: [
    'html',
    'htmlx',
    'js',
    'jsx',
    'json',
    'mjs',
    'node',
    'ts',
    'tsx',
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
  watchPathIgnorePatterns: ['/__sapper__/', '/dist/', '/node_modules/'],
};
