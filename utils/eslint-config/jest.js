/**
 * ESLint preset for Jest testing in minna-ui projects.
 */

'use strict';

module.exports = {
  root: false, // this should extend the developer's project root config OR another preset
  extends: ['plugin:jest/recommended'],
  env: {
    jest: true,
  },
  globals: {
    expectPage: true,
    page: true,
  },
  plugins: ['jest', 'import'],
  parserOptions: {
    sourceType: 'script',
  },
  rules: {
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: true,
        peerDependencies: true,
      },
    ],
    'no-new': 'off', // allow new keyword to create svelte component instances
    'no-underscore-dangle': 'off', // allow access to properties with leading underscores
  },
};
