/**
 * Minna UI node with JavaScript ESLint config add-on.
 *
 * @file This config is an add-on which should extend the base config preset.
 * Provides extra config for node projects which only use plain JavaScript (and
 * not TypeScript).
 *
 * @see https://eslint.org/docs/user-guide/configuring
 */

/* eslint-disable sort-keys */

'use strict';

const OFF = 0;
const ERROR = 2;

/** @type {import('./types').ESLintConfig} */
module.exports = {
  parserOptions: {
    ecmaFeatures: {
      browser: false,
      es6: true,
    },
    ecmaVersion: 2019,
    sourceType: 'script',
  },
  env: {
    browser: false,
    node: true,
  },
  rules: {
    /* eslint-enable sort-keys */
    // Turn off rules which need TS type info or which don't make sense for JS
    '@typescript-eslint/no-for-in-array': OFF,
    '@typescript-eslint/no-require-imports': OFF,
    '@typescript-eslint/no-unnecessary-condition': OFF,
    '@typescript-eslint/no-unnecessary-qualifier': OFF,
    '@typescript-eslint/no-unnecessary-type-assertion': OFF,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/require-array-sort-compare': OFF,
    '@typescript-eslint/restrict-plus-operands': OFF,
    'jsdoc/no-types': OFF,
    strict: [ERROR, 'safe'],
  },

  // eslint-disable-next-line sort-keys
  overrides: [
    {
      // It's common to write unit tests in TS/ESM or include type declarations
      // even in JS projects so we handle that scenario
      files: ['*.ts', '*.tsx', '*.d.ts', '*.mjs'],
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
      },
    },
  ],
};
