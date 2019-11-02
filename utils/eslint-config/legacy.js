/**
 * Minna UI legacy JavaScript ESLint config add-on.
 *
 * @file This config is an add-on which should extend the base config preset.
 * Provides extra config for projects containing some files which are not
 * transpiled from modern JavaScript to older JavaScript with wide browser
 * engine coverage. Particularly useful for scripts in HTML files.
 *
 * @see https://eslint.org/docs/user-guide/configuring
 */

'use strict';

const OFF = 0;
const ERROR = 2;

/** @type {import('./types').ESLintConfig} */
module.exports = {
  extends: ['airbnb-base/legacy'],
  rules: {
    // Tweak rules for use in really old browser engines and turn off rules
    // which require TS type info
    '@typescript-eslint/no-for-in-array': OFF,
    '@typescript-eslint/no-unnecessary-qualifier': OFF,
    '@typescript-eslint/no-unnecessary-type-assertion': OFF,
    '@typescript-eslint/no-var-requires': OFF,
    '@typescript-eslint/require-array-sort-compare': OFF,
    '@typescript-eslint/restrict-plus-operands': OFF,
    'comma-dangle': [ERROR, 'never'],
    'eol-last': OFF,
    'func-names': OFF,
    'no-var': OFF,
    'object-shorthand': [ERROR, 'never'],
    'prefer-arrow-callback': OFF,
    'prefer-destructuring': OFF,
  },
};
