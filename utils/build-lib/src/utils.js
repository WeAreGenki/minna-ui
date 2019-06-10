/* eslint-disable security/detect-object-injection */

'use strict';

const { statSync } = require('fs');
const { join } = require('path');

/**
 * @param {string} cwd - Current working directory.
 * @returns {string} Path to the matching entry file.
 */
function resolveEntryFile(cwd) {
  const files = [
    'index.js',
    'index.ts',
    'index.jsx',
    'index.tsx',
    'src/index.js',
    'src/index.ts',
    'src/index.jsx',
    'src/index.tsx',
  ];
  let result = '';
  let index = 0;

  while (!result && index < files.length) {
    index += 1;

    const file = join(cwd, files[index]);

    try {
      if (statSync(file)) result = file;
    } catch (err) {}
  }

  if (!result) {
    throw new Error(
      "Couldn't find any entry file. Add entry src path to the `build-lib` cli.",
    );
  }

  return result;
}

exports.resolveEntryFile = resolveEntryFile;
