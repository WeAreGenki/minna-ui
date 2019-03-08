'use strict';

const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const mediaQueryPacker = require('css-mqpacker');
const merge = require('deepmerge');
const postcss = require('postcss');
const advancedVars = require('postcss-advanced-variables');
const colorModFunction = require('postcss-color-mod-function');
const nested = require('postcss-nested');
const atUse = require('postcss-use');
const importResolve = require('./css-import-resolve.js');

// TODO: Could/should this be cached on disk for faster rebulds?
const importCache = {};

/**
 * PostCSS configuration preset for minna-ui projects.
 */
module.exports = postcss.plugin(
  'minna-ui',
  // @ts-ignore
  ({
    debug = true,
    importPaths = [process.cwd(), 'src', 'src/css'],
    optimize = process.env.NODE_ENV === 'production',
    unsafe = false,
    ...opts
  } = {}) => {
    let plugins = [advancedVars, atUse, nested, colorModFunction];

    if (optimize) {
      plugins = plugins.concat([
        unsafe && mediaQueryPacker,
        autoprefixer,
        cssnano,
      ]);
    }

    const cssnanoOpts = merge(
      {
        calc: {
          warnWhenCannotResolve: debug,
        },
      },
      opts,
    );
    /* eslint-disable sort-keys */
    const pluginOpts = merge(
      {
        // postcss-advanced-variables
        importCache,
        importPaths,
        importResolve,
        unresolved: debug ? 'warn' : 'ignore',

        // postcss-use
        modules: '*',
        resolveFromFile: true,

        // autoprefixer
        grid: true, // IE 11 support
        flexbox: 'no-2009',
        remove: false,

        // cssnano
        preset: ['default', cssnanoOpts],
      },
      opts,
    );
    /* eslint-enable */

    const initializedPlugins = plugins.map((plugin) => plugin(pluginOpts));

    // process CSS with plugins
    return (_, result) =>
      initializedPlugins.reduce(
        (promise, plugin) => promise.then(() => plugin(result.root, result)),
        Promise.resolve(),
      );
  },
);
