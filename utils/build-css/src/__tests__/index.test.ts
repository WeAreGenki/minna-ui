/** @jest-environment node */

/* eslint-disable security/detect-non-literal-fs-filename, @typescript-eslint/camelcase, @typescript-eslint/no-non-null-assertion */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import del from 'del';
import { run as buildCss } from '..';

const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const srcPathSimple = require.resolve('@minna-ui/jest-config/fixtures/simple.css');
const srcPathImport = require.resolve('@minna-ui/jest-config/fixtures/import.css');
const srcPathBadSyntax = require.resolve('@minna-ui/jest-config/fixtures/styles-bad-syntax.css');
const dist = path.join(__dirname, 'dist');

/**
 * Generate mock package.json env variables.
 *
 * @param outDir - Where to write the files to.
 * @param srcPath - Where to read the files from.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pkg = (outDir: string, srcPath: string = srcPathSimple) => ({
  npm_package_browser: path.join(dist, outDir, 'index.css'),
  npm_package_homepage: 'https://ui.wearegenki.com',
  npm_package_main: srcPath,
  npm_package_name: 'test-css',
  npm_package_style: path.join(dist, outDir, 'index.css'),
  npm_package_version: '1.2.3',
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = (): void => {};

beforeAll(async () => {
  await del([dist]); // In case of failed test runs
  await mkdir(dist);
});

afterEach(() => del([dist]));

describe('build-css tool', () => {
  it('compiles package CSS bundle', async () => {
    expect.assertions(5);
    const build = buildCss(pkg('css'));
    const spy = jest.spyOn(console, 'warn');
    await expect(build).resolves.toBeDefined();
    const output = await build;
    expect(output).toHaveLength(1); // One output file
    expect(output[0].code).toBeDefined();
    expect(output[0].code).toMatchSnapshot();
    expect(spy).not.toHaveBeenCalled();
  });

  it('compiles package CSS bundle with imports', async () => {
    expect.assertions(5);
    const build = buildCss(pkg('imports', srcPathImport));
    const spy = jest.spyOn(console, 'warn');
    await expect(build).resolves.toBeDefined();
    const output = await build;
    expect(output).toHaveLength(1); // One output file
    expect(output[0].code).toBeDefined();
    expect(output[0].code).toMatchSnapshot();
    expect(spy).not.toHaveBeenCalled();
  });

  it('generates a source map', async () => {
    expect.assertions(2);
    const build = buildCss(pkg('css'));
    const output = (await build)[0];
    expect(output.code).toMatch('\n/*# sourceMappingURL=index.css.map */');
    expect(output.map!.toString()).toMatchSnapshot();
  });

  it('injects banner comment', async () => {
    expect.assertions(1);
    const pkgData = pkg('banner');
    const build = buildCss(pkgData);
    const output = (await build)[0];
    // eslint-disable-next-line security/detect-non-literal-regexp
    const re = new RegExp(`\\/\\*!\\n \\* ${pkgData.npm_package_name} v\\d\\.\\d\\.\\d`);
    expect(output.code).toMatch(re);
  });

  it('writes data to disk', async () => {
    expect.assertions(4);
    const pkgData = pkg('write-to-disk');
    const build = buildCss(pkgData);
    await expect(build).resolves.toBeDefined();
    await expect(stat(pkgData.npm_package_browser)).resolves.toBeDefined();
    await expect(stat(pkgData.npm_package_style)).resolves.toBeDefined();
    await expect(stat(`${pkgData.npm_package_style}.map`)).resolves.toBeDefined();
  });

  it('reports error on bad CSS syntax', async () => {
    expect.assertions(2);
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(noop);
    const build = buildCss(pkg('bad-syntax', srcPathBadSyntax));
    await expect(build).rejects.toThrow();
    expect(spy).toHaveBeenCalledWith(
      expect.stringContaining('jest-config/fixtures/styles-bad-syntax.css:21:1: Unclosed block:'),
    );
    spy.mockRestore();
  });
});
