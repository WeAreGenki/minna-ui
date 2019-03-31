import merge from 'deepmerge';
import { dirname, join } from 'path';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import syntax from 'postcss-scss';
import Purgecss from 'purgecss';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';

interface PostcssRollupOptions {
  content?: string[] | Purgecss.RawContent[];
  context?: postcss.ProcessOptions;
  exclude?: RegExp[] | string[];
  include?: RegExp[] | string[];
  optimize?: boolean;
  whitelist?: string[];
}
/**
 * Rollup plugin to process any imported CSS via PostCSS and optionally remove
 * unused styles for significantly smaller CSS bundles.
 * @param opts User defined options.
 * @param opts.content Files to parse for used CSS classes.
 * @param opts.context Base PostCSS options.
 * @param opts.exclude Files to exclude from CSS processing.
 * @param opts.include Files to include in CSS processing.
 * @param opts.optimize Should output CSS be minified and cleaned?
 * @param opts.whitelist CSS classes to always keep.
 */
export default function postcssRollup({
  content = [
    '__sapper__/build/*.html',
    '__sapper__/build/*.js',
    /**
     * TODO: Add to documentation that `dist` is the most reliable but
     * requires 2 full builds.
     */
    // 'dist/**/*.html',
    // 'dist/**/*.js',
    'src/**/*.html',
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.svelte',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  context = {},
  exclude = [],
  include = [/\.css$/],
  optimize = process.env.NODE_ENV !== 'development',
  whitelist = [],
}: PostcssRollupOptions = {}): rollup.Plugin {
  const filter = createFilter(include, exclude);

  return {
    name: 'postcss',

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
          result.map._sources._array.forEach((dep: string) => {
            this.addWatchFile(join(basePath, dep));
          });
        }

        if (!optimize) {
          // eslint-disable-next-line consistent-return
          return {
            code: result.css,
            map: result.map,
          };
        }

        const purgecss = new Purgecss({
          content,
          css: [{ extension: 'css', raw: result.css }],
          keyframes: true,
          whitelist,
        });

        const purged = purgecss.purge()[0];

        // eslint-disable-next-line consistent-return
        return {
          code: purged.css,
          // @ts-ignore FIXME: PurgeCSS does not support source maps
          map: purged.map,
        };
      } catch (err) {
        if (err.name === 'CssSyntaxError') {
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          process.stderr.write(err.message + err.showSourceCode());
        } else {
          this.error(err);
        }
      }
    },
  };
}

export { postcssRollup as postcss };
