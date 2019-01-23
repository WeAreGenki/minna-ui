/**
 * Check for yarn.
 * @overview Prevents installing using `npm`; forces using `yarn`.
 */

// NOTE: If you want to reuse this functionality in other projects, you'll need
// to copy this file. It's not possible to use this from a package because it
// needs to be run before packages are installed.

/* eslint-disable no-console */
/* tslint:disable no-console */

'use strict';

const reset = '\x1B[0m';
const redBold = '\x1B[1;91m';
const yellow = '\x1B[0;33m';
const execpath = process.env.npm_execpath;

// TODO: Get more path samples
/**
 * Sample paths:
 *  Linux:
 *  - yarn bin: `/usr/lib/node_modules/yarn/bin/yarn.js`
 *  - yarn package: ``
 *  - npm bin: ``
 *  - npm package: `/home/username/.config/yarn/global/node_modules/npm/bin/npm-cli.js`
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
 */

if (execpath && execpath.indexOf('yarn.js') === -1) {
  if (execpath.indexOf('lerna/cli.js') === -1) {
    console.log(`
---------------------------------------------------------------------------
 ${redBold}ERROR:${reset} This project uses yarn for package management. Do not use npm!
 Please install yarn from https://yarnpkg.com and then run \`${yellow}yarn install${reset}\`.
---------------------------------------------------------------------------
\n`);

    process.exit(1);
  }
}
