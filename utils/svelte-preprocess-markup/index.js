'use strict';

const htmlMinifier = require('html-minifier');

/**
 * Svelte markup preprocessor to minify HTML.
 */
module.exports = (options = {}) => ({ content }) => {
  const { unsafe } = options;

  try {
    const code = htmlMinifier.minify(content, Object.assign({
      caseSensitive: true,
      collapseWhitespace: true,
      conservativeCollapse: !unsafe,
      ignoreCustomFragments: [/\{[^]*?\}/m],
      keepClosingSlash: true,

      // potentially dangerous
      collapseBooleanAttributes: unsafe,
      collapseInlineTagWhitespace: unsafe,
      removeOptionalTags: unsafe,
      removeRedundantAttributes: unsafe,
      removeScriptTypeAttributes: unsafe,
      removeStyleLinkTypeAttributes: unsafe,
      sortAttributes: unsafe,
      sortClassName: unsafe,
    }, options));

    return { code };
  } catch (error) {
    process.stderr.write(error);
    return content;
  }
};
