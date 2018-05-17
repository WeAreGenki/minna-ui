/** @jest-environment node */

'use strict';

const os = require('os');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const buildCss = require('../index.js');

const readFile = promisify(fs.readFile);

const tmpDir = os.tmpdir();
const tmpPath = fs.mkdtempSync(`${tmpDir}${path.sep}minna_ui_build_css_test_`);

const sourcePath = require.resolve('@minna-ui/jest-config/fixtures/styles.css');
const outputPath = path.join(tmpPath, 'dist', 'index.css');

describe('build-css', () => {
  it('compiles an NPM package\'s CSS', async () => {
    async function wrapper() {
      // FIXME: Not sure this actually detects unhandledRejection errs
      if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
        process.on('unhandledRejection', (reason) => { throw reason; });
        // avoid memory leak by adding too many listeners
        process.env.LISTENING_TO_UNHANDLED_REJECTION = true;
      }

      await buildCss({
        npm_package_version: '1.0.0',
        npm_package_homepage: 'https://example.com',
        npm_package_main: sourcePath,
        npm_package_style: outputPath,
      });
      const result = await readFile(outputPath, 'utf8');
      expect(result).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
  });

  it.skip('compiles with an existing dist dir', () => {});

  it.skip('throws an error when bad CSS syntax', () => {});
});
