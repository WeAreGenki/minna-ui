'use strict';

const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const resolve = require('resolve');
const postcss = require('postcss');
const atUse = require('postcss-use');
const advancedVars = require('postcss-advanced-variables');
const postcssExtend = require('postcss-extend-rule');
const nested = require('postcss-nested');
const colorModFunction = require('postcss-color-mod-function');
const mediaQueryPacker = require('css-mqpacker');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const importCache = {};

/**
 * Find which CSS file to use from package.json.
 */
function packageFilter(pkg) {
  const { main, style } = pkg;
  const newPkg = Object.assign({}, pkg);

  if (style) {
    newPkg.main = style;
  } else if (!main || !/\.css$/.test(main)) {
    newPkg.main = 'index.css';
  }
  return newPkg;
}

/**
 * Custom file resolver for CSS imports.
 */
function importResolve(id, cwd, opts) {
  return new Promise((res, rej) => {
    resolve(
      id,
      {
        packageFilter,
        basedir: cwd,
        extensions: ['.css'],
        paths: opts.importPaths,
        preserveSymlinks: false,
      },
      (err, file) => {
        if (err) {
          rej(err);
          return;
        }

        fs.readFile(file, (error, contents) => {
          if (error) {
            rej(error);
            return;
          }

          res({ file, contents });
        });
      },
    );
  });
}

/**
 * PostCSS configuration preset for minna-ui projects.
 */
module.exports = postcss.plugin('minna-ui', userOpts => {
  const { debug, optimize, safe } = userOpts;

  let plugins = [advancedVars, atUse, nested, postcssExtend, colorModFunction];

  if (optimize || process.env.NODE_ENV === 'production') {
    plugins = plugins.concat([mediaQueryPacker, autoprefixer, cssnano]);
  }

  const importPaths = [process.cwd(), 'css', 'src', 'src/css'];

  try {
    const minnaUiCss = require.resolve('@minna-ui/css');
    importPaths.push(path.dirname(minnaUiCss));
  } catch (err) {
    /* noop */
  }

  // initialise options
  const cssnanoOpts = merge(
    {
      autoprefixer: false,
      calc: {
        warnWhenCannotResolve: debug,
      },
      zindex: false,
    },
    userOpts,
  );
  /* tslint:disable object-literal-sort-keys */
  const opts = merge(
    {
      // atUse
      modules: '*',
      resolveFromFile: true,

      // advancedVars
      importCache,
      importPaths,
      importResolve,
      unresolved: debug ? 'warn' : 'ignore',

      // autoprefixer
      grid: true, // IE 11 support
      flexbox: 'no-2009',
      remove: false,

      // cssnano
      preset: safe ? ['default', cssnanoOpts] : ['advanced', cssnanoOpts],
    },
    userOpts,
  );
  /* tslint:enable */

  // initialise plugins
  const initializedPlugins = plugins.map(plugin => plugin(opts));

  // process CSS with plugins
  return (root, result) =>
    initializedPlugins.reduce(
      (promise, plugin) => promise.then(() => plugin(result.root, result)),
      Promise.resolve(),
    );
});
