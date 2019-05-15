/**
 * Minna UI typed ESLint config add-on.
 * @fileoverview Provides extra config for TypeScript projects. The rules
 * included need TypeScript type info to work (e.g. you have a
 * `tsconfig.json` in your project root). This config is and add-on which
 * should extend the base config preset.
 * @see https://eslint.org/docs/user-guide/configuring
 * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
 * @see https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/parser
 */

/* eslint-disable sort-keys */

export = {
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: process.cwd(),
  },
  rules: {
    /* eslint-enable sort-keys */
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    // '@typescript-eslint/prefer-regexp-exec': 'warn', // currently broken
    '@typescript-eslint/require-array-sort-compare': 'warn',
    '@typescript-eslint/restrict-plus-operands': 'warn',
  },
};
