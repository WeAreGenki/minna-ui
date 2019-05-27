/**
 * Check for yarn.
 * @overview Prevents installing using `npm`; forces using `yarn`.
 */

// NOTE: If you want to reuse this functionality in other projects, you'll need
// to copy this file. It's not possible to use this from a package because it
// needs to be run _before_ packages are installed.

// @ts-ignore - Namespaces error is false negative (file not in `includes`)

'use strict';

const { posix } = require('path');

const reset = '\x1B[0m';
const redBold = '\x1B[1;91m';
const yellow = '\x1B[0;33m';

// TODO: Get more path samples
/**
 * Sample paths:
 *  Linux:
 *  - yarn bin: `/usr/lib/node_modules/yarn/bin/yarn.js`
 *  - yarn package: ``
 *  - npm bin: ``
 *  - npm package: `~/.config/yarn/global/node_modules/npm/bin/npm-cli.js`
 *  Windows:
 *  - yarn bin: ``
 *  - yarn package: ``
 *  - npm bin: ``
 *  - npm package: ``
 *  macOS:
 *  - yarn bin: ``
 *  - yarn package: ``
 *  - npm bin: ``
 *  - npm package: ``
 *  Lerna:
 *  - `node_modules/lerna/cli.js`
 */

if (process.env.npm_execpath) {
  const execpath = posix.normalize(process.env.npm_execpath);

  if (
    execpath.indexOf('yarn.js') === -1 &&
    execpath.indexOf('lerna/cli.js') === -1
  ) {
    // eslint-disable-next-line no-console
    console.log(`
---------------------------------------------------------------------------
 ${redBold}ERROR:${reset} This project uses yarn for package management. Do not use npm!
 Please install yarn from https://yarnpkg.com and then run \`${yellow}yarn install${reset}\`.
---------------------------------------------------------------------------
\n`);

    process.exit(1);
  }
}
