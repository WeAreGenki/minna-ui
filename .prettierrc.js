// https://prettier.io/docs/en/options.html

'use strict';

module.exports = require('@minna-ui/prettier-config')({
  overrides: [
    {
      files: '*.css',
      options: {
        requirePragma: true,
      },
    },
  ],
});
