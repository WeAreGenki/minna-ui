'use strict'; // eslint-disable-line

/* prettier-ignore */
// @ts-ignore
// eslint-disable-next-line
function exportStar(m) { for (const p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p]; }

Object.defineProperty(exports, '__esModule', { value: true });
exportStar(require('@minna-ui/preprocess'));
