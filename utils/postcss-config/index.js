// TODO: Make the import extension configurable instead of hard coding `.css`

'use strict';

const path = require('path');
const merge = require('deepmerge');
const postcss = require('postcss');
const atImport = require('postcss-import');
const atUse = require('postcss-use');
const advancedVars = require('postcss-advanced-variables');
const postcssExtend = require('postcss-extend-rule');
const nested = require('postcss-nested');
const colorModFunction = require('postcss-color-mod-function');
const mediaQueryPacker = require('css-mqpacker');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

/**
 * PostCSS configuration preset for minna-ui projects.
 */
module.exports = postcss.plugin(
  'minna-ui',
  ({
    debug,
    safe,
    importPaths = [process.cwd(), 'css', 'src', 'src/css'],
    optimize = process.env.NODE_ENV === 'production',
    ...opts
  }) => {
    let plugins = [
      atImport,
      advancedVars,
      atUse,
      nested,
      postcssExtend,
      colorModFunction,
    ];

    if (optimize) {
      plugins = plugins.concat([mediaQueryPacker, autoprefixer, cssnano]);
    }

    // add path to @minna-ui/css if it's installed
    try {
      const minnaUiCss = require.resolve('@minna-ui/css');
      importPaths.push(path.dirname(minnaUiCss));
    } catch (err) {
      /* noop */
    }

    const cssnanoOpts = merge(
      {
        autoprefixer: false,
        calc: {
          warnWhenCannotResolve: debug,
        },
        zindex: false,
      },
      opts,
    );
    /* tslint:disable object-literal-sort-keys */
    const pluginOpts = merge(
      {
        // atImport
        // although advancedVars can also import, this plugin is more flexible
        path: importPaths,

        // advancedVars
        unresolved: debug ? 'warn' : 'ignore',

        // atUse
        modules: '*',
        resolveFromFile: true,

        // autoprefixer
        grid: true, // IE 11 support
        flexbox: 'no-2009',
        remove: false,

        // cssnano
        preset: safe ? ['default', cssnanoOpts] : ['advanced', cssnanoOpts],
      },
      opts,
    );
    /* tslint:enable */

    const initializedPlugins = plugins.map(plugin => plugin(pluginOpts));

    // process CSS with plugins
    return (root, result) =>
      initializedPlugins.reduce(
        (promise, plugin) => promise.then(() => plugin(result.root, result)),
        Promise.resolve(),
      );
  },
);
