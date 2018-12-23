'use strict';

const merge = require('deepmerge');
const { writeFile } = require('fs');
const { join } = require('path');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const Purgecss = require('purgecss');
const { createFilter } = require('rollup-pluginutils');
const catchErr = require('./catchErr.js');

/**
 * Rollup plugin to generate CSS with PostCSS from imported styles, combine into
 * a single bundle, and write it to disk. Optionally minifies and removes unused
 * styles for significantly smaller CSS bundles.
 * @param {object} opts
 * @param {string=} opts.file Output file path to write to. Defaults to the same
 * as the JS bundle but with a `.css` file extension.
 * @param {(Array<string>|function)=} opts.content Page markup content. Used to
 * determine which CSS selectors are used when removing unused styles.
 * @param {object=} opts.context Base PostCSS options.
 * @param {Array<string>=} opts.exclude Files to exclude from CSS processing.
 * @param {Array<string>=} opts.include Files to include in CSS processing.
 * @param {Array<string>=} opts.content Files to parse for CSS classes.
 * @param {boolean=} opts.optimize Should the output CSS be minified and cleaned?
 * @param {Array<string>=} opts.whitelist CSS classes to always keep.
 * @param {boolean=} opts.safe Only apply safe optimisations.
 * @param {boolean=} opts.debug Show additional logging for debug purposes.
 * @param {...any=} opts.userOpts Any additional options to pass to `cssnano`.
 * @returns {object} Rollup plugin
 */
function makeCss({
  file,
  content = [
    'src/**/*.html',
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  context = {},
  exclude = [],
  include = ['**/*.css'],
  optimize = process.env.NODE_ENV !== 'development',
  whitelist = [],
  safe = true,
  debug = false,
  ...userOpts
} = {}) {
  const filter = createFilter(include, exclude);

  /** @type {Object<string, string>} */
  const styles = {};

  // TODO: Merge source maps
  const maps = {};

  return {
    name: 'makeCss',

    async transform(source, id) {
      if (!filter(id)) return;

      let dependencies;

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

        // pass through dependent files so rollup can monitor them for changes
        /* eslint-disable-next-line no-underscore-dangle */
        dependencies = result.map ? result.map._sources._array : null;

        styles[id] = result.css;
        maps[id] = result.map;
      } catch (err) {
        if (err.name === 'CssSyntaxError') {
          process.stderr.write(err.message + err.showSourceCode());
        } else {
          this.error(err);
        }
      }

      /* eslint-disable-next-line consistent-return */
      return {
        dependencies,
        code: '',
      };
    },

    async generateBundle(outputOpts, bundle) {
      // combine all style sheets
      let css = '';

      /* eslint-disable-next-line */
      for (const id in styles) {
        css += styles[id] || '';
      }

      // TODO: Merge source maps here

      if (optimize) {
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

        const result = await postcss(
          require('cssnano')({
            preset: safe ? ['default', cssnanoOpts] : ['advanced', cssnanoOpts],
          }),
        ).process(css, {});

        result.warnings().forEach(warn => {
          this.warn(warn.toString(), { line: warn.line, column: warn.column });
        });

        if (safe) {
          css = result.css; // eslint-disable-line prefer-destructuring

          // TODO: Process source map here
        } else {
          const purgecss = new Purgecss({
            content,
            whitelist,
            css: [{ raw: result.css }],
            keyframes: true,
          });

          css = purgecss.purge()[0]; // eslint-disable-line prefer-destructuring

          // TODO: Process source map here
        }
      }

      // FIXME: @TESTING: Test this works as expected for both `output.file` and `output.dir modes`
      // const jsFile = Object.values(bundle)[0].fileName || outputOpts.file;
      const jsFile = outputOpts.file || Object.values(bundle)[0].fileName;
      const cssFile = jsFile.replace(/js$/, 'css');
      const cssOut = outputOpts.dir ? join(outputOpts.dir, cssFile) : cssFile;

      // write CSS file
      writeFile(join(process.cwd(), cssOut), css, catchErr);

      // TODO: Write source map to disk here
    },
  };
}

module.exports = makeCss;
