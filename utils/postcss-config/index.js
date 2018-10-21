'use strict';

const fs = require('fs');
const path = require('path');
const merge = require('deepmerge');
const nodeResolve = require('resolve');
const postcss = require('postcss');
const atUse = require('postcss-use');
const advancedVars = require('postcss-advanced-variables');
const postcssExtend = require('postcss-extend-rule');
const nested = require('postcss-nested');
const calc = require('postcss-calc');
const colorModFunction = require('postcss-color-mod-function');
const mediaQueryPacker = require('css-mqpacker');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const importCache = {};

/**
 * Custom file resolver for CSS imports.
 */
function resolve(id, cwd, opts) {
  return new Promise((res, rej) => {
    nodeResolve(id, {
      basedir: cwd,
      extensions: ['.css'],
      paths: opts.importPaths,
      packageFilter: function processPackage(pkg) {
        const { style } = pkg;
        let { main } = pkg;

        if (style) {
          main = style;
        } else if (!main || !/\.css$/.test(main)) {
          main = 'index.css';
        }
        return pkg;
      },
      preserveSymlinks: false,
    }, (err, file) => {
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
    });
  });
}

/**
 * PostCSS configuration preset for minna-ui projects.
 */
module.exports = postcss.plugin('minna-ui', (rawopts) => {
  const { debug, optimize, safe } = rawopts;

  let plugins = [
    advancedVars,
    atUse,
    nested,
    postcssExtend,
    calc,
    colorModFunction,
  ];

  if (optimize || process.env.NODE_ENV === 'production') {
    plugins = plugins.concat([
      mediaQueryPacker,
      autoprefixer,
      cssnano,
    ]);
  }

  const importPaths = [process.cwd(), 'css', 'src', 'src/css'];

  try {
    const minnaUiCss = require.resolve('@minna-ui/css');
    importPaths.push(path.dirname(minnaUiCss));
  } catch (err) { /* noop */ }

  // initialise options
  const opts = merge({
    // atUse
    modules: '*',
    resolveFromFile: true,

    // advancedVars
    resolve,
    importPaths,
    importCache,

    // calc
    warnWhenCannotResolve: debug,

    // autoprefixer
    remove: false,
    grid: true, // adds -ms- prefix for IE 11 support
    flexbox: 'no-2009',

    // cssnano
    preset: safe
      ? 'default'
      : ['advanced', {
        autoprefixer: false,
        zindex: false,
      }],
  }, rawopts);

  // initialise plugins
  const initializedPlugins = plugins.map(
    plugin => plugin(opts),
  );

  // process CSS with plugins
  return (root, result) => initializedPlugins.reduce(
    (promise, plugin) => promise.then(
      () => plugin(result.root, result),
    ),
    Promise.resolve(),
  );
});
