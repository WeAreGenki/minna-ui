// https://github.com/michael-ciniawsky/postcss-load-config

/* tslint:disable object-literal-sort-keys */

'use strict';

module.exports = {
  syntax: 'postcss-scss',
  map: true,
  plugins: {
    '@minna-ui/postcss-config': { debug: true },
  },
};
