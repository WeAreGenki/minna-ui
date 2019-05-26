/**
 * Minna UI node with TypeScript ESLint config add-on.
 *
 * @fileoverview Provides extra config for node projects which use TypeScript.
 * This config is and add-on which should extend the base config preset.
 * @see https://eslint.org/docs/user-guide/configuring
 */

/* eslint-disable sort-keys */

'use strict';

/** @type {import('./types').ESLintConfig} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  env: {
    browser: false,
    node: true,
  },
};
