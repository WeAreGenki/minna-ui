import { readFileSync } from 'fs';
import { join } from 'path';

function read(filename: string): string {
  return readFileSync(join(__dirname, filename), 'utf-8');
}

export const empty = ['empty.js', read('empty.js')];

export const valid = [
  ['valid.css', read('valid.css')],
  ['valid.d.ts', read('valid.d.ts')],
  ['valid.html', read('valid.html')],
  ['valid.js', read('valid.js')],
  ['valid.jsx', read('valid.jsx')],
  ['valid.md', read('valid.md')],
  ['valid.mjs', read('valid.mjs')],
  ['valid.svelte', read('valid.svelte')],
  ['valid.svg', read('valid.svg')],
  ['valid.test.ts', read('valid.test.ts')],
  ['valid.ts', read('valid.ts')],
  ['valid.tsx', read('valid.tsx')],
  ['valid.xhtml', read('valid.xhtml')],
];

export const bad = [
  ['bad.d.ts', read('bad.d.ts')],
  ['bad.html', read('bad.html')],
  ['bad.js', read('bad.js')],
  ['bad.jsx', read('bad.jsx')],
  ['bad.md', read('bad.md')],
  ['bad.mjs', read('bad.mjs')],
  ['bad.svelte', read('bad.svelte')],
  ['bad.svg', read('bad.svg')],
  ['bad.test.ts', read('bad.test.ts')],
  ['bad.ts', read('bad.ts')],
  ['bad.tsx', read('bad.tsx')],
  ['bad.xhtml', read('bad.xhtml')],
];
