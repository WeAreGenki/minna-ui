// TODO: Add source map support

/* eslint-disable security/detect-object-injection */

import CleanCSS from 'clean-css';
import { basename, extname } from 'path';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';

interface EmitCssOptions {
  /** Concatinate all css files together and emit a single CSS file. */
  combine?: boolean;
  /** Show additional logging for debug purposes. */
  debug?: boolean;
  /** Write CSS files to disk even when empty. */
  emitEmpty?: boolean;
  /** Files to exclude from CSS processing. */
  exclude?: RegExp[] | string[];
  /**
   * CSS file name to emit. Only used in `combine` mode. Without this option
   * the file name will be infered from `rollup#output.name` or from
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
  const styles: { [id: string]: string } = {};

  return {
    name: 'emit-css',

    transform(code, id) {
      if (!filter(id)) return undefined;

      styles[id] = code;

      return {
        code: '',
      };
    },

    // eslint-disable-next-line sort-keys
    generateBundle(outputOpts) {
      if (!Object.keys(styles).length) return;

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

          result.warnings.forEach((err) => this.warn(err));
          result.errors.forEach((err) => this.error(err));

          // eslint-disable-next-line no-param-reassign
          css = result.styles;
        }

        this.emitAsset(id.replace(extname(id), '.css'), css);
      };

      try {
        if (combine) {
          // combine all style sheets
          let css = '';

          // eslint-disable-next-line no-restricted-syntax, guard-for-in
          for (const id in styles) {
            css += styles[id] || '';
          }

          if (!fileName && !outputOpts.name && !outputOpts.file) {
            this.error(
              "Couldn't infer file name from one of fileName, rollup#output.name, or rollup#output.file",
            );
            return;
          }

          const cssFileName =
            fileName ||
            outputOpts.name ||
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            basename(outputOpts.file!).replace(/js$/, 'css');

          processCss(css, cssFileName);
        } else {
          Object.entries(styles).forEach(([id, css]) => {
            processCss(css, id);
          });
        }
      } catch (err) {
        this.error(err);
      }
    },
  };
}

export default emitCss;
