/** @jest-environment node */

'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const buildComponent = require('../index.js');

const readFile = promisify(fs.readFile);
const tmpDir = os.tmpdir();
const tmpPath = fs.mkdtempSync(`${tmpDir}${path.sep}minna_ui_build_component_test_`);
const sourcePath = require.resolve('@minna-ui/jest-config/fixtures/component.html');
const outputPathModule = path.join(tmpPath, 'dist', 'index.es.mjs');
const outputPathMain = path.join(tmpPath, 'dist', 'index.js');
const outputPathStyle = path.join(tmpPath, 'dist', 'index.css');

describe('build-component', () => {
  it('compiles a Svelte component package', async (done) => {
    async function wrapper() {
      // TODO: Not sure this actually detects unhandledRejection errs
      if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
        process.on('unhandledRejection', (reason) => { throw reason; });
        // avoid memory leak by adding too many listeners
        process.env.LISTENING_TO_UNHANDLED_REJECTION = true;
      }

      await buildComponent({
        npm_package_name: 'test-component',
        npm_package_version: '1.0.0',
        npm_package_homepage: 'https://example.com',
        npm_package_svelte: sourcePath,
        npm_package_module: outputPathModule,
        npm_package_main: outputPathMain,
        npm_package_style: outputPathStyle,
      });

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

  it.skip('compiles with an existing dist dir', () => {});

  it.skip('throws an error when bad HTML syntax', () => {});
});
