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
}

export function purgecss({
  content = [
    // TODO: Document that using `__sapper__/*` requires 2 builds
    '__sapper__/build/*.html',
    '__sapper__/build/**/*.js',
    '__sapper__/export/**/*.html',
    '__sapper__/export/**/*.js',
    'src/**/*.html',
    'src/**/*.js',
    'src/**/*.jsx',
    'src/**/*.mjs',
    'src/**/*.svelte',
    'src/**/*.svg',
    'src/**/*.ts',
    'src/**/*.tsx',
  ],
  debug,
  // TODO: Add documentation about how to work with minna-ui components
  // exclude = [/node_modules\/@minna-ui/],
  exclude,
  include = [/\.(p|post)?css$/],
  ...options
}: PurgecssOptions & Partial<Purgecss.Options> = {}): rollup.Plugin {
  const filter = createFilter(include, exclude);

  return {
    name: 'purgecss',

    transform(code, id) {
      if (!filter(id)) return;

      try {
        const defaults = {
          content,
          keyframes: true,
          rejected: debug,
          whitelistPatternsChildren: [/svelte-/],
        };
        const opts = Object.assign(defaults, options, {
          css: [
            {
              extension: 'css',
              raw: code,
            },
          ],
        });

        const result = new Purgecss(opts).purge()[0];

        if (result.rejected && result.rejected.length) {
          // eslint-disable-next-line no-console
          console.log('[purgecss] Rejected selectors', id, result.rejected);
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
