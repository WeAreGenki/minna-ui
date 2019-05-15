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

/**
 * There are known performance issues with `typescript-eslint` when using type
 * info. Performance is roughly 10x slower when using the
 * `parserOptions.project` option. The parser will create an AST for each file
 * file rather than once and reuse. Follow upstream Github issue for changes.
 * @see https://github.com/typescript-eslint/typescript-eslint/issues/243
 *
 * If you have a large project with many TS files, it's recommended _not_ to
 * use this config at this point in time.
 *
 * TODO: Remove this notice comment once no longer necessary.
 */

// FIXME: Need to wait until upstream issue is fixed before using this in VS
// Code + Prettier extension with `prettier-eslint` integration
//  ↳ https://github.com/prettier/prettier-eslint/issues/201

export = {
  parserOptions: {
    project: 'tsconfig.json',
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
