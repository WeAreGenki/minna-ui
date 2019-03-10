import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import mediaQueryPacker from 'css-mqpacker';
import merge from 'deepmerge';
import postcss from 'postcss';
import advancedVars from 'postcss-advanced-variables';
// @ts-ignore FIXME: TS can't deal with mjs correctly yet
import colorModFunction from 'postcss-color-mod-function';
import nested from 'postcss-nested';
import atUse from 'postcss-use';
import { resolve as importResolve } from './css-import-resolve';

// TODO: Could/should this be cached on disk for faster rebulds?
const importCache = {};

interface IPluginOptions {
  /** Show useful debugging feedback (e.g. unresolved variables). */
  debug?: boolean;
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
   * Apply potentially unsafe transformations (e.g. combining same `@media`).
   */
  unsafe?: boolean;
  /**
   * Any other options will be passed to all PostCSS plugins and to the
   * `nanocss` preset options.</br></br>This can be particuarly powerful if
   * you need to pass options when using the `@use` rule — use the plugin
   * name as a key, as shown in the
   * [postcss-use docs](https://github.com/postcss/postcss-use#options-1).
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any[];
}

/**
 * PostCSS configuration preset for minna-ui projects.
 */
export = postcss.plugin(
  'minna-ui',
  ({
    debug = true,
    importPaths = [process.cwd(), 'src', 'src/css'],
    optimize = process.env.NODE_ENV === 'production',
    unsafe = false,
    ...options
  }: IPluginOptions = {}) => {
    let plugins = [advancedVars, atUse, nested, colorModFunction];

    if (optimize) {
      plugins = plugins.concat([
        unsafe && mediaQueryPacker,
        autoprefixer,
        cssnano,
      ]);
    }

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
        importResolve,
        unresolved: debug ? 'warn' : 'ignore',

        // postcss-use
        modules: '*',
        resolveFromFile: true,

        // autoprefixer
        grid: true, // IE 11 support
        flexbox: 'no-2009',
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