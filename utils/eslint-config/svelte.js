/**
 * Minna UI Svelte & Sapper ESLint config add-on.
 *
 * @fileoverview Provides extra config for Svelte & Sapper projects. This
 * config is and add-on which should extend the base config preset.
 * @see https://eslint.org/docs/user-guide/configuring
 */

/* eslint-disable sort-keys */

'use strict';

/** @type {import('./types').ESLintConfig} */
module.exports = {
  plugins: ['svelte3'],
  settings: {
    /**
     * @param {import('./types').BlockAttributes} attr - Tag attributes.
     * @returns {boolean} If style block should be ignored.
     */
    'svelte3/ignore-styles': (attr) => attr.type === 'text/postcss',
    // TODO: Uncomment once false positives are handled better
    // 'svelte3/lint-template': true,
  },
  overrides: [
    // Svelte components
    {
      files: ['*.svelte'],
      rules: {
        // import order cannot be determined correctly in .svelte components
        'import/first': 'off',
        // components are compiled at build-time so devDependencies are OK
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
        // Svelte abuses the syntax with `export let`
        'import/no-mutable-exports': 'off',
      },
    },
  ],
};
