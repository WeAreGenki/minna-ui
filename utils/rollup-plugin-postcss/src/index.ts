import merge from 'deepmerge';
import { extname } from 'path';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import syntax from 'postcss-scss';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';

interface PostcssRollupOptions {
  /** Files to exclude from processing. */
  exclude?: RegExp[] | string[];
  /** Files to include in processing. */
  include?: RegExp[] | string[];
  /** Any other options will be passed to PostCSS. */
  options?: postcss.ProcessOptions;
}

/**
 * Rollup plugin to process imported styles via PostCSS.
 */
function postcssRollup({
  exclude = [/node_modules\/@minna-ui/],
  include = [/\.(p|post)?css$/],
  ...options
}: PostcssRollupOptions = {}): rollup.Plugin {
  const filter = createFilter(include, exclude);

  return {
    name: 'postcss',

    // @ts-ignore Wrong type in Rollup (void != null)
    resolveId(id) {
      if (!filter(id)) return null;

      // convert file extension to .css
      return id.replace(extname(id), '.css');
    },

    async transform(code, id) {
      if (!filter(id)) return;

      try {
        const context = merge(
          {
            from: id,
            map: {
              annotation: false as false,
              inline: false,
            },
            syntax,
            to: id,
          },
          { ...options },
        );
        const { plugins, options: opts } = await postcssrc(context);
        const result = await postcss(plugins).process(code, opts);

        result.warnings().forEach((warn) => {
          this.warn(warn.toString(), { column: warn.column, line: warn.line });
        });

        // register file dependencies so rollup can watch them for changes
        // eslint-disable-next-line no-restricted-syntax
        for (const msg of result.messages) {
          if (msg.type === 'dependency') {
            this.addWatchFile(msg.file);
          }
        }

        // eslint-disable-next-line consistent-return
        return {
          code: result.css,
          map: (result.map && result.map.toString()) || undefined,
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

export { postcssRollup as postcss };
export default postcssRollup;
