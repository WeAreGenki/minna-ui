/**
 * Minna UI typed ESLint config add-on.
 *
 * @file This config is an add-on which should extend the base config preset.
 * Provides extra config for TypeScript projects. The rules included need type
 * info to work (you'll need a `tsconfig.json` in your project root).
 *
 * @see https://eslint.org/docs/user-guide/configuring
 * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
 * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser
 */

'use strict';

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

/** @type {import('./types').ESLintConfig} */
module.exports = {
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: process.cwd(),
  },
  rules: {
    '@typescript-eslint/no-floating-promises': ERROR,
    '@typescript-eslint/no-for-in-array': ERROR,
    '@typescript-eslint/no-misused-promises': ERROR,
    '@typescript-eslint/no-unnecessary-qualifier': ERROR,
    '@typescript-eslint/no-unnecessary-type-assertion': WARNING,
    '@typescript-eslint/prefer-readonly': ERROR,
    '@typescript-eslint/prefer-regexp-exec': WARNING,
    '@typescript-eslint/require-array-sort-compare': WARNING,
    '@typescript-eslint/require-await': ERROR,
    '@typescript-eslint/restrict-plus-operands': WARNING,
    '@typescript-eslint/unbound-method': [ERROR, { ignoreStatic: true }],
    'require-await': OFF, // Handled by `@typescript-eslint/require-await`
  },
};
