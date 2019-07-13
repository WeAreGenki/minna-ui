// TODO: Add note to readme that this plugin can only handle one bundle at
// the time at the moment.
// FIXME: Allow running in multiple bundles

// TODO: Inject page reload script into HTML

/* eslint-disable no-console */

import { log } from '@wearegenki/node-utils';
import merge from 'deepmerge';
import http from 'http';
import { resolve } from 'path';
import sirv from 'sirv';
import rollup from 'rollup';
import { handleErr } from '@minna-ui/utils';

const dev = !!process.env.ROLLUP_WATCH;
const DEFAULT_PORT = 5000;
const SHUTDOWN_GRACE_TIME_MS = 1000;

/** Shared server instance (even across multiple plugin invocations). */
let server: http.Server;

interface HttpServerError extends Error {
  code: string;
  message: string;
}

/**
 * Run a local development web server.
 *
 * @see https://github.com/lukeed/sirv/tree/master/packages/sirv#api
 *
 * @param opts - User defined options.
 * @param opts.dir - The directory to serve.
 * @param opts.liveReload - Automaticaly reload the page when a change is
 * detected.
 * @param opts.port - Port to listen on.
 * @param opts.host - Host to listen on.
 * @param opts.spa - Run in single page app mode where `index.html` is served
 * for any unknown paths instead of returning a 404.
 * @param opts.wsPort - Web socket port for the page live reload script.
 * @param opts.options - Any additional options to pass to `sirv`.
 */
export function devServer({
  dir = './dist',
  // liveReload = true,
  port = process.env.PORT || DEFAULT_PORT,
  host = '0.0.0.0',
  spa = false,
  // wsPort = 13341,
  ...options
} = {}): rollup.Plugin {
  if (!dev) {
    console.warn(
      "[DEVSERVER]  Not in watch mode, this probably isn't what you want.",
    );
  }

  // only start a new server if one isn't already initialised
  if (!server) {
    process.on('exit', () => {
      server.close(handleErr);
      console.log('[DEVSERVER]  Terminated server');
    });

    const sirvOpts = merge(
      {
        cors: true,
        dev: true,
        single: spa,
      },
      options,
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

    server.on('error', (err) => {
      if ((err as HttpServerError).code === 'EADDRINUSE') {
        console.log('[DEVSERVER] Address in use, retrying...');

        setTimeout(() => {
          server.close();
          server.listen({ host, port: +port + 1 }, () => {
            console.log(`[DEVSERVER] Started - http://${host}:${port}/`);
          });
        }, SHUTDOWN_GRACE_TIME_MS);
      } else {
        throw err;
      }
    });

    server.listen({ host, port }, () => {
      console.log(`[DEVSERVER] Started - http://${host}:${port}/`);
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
