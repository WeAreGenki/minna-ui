// https://github.com/michael-ciniawsky/postcss-load-config

'use strict';

/* eslint-disable-next-line import/no-extraneous-dependencies */
const minnaUi = require('@minna-ui/postcss-config');

const dev = process.env.NODE_ENV === 'development';

module.exports = {
  plugins: [
    minnaUi({ verbose: dev }),
  ],
};
