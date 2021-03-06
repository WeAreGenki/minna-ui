/* eslint-disable no-restricted-syntax */

import merge from 'deepmerge';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
// @ts-ignore
import syntax from 'postcss-scss';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { RollupPostcssOptions } from './types';

/**
 * Rollup plugin to process imported styles via PostCSS.
 */
function postcssRollup({
  exclude = [/node_modules\/@minna-ui/],
  include = [/\.(p|post)?css$/],
  ...options
}: RollupPostcssOptions = {}): rollup.Plugin {
  const filter = createFilter(include, exclude);

  return {
    name: 'postcss',

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
          options,
        );
        const { plugins, options: opts } = await postcssrc(context);
        const result = await postcss(plugins).process(code, opts);

        for (const warn of result.warnings()) {
          this.warn(warn.toString(), { column: warn.column, line: warn.line });
        }

        // register file dependencies so rollup can watch them for changes
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
