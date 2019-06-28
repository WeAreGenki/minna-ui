/**
 * Minna UI Svelte & Sapper ESLint config add-on.
 *
 * @file Provides extra config for Svelte & Sapper projects. This config is
 * an add-on which should extend the base config preset.
 * @see https://eslint.org/docs/user-guide/configuring
 */

/* eslint-disable sort-keys */

'use strict';

const OFF = 0;
const ERROR = 2;

/** @type {import('./types').ESLintConfig} */
module.exports = {
  plugins: ['svelte3'],
  settings: {
    /**
     * @param {import('./types').BlockAttributes} attr - Tag attributes.
     * @returns {boolean} If style block should be ignored.
     */
    'svelte3/ignore-styles': (attr) => attr.type === 'text/postcss',
  },
  overrides: [
    // Svelte components
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
      },
      env: {
        es6: true,
        browser: true,
      },
      rules: {
        '@typescript-eslint/indent': [
          ERROR,
          2,
          {
            ignoredNodes: [
              'ConditionalExpression *', // Prettier :'(
              'Identifier', // Svelte template expressions
            ],
            SwitchCase: 1,
          },
        ],
        // import order cannot be determined correctly in .svelte components
        'import/first': OFF,
        // components are compiled at build-time so devDependencies are OK
        'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
        // Svelte abuses syntax with `export let`
        'import/no-mutable-exports': OFF,
      },
    },
  ],
};
