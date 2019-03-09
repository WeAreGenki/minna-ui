// https://prettier.io/docs/en/options.html

import merge from 'deepmerge';
import prettier from 'prettier';

/**
 * Minna UI prettier config preset.
 * @param opts User defined prettier options to merge with the preset defaults.
 */
export = (opts: prettier.Options = {}): prettier.Options =>
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
