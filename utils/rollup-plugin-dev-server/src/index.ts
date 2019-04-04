// TODO: Add note to readme that this plugin can only handle one bundle at
// the time at the moment.
// FIXME: Allow running in multiple bundles

// TODO: Inject page reload script into HTML

/* eslint-disable no-console, security/detect-object-injection */

import { log } from '@wearegenki/node-utils';
import merge from 'deepmerge';
import http from 'http';
import { resolve } from 'path';
import sirv from 'sirv';
import rollup from 'rollup';
import { handleErr } from '@minna-ui/utils';

const dev = !!process.env.ROLLUP_WATCH;

/** Shared server instance (even across multiple plugin invocations). */
let server: http.Server;

/**
 * Run a local development web server.
 * @see https://github.com/lukeed/sirv/tree/master/packages/sirv#api
 * @param opts User defined options.
 * @param opts.dir The directory to serve.
 * @param opts.liveReload Automatic page reload when a dependent file changes.
 * @param opts.port Port to listen on.
 * @param opts.host Host to listen on.
 * @param opts.spa Run in single page app mode where `index.html` is served
 * for any unknown paths instead of returning a 404.
 * @param opts.wsPort Web socket port for the page live reload script.
 * @param opts.options Any additional options to pass to `sirv`.
 */
export function devServer({
  dir = './dist',
  // liveReload = true,
  port = process.env.PORT || 5000,
  host = '0.0.0.0',
  spa = false,
  // wsPort = 13341,
  ...options
} = {}): rollup.Plugin {
  if (!dev) {
    console.warn(
      "[devserver] Not in watch mode, this probably isn't what you want.",
    );
  }

  // only start a new server if one isn't already initialised
  if (!server) {
    process.on('exit', () => {
      server.close(handleErr);
      console.log('[devserver] Terminated server');
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
      // @ts-ignore FIXME: Is it possible to extend a build-in lib interface?
      if (err.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');

        setTimeout(() => {
          server.close();
          server.listen({ host, port: +port + 1 }, () => {
            console.log(`[DEVSERVER] Started - http://${host}:${port}/`);
          });
        }, 1000);
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
