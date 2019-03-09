/* eslint-disable security/detect-object-injection, jsdoc/valid-types */

'use strict';

const merge = require('deepmerge');
const { writeFile } = require('fs');
const { dirname, isAbsolute, join, resolve } = require('path');
const postcss = require('postcss');
const postcssrc = require('postcss-load-config');
const Purgecss = require('purgecss');
const { createFilter } = require('rollup-pluginutils');
const catchErr = require('./catchErr.js');

/**
 * Rollup plugin to generate CSS with PostCSS from imported styles, combine into
 * a single bundle, and write it to disk. Optionally minifies and removes unused
 * styles for significantly smaller CSS bundles.
 * @param {Object} opts User defined options.
 * @param {(string[]|import('purgecss').RawContent[])=} opts.content Files to
 * parse for CSS classes. Find which CSS selectors are used when removing
 * unused styles.
 * @param {boolean=} opts.debug Show additional logging for debug purposes.
 * @param {(string[])=} opts.exclude Files to exclude from CSS processing.
 * @param {string=} opts.file Output file path to write to. Defaults to the same
 * as the JS bundle but with a `.css` file extension.
 * @param {Object=} opts.context Base PostCSS options.
 * @param {(string[])=} opts.include Files to include in CSS processing.
 * @param {boolean=} opts.optimize Should output CSS be minified and cleaned?
 * @param {(string[])=} opts.whitelist CSS classes to never remove.
 * @param {boolean=} opts.writeEmpty Write CSS files to disk even when empty.
 * @param {boolean=} opts.unsafe Apply potencially unsafe optimisations.
 * @param {...any=} opts.userOpts Any additional options to pass to `cssnano`.
 * @returns {import('rollup').Plugin} Rollup plugin.
 */
function makeCss({
  content = [
    'src/**/*.html',
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.svelte',
    'src/**/*.svg',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  context = {},
  debug = false,
  exclude = [],
  file,
  include = ['**/*.css'],
  optimize = process.env.NODE_ENV !== 'development',
  whitelist = [],
  writeEmpty = false,
  unsafe = false,
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

      try {
        const ctx = merge(
          { from: id, map: { annotation: false, inline: false }, to: id },
          context,
        );

        const { plugins, options } = await postcssrc(ctx);
        const result = await postcss(plugins).process(source, options);

        result.warnings().forEach((warn) => {
          this.warn(warn.toString(), { column: warn.column, line: warn.line });
        });

        // register sub-dependencies so rollup can monitor them for changes
        if (result.map) {
          const basePath = dirname(id);

          // TODO: Don't use PostCSS private API
          // eslint-disable-next-line no-underscore-dangle
          result.map._sources._array.forEach((dependency) => {
            this.addWatchFile(join(basePath, dependency));
          });
        }

        styles[id] = result.css;
        maps[id] = result.map;
      } catch (err) {
        if (err.name === 'CssSyntaxError') {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          process.stderr.write(err.message + err.showSourceCode());
        } else {
          this.error(err);
        }
      }

      // eslint-disable-next-line consistent-return
      return { code: '' };
    },

    // eslint-disable-next-line sort-keys
    async generateBundle(outputOpts, bundle) {
      // combine all style sheets
      let css = '';

      // eslint-disable-next-line
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
          // eslint-disable-next-line global-require
          require('cssnano')({
            preset: [unsafe ? 'advanced' : 'default', cssnanoOpts],
          }),
        ).process(css, {});

        result.warnings().forEach((warn) => {
          this.warn(warn.toString(), { column: warn.column, line: warn.line });
        });

        if (unsafe) {
          const purgecss = new Purgecss({
            content,
            css: [{ extension: 'css', raw: result.css }],
            keyframes: true,
            whitelist,
          });

          ({ css } = purgecss.purge()[0]); // eslint-disable-line prefer-destructuring
        } else {
          ({ css } = result);
        }

        // TODO: Process source map here
      }

      // don't save to disk if the CSS is empty
      if (!css || !/\S/.test(css)) {
        if (!writeEmpty) {
          // eslint-disable-next-line no-console
          if (debug) console.warn('Skipping writing to disk, CSS is empty');
          return;
        }
      }

      let cssWritePath;

      if (file) {
        cssWritePath = resolve(file);
      } else {
        // FIXME: Test this works for both `output.file` and `output.dir modes`
        // const jsFile = Object.values(bundle)[0].fileName || outputOpts.file;
        const jsFile = outputOpts.file || Object.values(bundle)[0].fileName;
        const cssFile = jsFile.replace(/js$/, 'css');
        const cssOut = outputOpts.dir ? join(outputOpts.dir, cssFile) : cssFile;
        cssWritePath = isAbsolute(cssOut)
          ? cssOut
          : join(process.cwd(), cssOut);
      }

      // write CSS file
      writeFile(cssWritePath, css, catchErr);

      // TODO: Write source map to disk here
    },
  };
}

module.exports = makeCss;
