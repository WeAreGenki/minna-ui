/**
 * Minna UI Svelte & Sapper ESLint config add-on.
 *
 * @file This config is an add-on which should extend the base config preset.
 * Provides extra config for Svelte & Sapper projects.
 *
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
     * @param {import('./types').BlockAttributes} attr - Style tag attributes.
     * @returns {boolean} If style block should be ignored.
     */
    'svelte3/ignore-styles': (attr) => attr.type === 'text/postcss',
    'svelte3/named-blocks': true,
  },
  overrides: [
    // Svelte components
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
    },

    // Svelte component all blocks
    {
      files: ['**/*.svelte/*.js'],
      parserOptions: {
        ecmaVersion: 2019,
        sourceType: 'module',
      },
      env: {
        es6: true,
        browser: true,
      },
      rules: {
        // FIXME: Remove this line once issue is fixed: https://github.com/sveltejs/eslint-plugin-svelte3/issues/36
        'import/no-unresolved': OFF,

        // Import order cannot be determined correctly in .svelte components
        'import/first': OFF,
        // Components are compiled at build-time so devDependencies are OK
        'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
        // Svelte abuses syntax with `export let`
        'import/no-mutable-exports': OFF,
      },
    },

    // Svelte component template blocks
    {
      files: ['**/*.svelte/*_template.js'],
      rules: {
        '@typescript-eslint/indent': OFF,
      },
    },
  ],
};
