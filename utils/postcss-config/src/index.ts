import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import mediaQueryPacker from 'css-mqpacker';
import merge from 'deepmerge';
import flexbugFixes from 'postcss-flexbugs-fixes';
import postcss from 'postcss';
import advancedVars from 'postcss-advanced-variables';
// @ts-ignore - TODO: Uncomment once TS can deal with mjs correctly
import colorModFunction from 'postcss-color-mod-function';
import nested from 'postcss-nested';
import atUse from 'postcss-use';
import { aliasedResolve, ImportAlias } from './css-import-resolve';

const importCache = {};

interface PluginOptions {
  /**
   * Modify output for compatibility with the target browser defined in a
   * `browserslist` config.
   */
  compat?: boolean;
  /** Show useful debugging feedback (unresolved variables etc.). */
  debug?: boolean;
  /**
   * A map of import aliases. Given a matching regex key, will replace the
   * import path with the value.
   *
   * @example
   * { '^##\\/(.*)$': 'src/$1' }
   */
  importAlias?: ImportAlias;
  /**
   * A list of extra paths to search when resolving `@import` rules in CSS.
   * First, imports will try to resolve according to the
   * [CSS Import Resolve spec](https://jonathantneal.github.io/css-import-resolve/)
   * and then try again with each of the `importPaths`.
   */
  importPaths?: string[];
  /**
   * Perform optimisations to reduce output file size and minimise runtime
   * style computation.
   */
  optimize?: boolean;
  /**
   * Apply potentially unsafe transformations (combining same `@media` etc.).
   */
  unsafe?: boolean;
  /** Any additional $ variables you want to inject at build time. */
  variables?: Record<string, string | null | undefined>;
  /**
   * Any other options will be passed to all PostCSS plugins and to the
   * `nanocss` preset options.
   *
   * This can be particularly powerful if you need to pass options together
   * with the `@use` rule — use the plugin name as a key, as shown in the
   * [postcss-use docs](https://github.com/postcss/postcss-use#options-1).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any[];
}

/**
 * PostCSS configuration preset for Minna UI projects.
 */
export default postcss.plugin(
  'minna-ui',
  ({
    compat = true,
    debug = true,
    importAlias = { '^##\\/(.*)$': 'src/$1' },
    importPaths = [process.cwd(), 'src', 'src/css'],
    optimize = process.env.NODE_ENV === 'production',
    unsafe = false,
    variables = { env: process.env.NODE_ENV },
    ...options
  }: PluginOptions = {}) => {
    const plugins = [
      advancedVars,
      atUse,
      nested,
      colorModFunction,
      optimize && unsafe && mediaQueryPacker,
      compat && flexbugFixes,
      compat && autoprefixer,
      optimize && cssnano,
    ].filter(Boolean);

    const cssnanoOpts = merge(
      {
        calc: {
          warnWhenCannotResolve: debug,
        },
      },
      options,
    );
    /* eslint-disable sort-keys */
    const pluginOpts = merge(
      {
        // postcss-advanced-variables
        importCache,
        importPaths,
        importResolve: aliasedResolve(importAlias),
        unresolved: debug ? 'warn' : 'ignore',
        variables,

        // postcss-use
        modules: '*',
        resolveFromFile: true,

        // autoprefixer
        flexbox: 'no-2009',
        grid: 'autoplace', // IE 11 support
        remove: false,

        // cssnano
        preset: ['default', cssnanoOpts],
      },
      options,
    );
    /* eslint-enable */

    const initializedPlugins = plugins.map((plugin) => plugin(pluginOpts));

    // process CSS with plugins
    return (_, result) =>
      initializedPlugins.reduce(
        (promise, plugin) => promise.then(() => plugin(result.root, result)),
        Promise.resolve(),
      );
  },
);
