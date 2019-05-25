/** @jest-environment node */

import fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { process } from '../es.js';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);
// const sourceJsPath = join(__dirname, '../__fixtures__/????');
// const sourceJsxPath = join(__dirname, '../__fixtures__/????');
// const sourceTsPath = join(__dirname, '../__fixtures__/????');
// const sourceTsxPath = join(__dirname, '../__fixtures__/????');
// const sourceMjsPath = join(__dirname, '../__fixtures__/????');
const sourceCssPath = join(__dirname, '../__fixtures__/styles.css');

// let sourceJs = '';
// let sourceJsx = '';
// let sourceTs = '';
// let sourceTsx = '';
// let sourceMjs = '';
let sourceCss = '';

beforeAll(async () => {
  // [sourceJs, sourceJsx, sourceTs, sourceTsx, sourceMjs, sourceCss] = await Promise.all([
  //   readFile(sourceJsPath, 'utf8'),
  //   readFile(sourceJsxPath, 'utf8'),
  //   readFile(sourceTsPath, 'utf8'),
  //   readFile(sourceTsxPath, 'utf8'),
  //   readFile(sourceMjsPath, 'utf8'),
  //   readFile(sourceCssPath, 'utf8'),
  // ]);
  sourceCss = await readFile(sourceCssPath, 'utf8');
});

describe('ES transform', () => {
  it.todo('processes .js files correctly');

  it.todo('processes .jsx files correctly');

  it.todo('processes .ts files correctly');

  it.todo('processes .tsx files correctly');

  it.todo('processes .mjs files correctly');

  it("doesn't modify .css files", () => {
    const code = process(sourceCss, sourceCssPath);
    expect(code).toEqual(sourceCss);
  });
});
