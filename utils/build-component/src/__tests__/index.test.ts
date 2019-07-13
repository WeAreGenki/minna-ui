/** @jest-environment node */

/* eslint-disable security/detect-non-literal-fs-filename, security/detect-non-literal-regexp, @typescript-eslint/no-non-null-assertion, @typescript-eslint/camelcase */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import del from 'del';
import { run as buildComponent } from '../index';

const stat = promisify(fs.stat);
const sourcePath = require.resolve('@minna-ui/jest-config/fixtures/TestComponent.svelte');
const sourcePathBadSyntax = require.resolve(
  '@minna-ui/jest-config/fixtures/TestComponentBadSyntax.svelte',
);
const dist = path.join(__dirname, 'dist');

/**
 * Generate mock package.json env variables.
 *
 * @param dirName - Directory name.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pkg = (dirName: string) => ({
  npm_package_browser: path.join(dist, dirName, 'index.web.js'),
  npm_package_homepage: 'https://ui.wearegenki.com/',
  npm_package_main: path.join(dist, dirName, 'index.js'),
  npm_package_module: path.join(dist, dirName, 'index.mjs'),
  npm_package_name: 'test-component',
  npm_package_style: path.join(dist, dirName, 'index.css'),
  npm_package_svelte: sourcePath,
  npm_package_version: '1.2.3',
});

jest.setTimeout(10e3);

afterEach(() => del([dist]));

describe('build-component tool', () => {
  it('compiles package esm bundle', async () => {
    expect.assertions(5);
    const build = buildComponent(pkg('esm'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.esm.result.output[0].code).toMatch('export default TestComponent');
    expect(built.esm.result.output[0].code).not.toMatch('TestComponent=function');
    expect(built.esm.result.output[0].code).toMatch("name = 'Elon Musk'");
    expect(built.esm.result.output[0].map!.sources).toHaveLength(1); // Component only, svlete should not be imported
  });

  it('compiles package cjs bundle', async () => {
    expect.assertions(4);
    const build = buildComponent(pkg('cjs'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.cjs.result.output[0].code).toMatch('var TestComponent=(function(');
    expect(built.cjs.result.output[0].code).not.toMatch('export default TestComponent');
    expect(built.cjs.result.output[0].code).toMatch('="Elon Musk"');
  });

  it('compiles package css bundle', async () => {
    expect.assertions(4);
    const build = buildComponent(pkg('css'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.css.code).not.toBe(false);
    expect(built.css.code).not.toBe('');
    expect(built.css.code).toMatchSnapshot();
  });

  it('injects banner comments', async () => {
    expect.assertions(4);
    const pkgData = pkg('banner');
    const build = buildComponent(pkgData);
    await expect(build).resolves.toBeDefined();
    const built = await build;
    const re = new RegExp(`\\/\\*!\\n \\* ${pkgData.npm_package_name} v\\d\\.\\d\\.\\d`);
    expect(built.esm.result.output[0].code).toMatch(re);
    expect(built.css.code).toMatch(re);
    expect(built.cjs.result.output[0].code).toMatch(re);
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

  it('reports error on bad HTML syntax', async () => {
    expect.assertions(2);
    const build = buildComponent({
      ...pkg('bad-syntax'),
      npm_package_svelte: sourcePathBadSyntax,
    });
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});
    await expect(build).rejects.toThrowErrorMatchingSnapshot();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
