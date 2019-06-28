/**
 * Minna UI typed ESLint config add-on.
 *
 * @file Provides extra config for TypeScript projects. The rules included need
 * TypeScript type info to work (e.g. you have a `tsconfig.json` in your
 * project root). This config is an add-on which should extend the base config
 * preset.
 * @see https://eslint.org/docs/user-guide/configuring
 * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
 * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser
 */

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
    // FIXME: Broken parserOptions.project
    // '@typescript-eslint/no-floating-promises': ERROR,
    '@typescript-eslint/no-for-in-array': ERROR,
    '@typescript-eslint/no-unnecessary-qualifier': ERROR,
    '@typescript-eslint/no-unnecessary-type-assertion': WARNING,
    // FIXME: Uncomment after next release
    // '@typescript-eslint/prefer-readonly': ERROR,
    // FIXME: Broken parserOptions.project
    // '@typescript-eslint/prefer-regexp-exec': WARNING,
    '@typescript-eslint/require-array-sort-compare': WARNING,
    '@typescript-eslint/restrict-plus-operands': WARNING,
  },
};
