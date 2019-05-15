/**
 * Minna UI Svelte & Sapper ESLint config add-on.
 * @fileoverview Provides extra config for Svelte & Sapper projects. This
 * config is and add-on which should extend the base config preset.
 * @see https://eslint.org/docs/user-guide/configuring
 */

/* eslint-disable sort-keys */

interface BlockAttributes {
  type: string;
}

export = {
  plugins: ['svelte3'],
  settings: {
    'svelte3/ignore-styles': (attr: BlockAttributes) =>
      attr.type === 'text/postcss',
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
