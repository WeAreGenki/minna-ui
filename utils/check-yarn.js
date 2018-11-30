/**
 * Prevent installing using `npm`; force using `yarn`.
 */

/* eslint-disable no-console */
/* tslint:disable no-console */

'use strict';

const reset = '\x1B[0m';
const red = '\x1B[1;91m';
const yellow = '\x1B[0;33m';

/**
 * Sample paths on Linux:
 *  - yarn: `/usr/lib/node_modules/yarn/bin/yarn.js`
 *  - local npm: `/home/max/.config/yarn/global/node_modules/npm/bin/npm-cli.js`
 */

if (process.env.npm_execpath.indexOf('yarn.js') === -1) {
  console.log(`${red}ERROR:${reset} This project uses yarn for package management. Install
       it from https://yarnpkg.com and then run \`${yellow}yarn setup${reset}\`.\n`);

  process.exit(1);
}
