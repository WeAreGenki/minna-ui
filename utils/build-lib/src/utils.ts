/* eslint-disable security/detect-object-injection */

import { statSync } from 'fs';
import { join } from 'path';

const files = [
  'index.mjs',
  'index.js',
  'index.ts',
  'index.jsx',
  'index.tsx',
  'src/index.mjs',
  'src/index.js',
  'src/index.ts',
  'src/index.jsx',
  'src/index.tsx',
];

/**
 * @param cwd - Full path to current working directory.
 * @returns Path to the matching entry file.
 */
export function resolveEntryFile(cwd: string): string {
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
      "Couldn't find an entry file. Add entry src path to the `build-lib` cli.",
    );
  }

  return result;
}
