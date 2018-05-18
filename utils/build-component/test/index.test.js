/** @jest-environment node */

'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const del = require('del');
const buildComponent = require('../index.js');

const writeFile = promisify(fs.writeFile);
const sourcePath = require.resolve('@minna-ui/jest-config/fixtures/TestComponent.html');
const sourcePathBadSyntax = require.resolve('@minna-ui/jest-config/fixtures/TestComponentBadSyntax.html');
const outputPathModule = path.join(__dirname, 'dist/index.es.mjs');
const outputPathMain = path.join(__dirname, 'dist/index.js');
const outputPathStyle = path.join(__dirname, 'dist/index.css');

const pkg = {
  npm_package_name: 'test-component',
  npm_package_version: '1.0.0',
  npm_package_homepage: 'https://example.com',
  npm_package_svelte: sourcePath,
  npm_package_module: outputPathModule,
  npm_package_main: outputPathMain,
  npm_package_style: outputPathStyle,
};

afterAll(() => del([path.join(__dirname, 'dist')]));

describe('build-component', () => {
  it('compiles a Svelte component package', async () => {
    const build = buildComponent(pkg);
    await expect(build).resolves.toBeDefined();
    const built = await build;
    expect(built.esm.stats.warnings).toHaveLength(2); // 2 a11y warnings
    expect(built.esm.stats.warnings.every(warn => warn.code.indexOf('a11y') === 0)).toEqual(true);
    expect(built.esm.js.code).toContain('export default TestComponent');
    expect(built.esm.js.code).not.toContain('return TestComponent');
    expect(built.esm.js.code).toContain('name: \'Elon Musk\'');
    expect(built.esm.js.code).toContain('component.refs.target ===');
    expect(built.main.js.code).toContain('return TestComponent');
    expect(built.main.js.code).not.toContain('export default TestComponent');
    expect(built.main.js.code).toContain('\n/*# sourceMappingURL=index.js.map */');
    expect(built.main.js.code).toContain('name: \'Elon Musk\'');
    expect(built.main.js.code).toContain('component.refs.target ===');
    expect(built.esm.css.code).toMatchSnapshot();
  });

  it('cleans existing dist dir when exists', async () => {
    const checkFile = path.join(__dirname, 'dist/check.txt');
    await writeFile(checkFile, 'exists');

    // file should exist (no error)
    fs.stat(checkFile, (err) => { expect(err).toEqual(null); });

    await buildComponent(pkg);

    // file should not exist (does error)
    fs.stat(checkFile, (err) => { expect(err).not.toEqual(null); });
  });

  it('compiles when output path is not "dist"', async () => {
    const altOutputPathModule = path.join(__dirname, 'dist/minna-ui/index.es.mjs');
    const altOutputPathMain = path.join(__dirname, 'dist/minna-ui/index.js');
    const altOutputPathStyle = path.join(__dirname, 'dist/minna-ui/index.css');
    const build = buildComponent({
      ...pkg,
      npm_package_module: altOutputPathModule,
      npm_package_main: altOutputPathMain,
      npm_package_style: altOutputPathStyle,
    });
    await expect(build).resolves.toBeDefined();
    fs.stat(altOutputPathModule, (err) => { expect(err).toEqual(null); });
    fs.stat(altOutputPathMain, (err) => { expect(err).toEqual(null); });
    fs.stat(altOutputPathStyle, (err) => { expect(err).toEqual(null); });
  });

  it('throws an error when bad component syntax', async () => {
    const build = buildComponent({
      ...pkg,
      npm_package_svelte: sourcePathBadSyntax,
    });
    await expect(build).rejects.toThrow();
  });
});
