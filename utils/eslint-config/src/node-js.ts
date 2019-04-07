/**
 * Minna UI node with JavaScript ESLint config add-on.
 * @fileoverview Provides extra config for node projects which only use plain
 * JavaScript (and not TypeScript). This config is and add-on which should
 * extend the base config preset.
 * @see https://eslint.org/docs/user-guide/configuring
 */

/* eslint-disable sort-keys */

export = {
  parser: 'espree', // default eslint parser
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
    // turn off rules which require TS type info
    '@typescript-eslint/no-for-in-array': 'off',
    '@typescript-eslint/no-unnecessary-qualifier': 'off',
    '@typescript-eslint/no-unnecessary-type-assertion': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/require-array-sort-compare': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
  },
};
