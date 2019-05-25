'use strict'; // eslint-disable-line

/** @param {any} mod - Module exports. */
function exportStar(mod) {
  // @ts-ignore
  // eslint-disable-next-line
  for (const p in mod) if (!exports.hasOwnProperty(p)) exports[p] = mod[p];
}

Object.defineProperty(exports, '__esModule', { value: true });

exportStar(require('@minna-ui/preprocess'));
