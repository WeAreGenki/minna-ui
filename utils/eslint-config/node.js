/**
 * ESLint config preset for node code in minna-ui projects.
 */

/* eslint-disable sort-keys */

'use strict';

module.exports = {
  root: false, // this should extend the developer's project root config OR another preset
  parserOptions: {
    sourceType: 'script',
  },
  env: {
    browser: false,
    node: true,
  },
  rules: {
    '@typescript-eslint/no-var-requires': 'off',
  },
};
