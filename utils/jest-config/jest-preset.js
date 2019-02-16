/* eslint-disable sort-keys */

'use strict';

module.exports = {
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.([jt]sx?|mjs)$': 'babel-jest',
    '^.+\\.(svelte|html|svg)$': '@minna-ui/jest-config/lib/svelte-transform.js',
    '^.+\\.(csv|xml)$': '@minna-ui/jest-config/lib/null-transform.js',
  },
  transformIgnorePatterns: ['node_modules/.+\\.(?!mjs|esm?\\.js)$'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[tj]sx?$',
  testPathIgnorePatterns: [
    '<rootDir>/__sapper__/',
    '/__fixtures__/',
    '/__mocks__/',
    '/dist/',
    '/node_modules/',
  ],
  moduleFileExtensions: [
    'mjs',
    'js',
    'ts',
    'jsx',
    'tsx',
    'html',
    'svelte',
    'svg',
    'json',
    'css',
    'pcss',
    'node',
    'd.ts',
  ],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff2?|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '@minna-ui/jest-config/lib/stubMock.js',
    '^.+\\.p?css$': 'identity-obj-proxy',
    '^##/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    '**/*.{html,js,jsx,mjs,svg,ts,tsx}',
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
    '<rootDir>/__sapper__/',
    '/__fixtures__/',
    '/__mocks__/',
    '/__tests__/',
    '/dist/',
    '/fixtures/',
    '/node_modules/',
    '/test/',
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  watchPathIgnorePatterns: [
    '<rootDir>/__sapper__/',
    '/dist/',
    '/node_modules/',
  ],
};
