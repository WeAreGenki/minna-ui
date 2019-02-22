// https://prettier.io/docs/en/options.html

/* eslint-disable jsdoc/valid-types */

'use strict';

const merge = require('deepmerge');

/**
 * Minna UI prettier config preset.
 * @param {import('prettier').Options=} opts Custom user defined prettier
 * options to merge with the preset defaults.
 * @returns {import('prettier').Options} Prettier options.
 */
module.exports = (opts = {}) =>
  merge(
    {
      arrowParens: 'always',
      endOfLine: 'lf',
      singleQuote: true,
      trailingComma: 'all',

      // eslint-disable-next-line sort-keys
      overrides: [
        {
          files: '*.svelte',
          options: {
            htmlWhitespaceSensitivity: 'ignore',
            requirePragma: true,
          },
        },
        {
          files: '*.html',
          options: {
            requirePragma: true,
          },
        },
        {
          files: [
            '*.spec.js',
            '*.spec.ts',
            '*.test.js',
            '*.test.jsx',
            '*.test.ts',
            '*.test.tsx',
          ],
          options: {
            printWidth: 100,
          },
        },
      ],
    },
    opts,
  );
