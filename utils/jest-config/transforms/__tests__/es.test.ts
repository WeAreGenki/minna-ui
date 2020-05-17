/** @jest-environment node */

import fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { process } from '../es.js';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);
// const sourceJsPath = join(__dirname, '../../fixtures/????');
// const sourceJsxPath = join(__dirname, '../../fixtures/????');
// const sourceTsPath = join(__dirname, '../../fixtures/????');
// const sourceTsxPath = join(__dirname, '../../fixtures/????');
// const sourceMjsPath = join(__dirname, '../../fixtures/????');
const sourceCssPath = join(__dirname, '../../fixtures/styles.css');

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
    expect.assertions(1);
    // @ts-expect-error
    const { code } = process(sourceCss, sourceCssPath);
    expect(code).toStrictEqual(sourceCss);
  });
});
