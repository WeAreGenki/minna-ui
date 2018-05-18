/** @jest-environment node */

'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const del = require('del');
const buildComponent = require('../index.js');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const sourcePath = require.resolve('@minna-ui/jest-config/fixtures/TestComponent.html');
const outputPathModule = path.join(__dirname, 'dist', 'index.es.mjs');
const outputPathMain = path.join(__dirname, 'dist', 'index.js');
const outputPathStyle = path.join(__dirname, 'dist', 'index.css');

function onUnhandledRejection() {
  // TODO: Not sure this actually detects unhandledRejection errs
  if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
    process.on('unhandledRejection', (reason) => { throw reason; });
    // avoid memory leak by adding too many listeners
    process.env.LISTENING_TO_UNHANDLED_REJECTION = true;
  }
}

const pkgOpts = {
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
  it('compiles a Svelte component package', async (done) => {
    async function wrapper() {
      onUnhandledRejection();

      await buildComponent(pkgOpts);

      /**
       *  FIXME: Use a better way of testing result (not code snapshots) as
       * output can differ between Svelte versions.
       */
      let resultModule = await readFile(outputPathModule, 'utf8');
      resultModule = resultModule.replace(/Svelte v\d\.\d\.\d/, 'Svelte');
      expect(resultModule).toMatchSnapshot();

      let resultMain = await readFile(outputPathMain, 'utf8');
      resultMain = resultMain.replace(/Svelte v\d\.\d\.\d/, 'Svelte');
      expect(resultMain).toMatchSnapshot();

      const resultStyle = await readFile(outputPathStyle, 'utf8');
      expect(resultStyle).toMatchSnapshot();
      done();
    }
    expect(wrapper).not.toThrow();
  });

  it('cleans existing dist dir when exists', async () => {
    const checkFile = path.join(__dirname, 'dist', 'check');
    await writeFile(checkFile, 'exists');

    // file should exist (no error)
    fs.stat(checkFile, (err) => {
      expect(err).toEqual(null);
    });

    await buildComponent(pkgOpts);

    // file should not exist (does error)
    fs.stat(checkFile, (err) => {
      expect(err).not.toEqual(null);
    });
  });

  it.skip('throws an error when bad HTML syntax', () => {});
});
