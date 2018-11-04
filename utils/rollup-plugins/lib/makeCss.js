'use strict';

const merge = require('deepmerge');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const Purgecss = require('purgecss');
const { createFilter } = require('rollup-pluginutils');

/**
 * Rollup plugin to generate HTML from a template and write it to disk
 * @param {object} opts
 * @param {(Array<string>|function)=} opts.content Page content.
 * @param {object=} opts.context Base PostCSS options.
 * @param {Array<string>=} opts.exclude Files to exclude from CSS processing.
 * @param {Array<string>=} opts.include Files to include in CSS processing.
 * @param {Array<string>=} opts.content Files to parse for CSS classes.
 * @param {boolean=} opts.optimize Should the plugin minimise and clean output CSS?
 * @param {Array<string>=} opts.whitelist CSS classes to always keep.
 */
function makeCss({
  content = [
    '__sapper__/**/*.html',
    '__sapper__/**/*.js',
    'src/**/*.html',
    'src/**/*.js',
  ],
  context = {},
  exclude = [],
  include = ['**/*.css'],
  optimize = process.env.NODE_ENV !== 'development',
  whitelist = [],
} = {}) {
  const filter = createFilter(include, exclude);

  return {
    name: 'makeCss',

    async transform(source, id) {
      if (!filter(id)) return;

      try {
        const ctx = merge({ from: id, to: id, map: { inline: false, annotation: false } }, context);
        const { plugins, options } = await postcssrc(ctx);
        const result = await postcss(plugins).process(source, options);

        result.warnings().forEach((warn) => {
          this.warn(warn.toString(), { line: warn.line, column: warn.column });
        });

        // this allows rollup to monitor files for changes in watch mode
        /* eslint-disable-next-line no-underscore-dangle */
        const dependencies = result.map ? result.map._sources._array : null;

        if (!optimize) {
          return { // eslint-disable-line consistent-return
            dependencies,
            code: result.css,
            map: result.map,
          };
        }

        const purgecss = new Purgecss({
          content,
          css: [{ raw: result.css }],
          keyframes: true,
          whitelist,
        });

        const purged = purgecss.purge()[0];

        return { // eslint-disable-line consistent-return
          dependencies,
          code: purged.css,
          map: purged.map,
        };
      } catch (err) {
        if (err.name === 'CssSyntaxError') {
          process.stderr.write(err.message + err.showSourceCode());
        } else {
          this.error(err);
        }
      }
    },
  };
}

module.exports = makeCss;
