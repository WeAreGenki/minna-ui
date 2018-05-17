// https://prettier.io/docs/en/options.html

'use strict';

module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'es5',
  overrides: [
    {
      files: '*.css',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'never',
      },
    },
  ],
};
