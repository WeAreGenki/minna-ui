// https://prettier.io/docs/en/options.html

/* eslint-disable jsdoc/valid-types, sort-keys */

'use strict';

const merge = require('deepmerge');

/**
 * Minna UI prettier config preset.
 * @param {import('prettier').Options=} opts Custom user defined prettier
 * options to merge with Minna UI preset.
 * @returns {import('prettier').Options}
 */
module.exports = (opts = {}) =>
  merge(
    {
      arrowParens: 'always',
      endOfLine: 'lf',
      singleQuote: true,
      trailingComma: 'all',
      overrides: [
        {
          files: ['*.html', '*.svelte'],
          options: {
            // TODO: Good for svelte but horrible for everything else, can it
            // be conditional depending on the file?
            // htmlWhitespaceSensitivity: 'ignore',
            requirePragma: true,
          },
        },
        {
          files: [
            '*.test.ts',
            '*.test.tsx',
            '*.test.js',
            '*.test.jsx',
            '*.spec.ts',
            '*.spec.js',
          ],
          options: {
            printWidth: 100,
          },
        },
      ],
    },
    opts,
  );
