/**
 * Custom ESLint Import Resolver.
 *
 * Resolves import paths in ESLint using the node resolve algorithm (provided
 * by the `resolve` package) with optional aliases. Based on the original
 * `eslint-plugin-import` package.
 *
 * @see https://github.com/browserify/resolve
 * @see https://github.com/benmosher/eslint-plugin-import/tree/master/resolvers/node
 */

'use strict';

const path = require('path');
const resolve = require('resolve');

exports.interfaceVersion = 2;

/**
 * @param {string} file - File which the import originates from.
 * @param {import('./types').ResolverOptions} config - User defined options.
 * @returns {import('./types').ResolverOptions} User options with defaults.
 */
function opts(file, config) {
  return Object.assign(config, {
    // path.resolve will handle paths relative to CWD
    basedir: path.dirname(path.resolve(file)),
  });
}

/**
 * @param {string} source - The imported source path.
 * @param {string} file - File which the import originates from.
 * @param {import('./types').ResolverOptions} config - User defined options.
 * @returns {import('./types').ResolverResult} The path if found.
 */
exports.resolve = (source, file, config) => {
  if (resolve.isCore(source)) {
    return { found: true, path: null };
  }

  Object.entries(config.alias).forEach(([alias, value]) => {
    // TODO: Optimise; it would be better to only create the re once
    // eslint-disable-next-line security/detect-non-literal-regexp
    const aliasRe = new RegExp(alias);

    if (aliasRe.test(source)) {
      // eslint-disable-next-line no-param-reassign
      source = source.replace(aliasRe, value);
    }
  });

  try {
    const resolvedPath = resolve.sync(source, opts(file, config));

    return { found: true, path: resolvedPath };
  } catch (err) {
    return { found: false };
  }
};
