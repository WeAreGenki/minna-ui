/**
 * Minna UI node with TypeScript ESLint config add-on.
 *
 * @file This config is an add-on which should extend the base config preset.
 * Provides extra config for node projects which use TypeScript.
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
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    browser: false,
    node: true,
  },
  rules: {
    '@typescript-eslint/no-require-imports': ERROR,
    'jsdoc/no-types': ERROR,
    'jsdoc/require-param': OFF,
    'jsdoc/require-param-type': OFF,
    'jsdoc/require-returns': OFF,
    'jsdoc/require-returns-type': OFF,
    'lines-between-class-members': [
      ERROR,
      'always',
      { exceptAfterSingleLine: true }, // Useful to declare class member types
    ],
  },
};
