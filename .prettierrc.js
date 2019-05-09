// https://prettier.io/docs/en/options.html

'use strict';

const config = require('@minna-ui/prettier-config');

module.exports = {
  ...config,
  overrides: [
    ...config.overrides,
    {
      files: '*.css',
      options: {
        requirePragma: true,
      },
    },
  ],
};
