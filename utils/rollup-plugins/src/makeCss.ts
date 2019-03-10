// TODO: Merge source maps

/* eslint-disable security/detect-object-injection, jsdoc/valid-types */

import merge from 'deepmerge';
import { writeFile } from 'fs';
import { dirname, isAbsolute, join, resolve } from 'path';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import Purgecss from 'purgecss';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { catchErr } from './catchErr';

interface IMakeCssOptions {
  content?: string[] | Purgecss.RawContent[];
  context?: {};
  debug?: boolean;
  exclude?: string[];
  file?: string;
  include?: string[];
  optimize?: boolean;
  whitelist?: string[];
  writeEmpty?: boolean;
  unsafe?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userOpts?: any[];
}

interface IStyles {
  [x: string]: string;
}

interface IMaps {
  [x: string]: postcss.ResultMap;
}

/**
 * Rollup plugin to generate CSS with PostCSS from imported styles, combine
 * into a single bundle, and write it to disk. Optionally minifies and removes
 * unused styles for significantly smaller CSS bundles.
 * @param opts User defined options.
 * @param opts.content Files to parse for CSS classes. Find which CSS
 * selectors are used when removing unused styles.
 * @param opts.debug Show additional logging for debug purposes.
 * @param opts.exclude Files to exclude from CSS processing.
 * @param opts.file Output file path to write to. Defaults to the same as the
 * JS bundle but with a `.css` file extension.
 * @param opts.context Base PostCSS options.
 * @param opts.include Files to include in CSS processing.
 * @param opts.optimize Should output CSS be minified and cleaned?
 * @param opts.whitelist CSS classes to never remove.
 * @param opts.writeEmpty Write CSS files to disk even when empty.
 * @param opts.unsafe Apply potencially unsafe optimisations.
 * @param opts.userOpts Any additional options to pass to `cssnano`.
 */
export function makeCss({
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
}: IMakeCssOptions = {}): rollup.Plugin {
  const filter = createFilter(include, exclude);
  const styles: IStyles = {};
  const maps: IMaps = {};

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

          // @ts-ignore
          // eslint-disable-next-line no-underscore-dangle
          result.map._sources._array.forEach((dependency: string) => {
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
