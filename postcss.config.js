// https://github.com/michael-ciniawsky/postcss-load-config

'use strict';

module.exports = {
  parser: 'postcss-scss', // FIXME: `//` comments are not being converted to block
  map: true,
  plugins: {
    '@minna-ui/postcss-config': { debug: true },
  },
};
