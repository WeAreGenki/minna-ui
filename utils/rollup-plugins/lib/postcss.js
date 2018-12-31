'use strict';

const merge = require('deepmerge');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const Purgecss = require('purgecss');
const { createFilter } = require('rollup-pluginutils');

/**
 * Rollup plugin to process any imported CSS via PostCSS and optionally remove
 * unused styles for significantly smaller CSS bundles.
 * @param {object} opts
 * @param {(Array<string>|function)=} opts.content Page content.
 * @param {object=} opts.context Base PostCSS options.
 * @param {Array<string>=} opts.exclude Files to exclude from CSS processing.
 * @param {Array<string>=} opts.include Files to include in CSS processing.
 * @param {Array<string>=} opts.content Files to parse for CSS classes.
 * @param {boolean=} opts.optimize Should the output CSS be minified and cleaned?
 * @param {Array<string>=} opts.whitelist CSS classes to always keep.
 * @returns {object} Rollup plugin
 */
function postcssRollup({
  content = [
    '__sapper__/build/*.html',
    '__sapper__/build/*.js',
    // FIXME: Using `dist` is the most reliable but requires 2 builds
    // 'dist/**/*.html',
    // 'dist/**/*.js',
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
    name: 'postcss',

    async transform(source, id) {
      if (!filter(id)) return;

      try {
        const ctx = merge(
          { from: id, to: id, map: { inline: false, annotation: false } },
          context,
        );
        const { plugins, options } = await postcssrc(ctx);
        const result = await postcss(plugins).process(source, options);

        result.warnings().forEach(warn => {
          this.warn(warn.toString(), { line: warn.line, column: warn.column });
        });

        // register sub-dependencies so rollup can monitor them for changes
        if (result.map) {
          // TODO: Don't use PostCSS private API
          /* eslint-disable-next-line no-underscore-dangle */
          result.map._sources._array.forEach(dependency => {
            this.addWatchFile(dependency);
          });
        }

        if (!optimize) {
          /* eslint-disable-next-line consistent-return */
          return {
            code: result.css,
            map: result.map,
          };
        }

        const purgecss = new Purgecss({
          content,
          whitelist,
          css: [{ raw: result.css }],
          keyframes: true,
        });

        const purged = purgecss.purge()[0];

        /* eslint-disable-next-line consistent-return */
        return {
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

module.exports = postcssRollup;
