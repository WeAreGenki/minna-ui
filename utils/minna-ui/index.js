'use strict'; // eslint-disable-line

function exportStar(mod) {
  // eslint-disable-next-line
  for (var p in mod) if (!exports.hasOwnProperty(p)) exports[p] = mod[p];
}

Object.defineProperty(exports, '__esModule', { value: true });

exportStar(require('@minna-ui/preprocess'));
