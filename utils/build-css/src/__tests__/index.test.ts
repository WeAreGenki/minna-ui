/** @jest-environment node */

/* eslint-disable security/detect-non-literal-fs-filename */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import del from 'del';
import buildCss from '../index';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const srcPathSimple = require.resolve('@minna-ui/jest-config/__fixtures__/simple.css');
const srcPathImport = require.resolve('@minna-ui/jest-config/__fixtures__/import.css');
const srcPathBadSyntax = require.resolve(
  '@minna-ui/jest-config/__fixtures__/styles-bad-syntax.css',
);
const dist = path.join(__dirname, 'dist');

/**
 * Generate mock package.json env variables.
 * @param outDir Where to write the files to.
 * @param srcPath Where to read the files from.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pkg = (outDir: string, srcPath: string = srcPathSimple) => ({
  /* eslint-disable @typescript-eslint/camelcase */
  npm_package_browser: path.join(dist, outDir, 'index.css'),
  npm_package_homepage: 'https://ui.wearegenki.com',
  npm_package_main: srcPath,
  npm_package_name: 'test-css',
  npm_package_style: path.join(dist, outDir, 'index.css'),
  npm_package_version: '1.2.3',
  /* eslint-enable */
});

beforeAll(() => mkdir(dist));

afterAll(() => del([dist]));

describe('build-css tool', () => {
  it('compiles package CSS bundle', async () => {
    expect.assertions(10);
    const build = buildCss(pkg('css'));
    await expect(build).resolves.toBeDefined();
    const built = (await build)[0];
    expect(built.result.css).not.toEqual('');
    expect(built.result.warnings()).toHaveLength(0);
    expect(built.result.css).toMatchSnapshot();
    expect(built.min.styles).not.toEqual('');
    expect(built.min.errors).toHaveLength(0);
    expect(built.min.warnings).toHaveLength(1);
    expect(built.min.warnings[0]).toMatch(/^Ignoring local source map/);
    expect(built.min.styles).toMatch('\n/*# sourceMappingURL=index.css.map */');
    expect(built.min.styles).toMatchSnapshot();
  });

  it('compiles package CSS bundle with imports', async () => {
    expect.assertions(10);
    const build = buildCss(pkg('imports', srcPathImport));
    await expect(build).resolves.toBeDefined();
    const built = (await build)[0];
    expect(built.result.css).not.toEqual('');
    expect(built.result.warnings()).toHaveLength(0);
    expect(built.result.css).toMatchSnapshot();
    expect(built.min.styles).not.toEqual('');
    expect(built.min.errors).toHaveLength(0);
    expect(built.min.warnings).toHaveLength(1);
    expect(built.min.warnings[0]).toMatch(/^Ignoring local source map/);
    expect(built.min.styles).toMatch('\n/*# sourceMappingURL=index.css.map */');
    expect(built.min.styles).toMatchSnapshot();
  });

  it('contains banner comment', async () => {
    expect.assertions(2);
    const pkgData = pkg('banner');
    const build = buildCss(pkgData);
    await expect(build).resolves.toBeDefined();
    const built = (await build)[0];
    // eslint-disable-next-line security/detect-non-literal-regexp
    const re = new RegExp(`\\/\\*!\\n \\* ${pkgData.npm_package_name} v\\d\\.\\d\\.\\d`);
    expect(built.min.styles).toMatch(re);
  });

  it('cleans existing dist dir', async () => {
    expect.assertions(2);
    await mkdir(path.join(dist, 'check'));
    const checkFile = path.join(dist, 'check/exists.txt');
    await writeFile(checkFile, 'yes', 'utf8');
    await expect(stat(checkFile)).resolves.toBeDefined();
    await buildCss(pkg('check'));
    await expect(stat(checkFile)).rejects.toThrow();
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

  it('throws error when bad CSS syntax', async () => {
    expect.assertions(2);
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    const build = buildCss(pkg('bad-syntax', srcPathBadSyntax));
    await expect(build).rejects.toThrow();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
