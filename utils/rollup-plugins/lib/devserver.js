// TODO: Add note to readme that this plugin can only handle one bundle at the time at the moment.
// FIXME: Allow running in multiple bundles

// TODO: Inject page reload script into HTML

/* tslint:disable no-console */
/* eslint-disable no-console */

'use strict';

const colors = require('colorette');
const merge = require('deepmerge');
const { createServer } = require('http');
const { resolve } = require('path');
const sirv = require('sirv');
const catchErr = require('./catchErr.js');

const dev = !!process.env.ROLLUP_WATCH;

/** One server instance across all plugin invocations. */
let server;

/** Byte size units. Let's hope our requests never get above `kB` ;) */
const units = ['B', 'kB', 'MB', 'GB', 'TB'];

/**
 * Convert bytes into a human readable form.
 */
function humanizeSize(bytes) {
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  if (index < 0) return '';
  return `${+(bytes / 1024 ** index).toFixed(2)} ${units[index]}`;
}

/**
 * Run a local development web server.
 * @see https://github.com/lukeed/sirv/tree/master/packages/sirv#api
 * @param {object} opts
 * @param {string=} opts.dir The directory to serve.
 * @param {boolean=} opts.liveReload Enable automatic page reload when a
 * dependent file changes.
 * @param {number=} opts.port Port to listen on.
 * @param {boolean=} opts.spa Run in single page app mode where `index.html` is
 * served for any unknown paths instead of returning a 404.
 * @param {number=} opts.wsPort Web socket port for the page live reload script.
 * @param {...any=} opts.userOpts Any additional options to pass to `sirv`.
 * @returns {object} Rollup plugin.
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
      "[DEVSERVER] Running but not in watch mode, this probably isn't what you want.",
    );
  }

  // only start a new server if one isn't already initialised
  if (!server) {
    process.on('exit', () => {
      server.close(catchErr);
      console.log(`[DEVSERVER] Terminated server`);
    });

    const sirvOpts = merge(
      {
        cors: true,
        dev: true,
        single: spa,
      },
      userOpts,
    );

    server = createServer(sirv(resolve(dir), sirvOpts));

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
    server.on('request', (req, res) => {
      const start = process.hrtime();
      const write = res.write.bind(res);
      let byteLength = 0;

      // monkey patch to calculate response byte size
      res.write = function writeFn(data) {
        if (data) byteLength += data.length;
        // @ts-ignore
        write(...arguments); // eslint-disable-line prefer-rest-params
      };

      req.once('end', () => {
        const duration = process.hrtime(start);
        const { method, originalUrl, url } = req;
        const { statusCode } = res;
        const timing = `${+(duration[1] / 1e6).toFixed(2)}ms`;
        const color =
          statusCode >= 400 ? 'red' : statusCode >= 300 ? 'yellow' : 'green'; // eslint-disable-line no-nested-ternary
        const size = humanizeSize(byteLength);
        const uri = originalUrl || url;
        console.log(
          `» ${timing} ${colors[color](
            statusCode,
          )} ${method} ${uri} ${colors.cyan(size)}`,
        );
      });
    });

    server.listen(port, err => {
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
