/** @jest-environment node */

/* eslint-disable security/detect-non-literal-fs-filename, security/detect-non-literal-regexp */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import del from 'del';
import buildComponent from '../index';

const mkdir = promisify(fs.mkdir);
const stat = promisify(fs.stat);
const sourcePath = require.resolve('@minna-ui/jest-config/__fixtures__/TestComponent.svelte');
const sourcePathBadSyntax = require.resolve(
  '@minna-ui/jest-config/__fixtures__/TestComponentBadSyntax.svelte',
);
const dist = path.join(__dirname, 'dist');

/**
 * Generate mock package.json env variables.
 * @param dirName Directory name.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const pkg = (dirName: string) => ({
  /* eslint-disable @typescript-eslint/camelcase */
  npm_package_homepage: 'https://ui.wearegenki.com/',
  npm_package_main: path.join(dist, dirName, 'index.js'),
  npm_package_module: path.join(dist, dirName, 'index.mjs'),
  npm_package_name: 'test-component',
  npm_package_style: path.join(dist, dirName, 'index.css'),
  npm_package_svelte: sourcePath,
  npm_package_version: '1.2.3',
  /* eslint-enable @typescript-eslint/camelcase */
});

beforeAll(() => mkdir(dist));

afterAll(() => del([dist]));

describe('build-component tool', () => {
  it('compiles package esm bundle', async () => {
    expect.assertions(6);
    const build = buildComponent(pkg('esm'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.esm.result.output[0].code).toMatch('export default TestComponent');
    expect(built.esm.result.output[0].code).not.toMatch('TestComponent=function');
    expect(built.esm.result.output[0].code).toMatch("name: 'Elon Musk'");
    expect(built.esm.result.output[0].code).toMatch('component.refs._target ===');
    expect(built.esm.result.output[0].map.sources).toHaveLength(2);
  }, 10000); // FIXME: Reduce execution time of this test

  it('compiles package main bundle', async () => {
    expect.assertions(4);
    const build = buildComponent(pkg('main'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.main.result.output[0].code).toMatch('var TestComponent=function(');
    expect(built.main.result.output[0].code).not.toMatch('export default TestComponent');
    expect(built.main.result.output[0].code).toMatch(':"Elon Musk"');
  });

  it('compiles package css bundle', async () => {
    expect.assertions(4);
    const build = buildComponent(pkg('css'));
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.css.code).not.toBeFalsy();
    expect(built.css.code).not.toBe('');
    expect(built.css.code).toMatchSnapshot();
  });

  it('contains banner comments', async () => {
    expect.assertions(3);
    const pkgData = pkg('banner');
    const build = buildComponent(pkgData);
    await expect(build).resolves.toBeDefined();
    const built = await build;
    const re1 = new RegExp(`\\/\\*!\\n \\* ${pkgData.npm_package_name} v\\d\\.\\d\\.\\d`);
    expect(built.esm.result.output[0].code).toMatch(re1);
    // expect(built.css.code).toMatch(re1);
    const re2 = new RegExp(`\\/\\*\\n ${pkgData.npm_package_name} v\\d\\.\\d\\.\\d`);
    expect(built.main.result.output[0].code).toMatch(re2);
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
      // eslint-disable-next-line @typescript-eslint/camelcase
      npm_package_svelte: sourcePathBadSyntax,
    });
    // FIXME: Error is different if jest is run in --ci mode and between node versions
    // await expect(build).rejects.toThrowErrorMatchingSnapshot();
    await expect(build).rejects.toThrow();
  });

  it.todo('end process with non-zero exit code on build error');
});
