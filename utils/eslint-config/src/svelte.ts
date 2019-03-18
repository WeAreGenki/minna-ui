/**
 * Minna UI Svelte & Sapper ESLint config add-on.
 * @fileoverview Provides extra config for Svelte & Sapper projects. This
 * config is and add-on which should extend the base config preset.
 * @see https://eslint.org/docs/user-guide/configuring
 */

/* eslint-disable sort-keys */

interface IBlockAttributes {
  type: string;
  [x: string]: string;
}

export = {
  plugins: ['import', 'svelte3'],
  settings: {
    'svelte3/ignore-styles': (attr: IBlockAttributes) =>
      attr.type === 'text/postcss',
  },
  overrides: [
    // Svelte components
    {
      files: ['*.svelte'],
      rules: {
        'import/first': 'off', // not fixable
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'import/no-mutable-exports': 'off',
        'no-labels': 'off',

        // NOTE: Based on airbnb-base rule but with `LabeledStatement` removed
        // Keep up to date with changes to the upstream source:
        // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js#L332
        'no-restricted-syntax': [
          'error',
          {
            selector: 'ForInStatement',
            message:
              'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
          },
          {
            selector: 'ForOfStatement',
            message:
              'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
          },
          {
            selector: 'WithStatement',
            message:
              '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
          },
        ],
      },
    },
  ],
};
