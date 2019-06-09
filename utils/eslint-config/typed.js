/**
 * Minna UI typed ESLint config add-on.
 *
 * @fileoverview Provides extra config for TypeScript projects. The rules
 * included need TypeScript type info to work (e.g. you have a
 * `tsconfig.json` in your project root). This config is and add-on which
 * should extend the base config preset.
 * @see https://eslint.org/docs/user-guide/configuring
 * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
 * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser
 */

/* eslint-disable sort-keys */

'use strict';

const WARNING = 1;
const ERROR = 2;

/** @type {import('./types').ESLintConfig} */
module.exports = {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: process.cwd(),
  },
  rules: {
    /* eslint-enable sort-keys */
    '@typescript-eslint/no-for-in-array': ERROR,
    '@typescript-eslint/no-unnecessary-qualifier': ERROR,
    '@typescript-eslint/no-unnecessary-type-assertion': WARNING,
    // '@typescript-eslint/prefer-regexp-exec': WARNING, // currently broken
    '@typescript-eslint/require-array-sort-compare': WARNING,
    '@typescript-eslint/restrict-plus-operands': WARNING,
  },
};
