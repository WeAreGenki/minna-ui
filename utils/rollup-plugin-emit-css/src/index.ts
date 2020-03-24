// TODO: Add source map support

/* eslint-disable no-restricted-syntax */

import CleanCSS from 'clean-css';
import { basename, extname } from 'path';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';

export interface EmitCssOptions {
  /** Concatenate all css files together and emit a single CSS file. */
  combine?: boolean;
  /** Show additional logging for debug purposes. */
  debug?: boolean;
  /** Write CSS files to disk even when empty. */
  emitEmpty?: boolean;
  /** Files to exclude from CSS processing. */
  exclude?: RegExp[] | string[];
  /**
   * CSS file name to emit. Only used in `combine` mode. Without this option
   * the file name will be inferred from `rollup#output.name` or from
   * `rollup#output.file` replacing `.js` with `.css`.
   */
  fileName?: string;
  /** Files to include in CSS processing. */
  include?: RegExp[] | string[];
  /** Should output CSS be minified and cleaned? */
  optimize?: boolean | CleanCSS.OptionsOutput;
}

export function emitCss({
  combine = true,
  debug = false,
  emitEmpty = true,
  exclude = [],
  fileName,
  include = [/\.(p|post)?css$/],
  optimize = process.env.NODE_ENV === 'production',
}: EmitCssOptions = {}): rollup.Plugin {
  const filter = createFilter(include, exclude);
  const styles = new Map();

  return {
    name: 'emit-css',

    transform(code, id) {
      if (!filter(id)) return undefined;

      styles.set(id, code);

      return {
        code: '',
      };
    },

    // eslint-disable-next-line sort-keys
    generateBundle(outputOpts) {
      if (!styles.size) return;

      const processCss = (css: string, id: string): void => {
        if ((!css || !/\S/.test(css)) && !emitEmpty) {
          if (debug) this.warn('CSS empty, not emitting file');
          return;
        }

        if (optimize) {
          const cleancss = new CleanCSS({
            sourceMap: false, // TODO: Add source map support
            ...(typeof optimize === 'object' ? optimize : {}),
          });

          const result = cleancss.minify(css);

          for (const err of result.warnings) this.warn(err);
          for (const err of result.errors) this.error(err);

          // eslint-disable-next-line no-param-reassign
          css = result.styles;
        }

        const name = id.replace(extname(id), '');

        this.emitFile({
          name: `${name}.css`,
          source: css,
          type: 'asset',
        });
      };

      try {
        if (combine) {
          let css = '';

          for (const id of styles.keys()) {
            css += styles.get(id) || '';
          }

          if (!fileName && !outputOpts.name && !outputOpts.file) {
            this.error(
              "Couldn't get name from one of fileName, rollup#output.name, or rollup#output.file",
            );
          }

          const inferredName =
            fileName ||
            outputOpts.name ||
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            basename(outputOpts.file!);

          processCss(css, inferredName);
        } else {
          for (const id of styles.keys()) {
            processCss(styles.get(id), basename(id));
          }
        }
      } catch (err) {
        this.error(err);
      }
    },
  };
}

export default emitCss;
