/**
 * Helper functions for use in tests.
 */

'use strict';

// eslint-disable-next-line security/detect-child-process
const { spawn } = require('child_process');

/**
 * Run a binary file in a separate process and get stdout/stderr.
 *
 * @param {string} path - The full path to the binary file.
 * @param {string[]} [args] - Arguments to pass to the called script.
 * @param {NodeJS.ProcessEnv} [env] - Custom parameters to override those
 * supplied by `process.env`.
 * @returns {Promise<string[]>} Returns the stdout or stderr messages.
 */
exports.runBin = function runBin(path, args = [], env = process.env) {
  return new Promise((resolve, reject) => {
    /** @type {string[]} */
    const stdout = [];
    /** @type {string[]} */
    const stderr = [];

    const child = spawn(path, args, { env });

    child.on('error', (error) => {
      reject(error);
    });

    if (child.stdout) {
      child.stdout.on('data', (data) => {
        stdout.push(data.toString());
      });
    }

    if (child.stderr) {
      child.stderr.on('data', (data) => {
        stderr.push(data.toString());
      });
    }

    child.on('close', (code) => {
      if (stderr.length || code !== 0) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

/* eslint-disable max-len */
// TODO: Add this to the docs or make a live example rather then keeping here
// XXX: Full example of CLI Bin test:

// /** @jest-environment node */
// const { runBin } = require('@minna-ui/jest-config/lib/helpers.js');
// const cliPath = require.resolve('../cli/index.js');

// /**
//  * Generate mock package.json env variables.
//  *
//  * @param {string} dirName
//  */
// const pkg = (dirName, source = sourcePath) => ({
//   npm_package_name: 'test-css',
//   npm_package_version: '1.2.3',
//   npm_package_homepage: 'https://ui.wearegenki.com',
//   npm_package_style: path.join(dist, dirName, 'index.css'),
//   npm_package_browser: path.join(dist, dirName, 'index.css'),
//   npm_package_main: source,
// });

// describe('build-css CLI', () => {
//   it('runs without error', async () => {
//     expect.assertions(1);
//     const result = runBin(cliPath, [], pkg('cli'));
//     await expect(result).resolves.toBeDefined();
//   });

//   it('errors when bad CSS syntax', async () => {
//     expect.assertions(2);
//     const result = runBin(cliPath, [], pkg('cli-bad-syntax', sourcePathBadSyntax));
//     await expect(result).rejects.toContainEqual(expect.stringMatching('Unclosed block'));
//     await expect(result).rejects.toContainEqual(expect.stringMatching('CssSyntaxError'));
//   });
// });
