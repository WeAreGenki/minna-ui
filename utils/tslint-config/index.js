/**
 * TSLint config preset for minna-ui projects.
 */

/* tslint:disable object-literal-sort-keys */

'use strict';

module.exports = {
  extends: ['tslint:latest', 'tslint-config-airbnb', 'tslint-config-prettier'],
  rulesDirectory: ['tslint-plugin-prettier'],
  rules: {
    curly: [true, 'ignore-same-line'],
    'object-literal-sort-keys': [
      true,
      'ignore-case',
      'match-declaration-order',
      'shorthand-first',
    ],
    prettier: true,
  },
  // "jsRules": true,
  // FIXME: Remove this and replace with above once new tslint version is released
  jsRules: {
    curly: [true, 'ignore-same-line'],
    'object-literal-sort-keys': [
      true,
      'ignore-case',
      'match-declaration-order',
      'shorthand-first',
    ],
    quotemark: [true, 'single', 'avoid-escape', 'avoid-template'],
    prettier: true,
  },
  linterOptions: {
    exclude: [
      '**/__sapper__/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/test/coverage/**',
      '__sapper__/**',
      'dist/**',
      'node_modules/**',
      'test/coverage/**',
    ],
  },
};
