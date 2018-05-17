'use strict';

const path = require('path');
const postcss = require('postcss');
const atImport = require('postcss-import');
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
module.exports = postcss.plugin('postcss-config', (opts = {}) => {
  if (opts.minimal) {
    // reduced feature set version
    return postcss()
      .use(atImport)
      .use(nested)
      .use(customMedia)
      .use(autoprefixer);
  }

  const mixinsDir = [];
  const pkgDir = path.dirname(require.resolve('@minna-ui/css'));
  mixinsDir.push(path.join(pkgDir, 'mixins'));

  if (opts.mixinsDir) {
    mixinsDir.unshift(opts.mixinsDir);
  }

  // default full featured version
  return postcss()
    .use(atImport({ path: opts.importPath || ['css', 'src/css', process.cwd(), pkgDir] }))
    .use(atVariables)
    .use(each)
    .use(mixins({ mixinsDir }))
    .use(nested)
    .use(customProperties({ preserve: false, warnings: opts.verbose }))
    .use(conditionals)
    .use(customMedia)
    .use(calc({ warnWhenCannotResolve: opts.verbose }))
    .use(colorModFunction)
    .use(mediaQueryPacker)
    .use(autoprefixer({ remove: false, flexbox: 'no-2009' }));
});
