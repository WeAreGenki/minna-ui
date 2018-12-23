// TODO: Add note to readme that this plugin can only handle one bundle at the time at the moment.
// FIXME: Allow running in multiple bundles

// TODO: Inject page reload script into HTML

'use strict';

const colors = require('colorette');
const merge = require('deepmerge');
const { createServer } = require('http');
const { resolve } = require('path');
const sirv = require('sirv');

const dev = !!process.env.ROLLUP_WATCH;

let server;

/**
 * Run a local development web server.
 * @see https://github.com/lukeed/sirv/tree/master/packages/sirv#api
 * @param {object} opts
 * @param {string=} opts.dir
 * @param {number=} opts.port
 * @param {boolean=} opts.spa
 * @param {number=} opts.wsPort Web socket port for page reload script.
 * @param {...any=} opts.userOpts Any additional options to pass to `sirv`.
 * @returns {object} Rollup plugin
 */
function devserver({
  dir = './dist',
  port = process.env.PORT || 5000,
  spa = false,
  wsPort = 13341,
  ...userOpts
} = {}) {
  if (!dev) {
    console.warn(
      "[DEVSERVER] Running but not in watch mode, this probably isn't what you want.",
    );
  }

  process.on('exit', code => {
    console.log(`[DEVSERVER] About to exit with code: ${code}`);
    server.close();
  });

  const sirvOpts = merge(
    {
      cors: true,
      dev: true,
    },
    userOpts,
  );

  server = createServer(sirv(resolve(dir), sirvOpts));

  server.on('request', (req, res) => {
    const { method, url } = req;

    if (
      url &&
      (url.endsWith('/') || url.endsWith('.html')) &&
      method === 'GET'
    ) {
      // console.log('@@REQ', req);
      console.log('@@HIT HIT');
    }
  });

  server.listen(port, err => {
    if (err) throw err;

    console.log(`[DEVSERVER] Started server at http://localhost:${port}/`);
  });

  return {
    name: 'devserver',

    generateBundle(outputOpts, bundle, isWrite) {
      console.log('@@generateBundle isWrite', isWrite);
    },

    watchChange(file) {
      console.log(`[DEVSERVER] Reloading due to file change: ${file}`);
    },
  };
}

module.exports = devserver;
