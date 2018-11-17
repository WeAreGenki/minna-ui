// https://prettier.io/docs/en/options.html

'use strict';

module.exports = {
  endOfLine: 'lf',
  singleQuote: true,
  trailingComma: 'all',

  overrides: [
    {
      files: '*.md',
      options: {
        proseWrap: 'never',
      },
    },
    {
      files: ['*.css', '*.html'],
      options: {
        insertPragma: true,
        requirePragma: true,
      },
    },
  ],
};
