// https://github.com/michael-ciniawsky/postcss-load-config

'use strict';

module.exports = {
  map: true,
  plugins: {
    // the `unsafe` option is fine when compiling components separately, it
    // only becomes potentially dangerous when compiling a whole app
    '@minna-ui/postcss-config': { unsafe: true },
  },
  syntax: 'postcss-scss',
};
