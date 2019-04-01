// TODO: Create and merge source maps

/* eslint-disable security/detect-object-injection, jsdoc/valid-types */

import merge from 'deepmerge';
import { basename } from 'path';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import syntax from 'postcss-scss';
import Purgecss from 'purgecss';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';

interface EmitCssOptions {
  /**
   * Files to parse for CSS classes. Find which CSS selectors are used when
   * removing unused styles.
   */
  content?: string[] | Purgecss.RawContent[];
  /** Show additional logging for debug purposes. */
  debug?: boolean;
  /** Write CSS files to disk even when empty. */
  emitEmpty?: boolean;
  /** Files to exclude from CSS processing. */
  exclude?: RegExp[] | string[];
  /**
   * CSS file name to emit. Only required when not using `rollup#output.file`.
   * Defaults to same name as your JS bundle but with a `.css` file extension.
   */
  fileName?: string;
  /** Files to include in CSS processing. */
  include?: RegExp[] | string[];
  /**
   * Base PostCSS options. Please note that these can be overriden by your
   * PostCSS configuration file.
   */
  options?: postcss.ProcessOptions;
  /** Should output CSS be minified and cleaned? */
  optimize?: boolean;
  /** CSS classes to never remove. */
  whitelist?: string[];
  /** Apply potentially unsafe optimisations. */
  unsafe?: boolean;
  /** Any additional options to pass to `cssnano`. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userOpts?: any[];
}

/**
 * Rollup plugin to generate CSS with PostCSS from imported styles, combine
 * into a single bundle, and write it to disk. Optionally minifies and removes
 * unused styles for significantly smaller CSS bundles.
 */
export function emitCss({
  content = [
    'src/**/*.html',
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.mjs',
    'src/**/*.svelte',
    'src/**/*.svg',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  debug = false,
  emitEmpty = true,
  exclude = [],
  fileName,
  include = [/\.css$/],
  options = {},
  optimize = process.env.NODE_ENV !== 'development',
  whitelist = [],
  unsafe = false,
  ...userOpts
}: EmitCssOptions = {}): rollup.Plugin {
  const filter = createFilter(include, exclude);
  const styles: { [id: string]: string } = {};
  const maps: { [id: string]: postcss.ResultMap } = {};

  return {
    name: 'makeCss',

    async transform(source, id) {
      if (!filter(id)) return;

      try {
        const ctx = merge(
          {
            from: id,
            map: {
              annotation: false,
              inline: false,
            },
            syntax,
            to: id,
          },
          options,
        );

        const { plugins, options: opts } = await postcssrc(ctx);
        const result = await postcss(plugins).process(source, opts);

        result.warnings().forEach((warn) => {
          this.warn(warn.toString(), { column: warn.column, line: warn.line });
        });

        // register dependencies so rollup can monitor them for changes
        // eslint-disable-next-line no-restricted-syntax
        for (const msg of result.messages) {
          if (msg.type === 'dependency') {
            this.addWatchFile(msg.file);
          }
        }

        styles[id] = result.css;
        maps[id] = result.map;
      } catch (err) {
        if (err.name === 'CssSyntaxError') {
          process.stderr.write(err.message + err.showSourceCode());
        } else {
          this.error(err);
        }
      }

      // eslint-disable-next-line consistent-return
      return {
        code: '',
      };
    },

    // eslint-disable-next-line sort-keys
    async generateBundle(outputOpts) {
      if (!Object.keys(styles).length) return;

      try {
        // combine all style sheets
        let css = '';

        // eslint-disable-next-line
        for (const id in styles) {
          css += styles[id] || '';
        }

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
              preset: ['default', cssnanoOpts],
            }),
          ).process(css, {});

          result.warnings().forEach((warn) => {
            this.warn(warn.toString(), {
              column: warn.column,
              line: warn.line,
            });
          });

          if (unsafe) {
            const purgecss = new Purgecss({
              content,
              css: [{ extension: 'css', raw: result.css }],
              keyframes: true,
              whitelist,
            });

            css = purgecss.purge()[0].css; // eslint-disable-line prefer-destructuring
          } else {
            css = result.css; // eslint-disable-line prefer-destructuring
          }
        }

        if ((!css || !/\S/.test(css)) && !emitEmpty) {
          if (debug) this.warn('CSS empty, not emitting file');
          return;
        }

        if (!outputOpts.file && !fileName) {
          this.error(
            'No rollup#output.file value so you must use the fileName option',
          );
          return;
        }

        const cssFileName =
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          fileName || basename(outputOpts.file!).replace(/js$/, 'css');

        this.emitAsset(cssFileName, css);
      } catch (err) {
        this.error(err);
      }
    },
  };
}
