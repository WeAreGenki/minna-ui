// https://eslint.org/docs/user-guide/configuring

/* tslint:disable object-literal-sort-keys */

'use strict';

module.exports = {
  root: true,
  extends: ['@minna-ui/eslint-config'],
  plugins: ['eslint-plugin-svelte3'],
  settings: {
    'svelte3/extensions': ['.html', '.svelte', '.svg'],
  },
};
