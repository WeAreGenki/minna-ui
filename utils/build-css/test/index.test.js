/** @jest-environment node */

'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const del = require('del');
const { runBin } = require('@minna-ui/jest-config/lib/helpers.js'); // eslint-disable-line import/no-extraneous-dependencies
const buildCss = require('../index.js');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const cliPath = require.resolve('../cli.js');
const sourcePath = require.resolve('@minna-ui/jest-config/fixtures/styles.css');
const sourcePathImport = require.resolve('@minna-ui/jest-config/fixtures/import.css');
const sourcePathBadSyntax = require.resolve('@minna-ui/jest-config/fixtures/styles-bad-syntax.css');
const dist = path.join(__dirname, 'dist');

/**
 * Generate mock package.json env variables.
 * @param {string} dirName
 */
const pkg = (dirName, source = sourcePath) => ({
  npm_package_name: 'test-css',
  npm_package_version: '1.2.3',
  npm_package_homepage: 'https://ui.wearegenki.com',
  npm_package_style: path.join(dist, dirName, 'index.css'),
  npm_package_browser: path.join(dist, dirName, 'index.css'),
  npm_package_main: source,
});

beforeAll(() => mkdir(dist));

afterAll(() => del([dist]));

describe('build-css tool', () => {
  it('compiles package CSS bundle', async () => {
    expect.assertions(10);
    const build = buildCss(pkg('css'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
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
    const build = buildCss(pkg('imports', sourcePathImport));
    await expect(build).resolves.toBeDefined();
    const built = await build;
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
    const built = await build;
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
    const spy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    const build = buildCss(pkg('bad-syntax', sourcePathBadSyntax));
    await expect(build).rejects.toThrowError();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });
});

describe('build-css CLI', () => {
  it('runs without error', async () => {
    expect.assertions(1);
    const result = runBin(cliPath, [], pkg('cli'));
    await expect(result).resolves.toBeDefined();
  });

  it('errors when bad CSS syntax', async () => {
    expect.assertions(2);
    const result = runBin(cliPath, [], pkg('cli-bad-syntax', sourcePathBadSyntax));
    await expect(result).rejects.toMatch('Unclosed block');
    await expect(result).rejects.toMatch('CssSyntaxError');
  });
});
