// TODO: Look into using https://github.com/csstools/postcss-preset-env

'use strict';

const path = require('path');
const postcss = require('postcss');
const atImport = require('postcss-import');
const cssUse = require('postcss-use');
const atVariables = require('postcss-at-rules-variables');
const each = require('postcss-each');
const mixins = require('postcss-mixins');
const nested = require('postcss-nested');
const customProperties = require('postcss-custom-properties');
const conditionals = require('postcss-conditionals');
const customMedia = require('postcss-custom-media');
const calc = require('postcss-calc');
const colorModFunction = require('postcss-color-mod-function');
const mediaQueryPacker = require('css-mqpacker');
const autoprefixer = require('autoprefixer');

/**
 * PostCSS configuration preset for minna-ui projects.
 */
module.exports = postcss.plugin('postcss-config', ({
  importPaths = ['css', 'src/css', process.cwd()],
  mixinsPath = '',
  standalone = false,
  verbose = false,
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

  return postcss()
    .use(atImport({
      path: importPaths,
    }))
    .use(cssUse)
    .use(atVariables)
    .use(each)
    .use(mixins({ mixinsDir }))
    .use(nested)
    .use(customProperties({
      variables,
      preserve: false,
      warnings: verbose,
    }))
    .use(conditionals)
    .use(customMedia)
    .use(calc({
      warnWhenCannotResolve: verbose,
    }))
    .use(colorModFunction)
    .use(mediaQueryPacker)
    .use(autoprefixer({
      remove: false,
      flexbox: 'no-2009',
    }));
});
