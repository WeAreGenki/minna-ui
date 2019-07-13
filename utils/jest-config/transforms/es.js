// based on `@sucrase/jest-plugin` but without flow support and with mjs support
// @see https://github.com/alangpierce/sucrase/blob/master/integrations/jest-plugin/src/index.ts

'use strict';

const { transform } = require('sucrase');

/**
 * @param {string} filename - File name.
 * @returns {import('sucrase').Transform[] | null} List of transforms to use.
 */
function getTransforms(filename) {
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
    return ['jsx', 'imports'];
  }
  if (filename.endsWith('.ts')) {
    return ['typescript', 'imports'];
  }
  if (filename.endsWith('.tsx')) {
    return ['typescript', 'jsx', 'imports'];
  }
  if (filename.endsWith('.mjs')) {
    return ['imports'];
  }
  return null;
}

/** @typedef {import('jest')} jest */

/**
 * @param {string} src - File source code.
 * @param {string} filename - File name.
 * @returns {jest.TransformedSource} Transformed source code.
 */
exports.process = (src, filename) => {
  const transforms = getTransforms(filename);

  if (transforms !== null) {
    const result = transform(src, {
      filePath: filename,
      jsxFragmentPragma: 'Fragment', // Preact style JSX
      jsxPragma: 'h',
      production: true, // Don't add debug attributes to snapshots
      transforms,
    });

    return {
      code: result.code,
      map: result.sourceMap,
    };
  }

  return { code: src, map: '' };
};
