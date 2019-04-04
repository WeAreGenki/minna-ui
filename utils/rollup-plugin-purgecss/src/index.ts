// TODO: Could the content be automated in a rollup hook which has bundle data?

import Purgecss from 'purgecss';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';

interface PurgecssOptions {
  /** Enable debugging feedback. */
  debug?: boolean;
  /** Files to exclude from processing. */
  exclude?: RegExp[] | string[];
  /** Files to include in processing. */
  include?: RegExp[] | string[];
  /** Any other options will be passed to Purgecss. */
  options?: Purgecss.Options;
}

export function purgecss({
  debug,
  exclude = [/node_modules\/@minna-ui/],
  include = [/\.(p|post)?css$/],
  ...options
}: PurgecssOptions = {}): rollup.Plugin {
  const filter = createFilter(include, exclude);

  return {
    name: 'purgecss',

    // eslint-disable-next-line sort-keys
    async transform(code, id) {
      if (!filter(id)) return;

      try {
        const defaults = {
          content: [
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
          keyframes: true,
          rejected: debug,
          whitelistPatternsChildren: [/^svelte-/],
        };
        const opts = Object.assign(
          defaults,
          { ...options },
          {
            css: [
              {
                extension: 'css',
                raw: code,
              },
            ],
          },
        );

        const result = new Purgecss(opts).purge()[0];

        if (result.rejected) {
          // eslint-disable-next-line no-console
          console.log('[purgecss] Rejected selectors:', result.rejected);
        }

        // eslint-disable-next-line consistent-return
        return {
          code: result.css,
        };
      } catch (err) {
        this.error(err);
      }
    },
  };
}

export default purgecss;
