// https://prettier.io/docs/en/options.html

'use strict';

const merge = require('deepmerge');

/**
 * Minna UI prettier config preset.
 * @param {?object} opts Custom prettier options to merge with Minna UI preset.
 */
module.exports = (opts = {}) =>
  merge(
    {
      endOfLine: 'lf',
      singleQuote: true,
      trailingComma: 'all',

      overrides: [
        {
          files: '*.html',
          options: {
            htmlWhitespaceSensitivity: 'ignore',
            requirePragma: true,
          },
        },
        {
          files: ['*.test.js', '*.test.jsx', '*.test.ts', '*.test.tsx'],
          options: {
            printWidth: 100,
          },
        },
      ],
    },
    opts,
  );
