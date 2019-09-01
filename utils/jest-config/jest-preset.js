// https://jestjs.io/docs/en/configuration

/* istanbul ignore file */
/* eslint-disable sort-keys */

'use strict';

module.exports = {
  testRunner: 'jest-circus/runner',
  // Jest still supports node v6 and therefore won't update jsdom past v11
  testEnvironment: 'jest-environment-jsdom-fifteen',
  transform: {
    '^.+\\.([jt]sx?|mjs)$': '@minna-ui/jest-config/transforms/es.js',
    '^.+\\.svelte$': '@minna-ui/jest-config/transforms/svelte.js',
    '^.+\\.(csv|xml)$': '@minna-ui/jest-config/transforms/null.js',
  },
  transformIgnorePatterns: ['node_modules/.+\\.(?!esm?\\.)js$'],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.[tj]sx?$',
  testPathIgnorePatterns: [
    '/__fixtures__/',
    '/__mocks__/',
    '/__sapper__/',
    '/dist/',
    '/node_modules/',
  ],
  moduleFileExtensions: [
    'mjs',
    'js',
    'ts',
    'svelte',
    'jsx',
    'tsx',
    'json',
    'css',
    'pcss',
    'node',
    'd.ts',
  ],
  moduleNameMapper: {
    '^.+\\.(jpg|jpeg|png|gif|svg|eot|otf|webp|ttf|woff2?|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '@minna-ui/jest-config/mocks/stub.js',
    // Recommended in projects with CSS modules
    // '^.+\\.(p|post|s)?css$': 'identity-obj-proxy',
    '^##/(.*)$': '<rootDir>/src/$1',
    // TODO: Submit issue to sucrase + remove once upstream is fixed
    // Workaround for sucrase transform error
    'eslint-utils': 'eslint-utils/index.js',
  },
  collectCoverageFrom: [
    '**/*.{html,js,jsx,mjs,svelte,ts,tsx}',
    '!.*rc.{js,ts}',
    '!*.config.{js,ts}',
    '!*.d.ts',
    '!**/.*rc.{js,ts}',
    '!**/*.config.{js,ts}',
    '!**/*.d.ts',
    '!**/*externs.{js,ts}',
    '!**/bin/**',
    '!**/cli/**',
  ],
  coveragePathIgnorePatterns: [
    '/__fixtures__/',
    '/__mocks__/',
    '/__sapper__/',
    '/__tests__/',
    '/dist/',
    '/fixtures/',
    '/node_modules/',
    '/test/',
  ],
  coverageDirectory: '<rootDir>/test/coverage',
  coverageReporters: ['lcov', 'text'],
  watchPathIgnorePatterns: ['/__sapper__/', '/dist/', '/node_modules/'],
};
