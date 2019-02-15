// TODO: Add note to readme that this plugin can only handle one bundle at
// the time at the moment.
// FIXME: Allow running in multiple bundles

// TODO: Inject page reload script into HTML

/* eslint-disable no-console, security/detect-object-injection */

'use strict';

const { log } = require('@wearegenki/node-utils');
const merge = require('deepmerge');
const http = require('http');
const { resolve } = require('path');
const sirv = require('sirv');
const catchErr = require('./catchErr.js');

const dev = !!process.env.ROLLUP_WATCH;

/**
 * Shared server instance (even across multiple plugin invocations).
 * @type {http.Server}
 */
let server;

/**
 * Run a local development web server.
 * @see https://github.com/lukeed/sirv/tree/master/packages/sirv#api
 * @param {Object} opts User defined options.
 * @param {string=} opts.dir The directory to serve.
 * @param {boolean=} opts.liveReload Enable automatic page reload when a
 * dependent file changes.
 * @param {(string|number)=} opts.port Port to listen on.
 * @param {boolean=} opts.spa Run in single page app mode where `index.html` is
 * served for any unknown paths instead of returning a 404.
 * @param {number=} opts.wsPort Web socket port for the page live reload script.
 * @param {...any=} opts.userOpts Any additional options to pass to `sirv`.
 * @returns {Object} Rollup plugin.
 */
function devserver({
  dir = './dist',
  // liveReload = true,
  port = process.env.PORT || 5000,
  spa = false,
  // wsPort = 13341,
  ...userOpts
} = {}) {
  if (!dev) {
    console.warn(
      "[DEVSERVER] Not in watch mode, this probably isn't what you want.",
    );
  }

  // only start a new server if one isn't already initialised
  if (!server) {
    process.on('exit', () => {
      server.close(catchErr);
      console.log('[DEVSERVER] Terminated server');
    });

    const sirvOpts = merge(
      {
        cors: true,
        dev: true,
        single: spa,
      },
      userOpts,
    );

    server = http.createServer(sirv(resolve(dir), sirvOpts));

    // TODO: Live reload script injection
    // server.on('request', (req, res) => {
    //   const { method, url } = req;

    //   if (
    //     url &&
    //     (url.endsWith('/') || url.endsWith('.html')) &&
    //     method === 'GET'
    //   ) {
    //     // console.log('@@REQ', req);
    //     console.log('@@HIT HIT');
    //   }
    // });

    // request logging middleware
    server.on('request', log);

    server.listen(port, (err) => {
      if (err) throw err;

      console.log(`[DEVSERVER] Started server at http://localhost:${port}/`);
    });
  }

  return {
    name: 'devserver',

    // generateBundle(outputOpts, bundle, isWrite) {
    //   console.log('@@generateBundle isWrite', isWrite);
    // },

    // watchChange(file) {
    //   console.log(`[DEVSERVER] Reloading due to file change: ${file}`);
    // },
  };
}

module.exports = devserver;
