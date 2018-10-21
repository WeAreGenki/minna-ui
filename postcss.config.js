// https://github.com/michael-ciniawsky/postcss-load-config

'use strict';

const minnaUi = require('@minna-ui/postcss-config');

module.exports = {
  parser: 'postcss-scss', // FIXME: `//` comments are not being converted to block
  map: true,
  plugins: [
    minnaUi({ debug: true }),
  ],
};
