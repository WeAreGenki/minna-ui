/** @jest-environment node */

'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const del = require('del');
const { runBin } = require('@minna-ui/jest-config/lib/helpers.js'); // eslint-disable-line import/no-extraneous-dependencies
const buildComponent = require('../index.js');

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);
const cliPath = require.resolve('../cli.js');
const sourcePath = require.resolve('@minna-ui/jest-config/fixtures/TestComponent.html');
const sourcePathBadSyntax = require.resolve('@minna-ui/jest-config/fixtures/TestComponentBadSyntax.html');
const dist = path.join(__dirname, 'dist');

/**
 * Generate mock package.json env variables.
 * @param {string} dirName
 */
const pkg = dirName => ({
  npm_package_name: 'test-component',
  npm_package_version: '1.2.3',
  npm_package_homepage: 'https://ui.wearegenki.com',
  npm_package_svelte: sourcePath,
  npm_package_module: path.join(dist, dirName, 'index.es.mjs'),
  npm_package_main: path.join(dist, dirName, 'index.js'),
  npm_package_style: path.join(dist, dirName, 'index.css'),
});

beforeAll(() => mkdir(dist));

afterAll(() => del([dist]));

describe('build-component tool', () => {
  it('compiles package esm bundle', async () => {
    expect.assertions(6);
    const build = buildComponent(pkg('esm'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.esm.result.code).toMatch('export default TestComponent');
    expect(built.esm.result.code).not.toMatch('TestComponent=function');
    expect(built.esm.result.code).toMatch('name: \'Elon Musk\'');
    expect(built.esm.result.code).toMatch('component.refs.__target ===');
    expect(built.esm.result.map.sources).toHaveLength(2);
  });

  it('compiles package main bundle', async () => {
    expect.assertions(6);
    const build = buildComponent(pkg('main'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.main.result.code).toMatch('var TestComponent=function(');
    expect(built.main.result.code).not.toMatch('export default TestComponent');
    expect(built.main.result.code).toMatch('name:\'Elon Musk\'');
    expect(built.main.result.code).toMatch('.refs.__target===');
    expect(built.main.result.map.names).toContain('__name');
  });

  it('compiles package css bundle', async () => {
    expect.assertions(3);
    const build = buildComponent(pkg('css'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.css.code).not.toEqual('');
    expect(built.css.code).toMatchSnapshot();
  });

  // FIXME: Add banners in manually using https://github.com/Rich-Harris/magic-string
  it('contains banner comments', async () => {
    // expect.assertions(4);
    expect.assertions(2);
    const pkgData = pkg('banner');
    const build = buildComponent(pkgData);
    await expect(build).resolves.toBeDefined();
    const built = await build;
    const re = new RegExp(`\\/\\*!\\n \\* ${pkgData.npm_package_name} v\\d\\.\\d\\.\\d`);
    expect(built.esm.result.code).toMatch(re);
    // FIXME: rollup-plugin-butternut removes the banner
    // expect(built.main.result.code).toMatch(re);
    // FIXME: rollup-plugin-svelte doesn't have CSS banner support
    // expect(built.css.code).toMatch(re);
  });

  it('cleans existing dist dir', async () => {
    expect.assertions(2);
    await mkdir(path.join(dist, 'check'));
    const checkFile = path.join(dist, 'check/exists.txt');
    await writeFile(checkFile, 'yes', 'utf8');
    await expect(stat(checkFile)).resolves.toBeDefined();
    await buildComponent(pkg('check'));
    await expect(stat(checkFile)).rejects.toThrow();
  });

  it('writes data to disk', async () => {
    expect.assertions(7);
    const pkgData = pkg('write-to-disk');
    const build = buildComponent(pkgData);
    await expect(build).resolves.toBeDefined();
    await expect(stat(pkgData.npm_package_module)).resolves.toBeDefined();
    await expect(stat(`${pkgData.npm_package_module}.map`)).resolves.toBeDefined();
    await expect(stat(pkgData.npm_package_main)).resolves.toBeDefined();
    await expect(stat(`${pkgData.npm_package_main}.map`)).resolves.toBeDefined();
    await expect(stat(pkgData.npm_package_style)).resolves.toBeDefined();
    await expect(stat(`${pkgData.npm_package_style}.map`)).resolves.toBeDefined();
  });

  it('throws an error when bad HTML syntax', async () => {
    expect.assertions(1);
    const build = buildComponent({
      ...pkg('bad-syntax'),
      npm_package_svelte: sourcePathBadSyntax,
    });
    await expect(build).rejects.toThrowErrorMatchingSnapshot();
  });
});

describe('build-component CLI', () => {
  it('runs without error', async () => {
    expect.assertions(1);
    const result = runBin(cliPath, [], pkg('cli'));
    await expect(result).resolves.toBeDefined();
  });

  // TODO: Test is slow; improve performance
  it('errors when bad HTML syntax', async () => {
    expect.assertions(1);
    const result = runBin(cliPath, [], {
      ...pkg('cli-bad-syntax'),
      npm_package_svelte: sourcePathBadSyntax,
    });
    await expect(result).rejects.toContainEqual(expect.stringMatching('ERR_INVALID_ARG_TYPE'));
  });
});
