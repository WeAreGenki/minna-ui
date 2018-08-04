'use strict';

const path = require('path');
const postcss = require('postcss');
const atImport = require('postcss-import');
const atVariables = require('postcss-at-rules-variables');
const atUse = require('postcss-use');
const each = require('postcss-each');
const mixins = require('postcss-mixins');
const nested = require('postcss-nested');
const cssVariables = require('postcss-custom-properties');
const conditionals = require('postcss-conditionals');
const customMedia = require('postcss-custom-media');
const calc = require('postcss-calc');
const colorModFunction = require('postcss-color-mod-function');
const mediaQueryPacker = require('css-mqpacker');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

/**
 * PostCSS configuration preset for minna-ui projects.
 */
module.exports = postcss.plugin('postcss-config', ({
  importPaths = [process.cwd(), 'css', 'src', 'src/css'],
  mixinsPath = '',
  standalone = false,
  optimize = true,
  optimizeSafe = false,
  verbose = false,
  debug = false,
  variables = {},
} = {}) => {
  const mixinsDir = [];

  if (mixinsPath !== '') {
    mixinsDir.push(mixinsPath);
  }

  if (!standalone) {
    const minnaUiCssSrc = path.dirname(require.resolve('@minna-ui/css'));
    mixinsDir.push(path.join(minnaUiCssSrc, 'mixins'));
    importPaths.push(minnaUiCssSrc);
  }

  const processor = postcss()
    .use(atImport({
      path: importPaths,
      ...(!debug ? {} : {
        load: (filename) => {
          console.log('[postcss-import]', filename);
          // eslint-disable-next-line global-require
          return require('postcss-import/lib/load-content.js')(filename);
        },
      }),
    }))
    .use(atVariables({
      variables,
    }))
    .use(atUse({
      modules: '*',
      resolveFromFile: true,
    }))
    .use(each)
    .use(mixins({ mixinsDir }))
    .use(nested)
    .use(cssVariables({
      variables,
      warnings: debug || verbose,
      preserve: debug && 'computed',
      appendVariables: debug,
    }))
    .use(conditionals)
    .use(customMedia)
    .use(calc({
      warnWhenCannotResolve: verbose,
    }))
    .use(colorModFunction);

  if (optimize) {
    processor
      .use(mediaQueryPacker)
      .use(autoprefixer({
        remove: false,
        grid: true, // adds -ms- prefix for IE 11 support
        flexbox: 'no-2009',
      }))
      .use(cssnano({
        preset: optimizeSafe
          ? 'default'
          : ['advanced', {
            autoprefixer: false,
            zindex: false,
          }],
      }));
  }

  return processor;
});
