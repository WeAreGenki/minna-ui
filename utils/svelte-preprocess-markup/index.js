// https://github.com/kangax/html-minifier

'use strict';

const htmlMinifier = require('html-minifier');

/**
 * Svelte markup preprocessor to remove excessive whitespace from Svelte output.
 */
module.exports = (options = {}) => ({ content }) => {
  const { unsafeWhitespace, unsafe } = options;

  try {
    const code = htmlMinifier.minify(content, Object.assign({
      // XXX: Bad options: removeAttributeQuotes, removeOptionalTags
      // XXX: Unnecessary options: removeComments

      html5: true,
      caseSensitive: true,
      collapseWhitespace: true,
      conservativeCollapse: !unsafeWhitespace,
      ignoreCustomFragments: [
        // REF: https://dassur.ma/things/regexp-quote/

        // svelte {...} tags and attributes
        /\{([^}"\\]|\\.)*\}/su,

        // sapper %...% template tags
        /%.+%/su,
      ],
      keepClosingSlash: true,

      // event attributes which contain "javascript: ..." will be minified
      customEventAttributes: [
        // regular html
        /^on[a-z]{3,}$/su,

        // svelte
        /^bind:\S+$/su,
        /^in:\S+$/su,
        /^on:\S+$/su,
        /^out:\S+$/su,
        /^ref:\S+$/su,
        /^transition:\S+$/su,
        /^use:\S+$/su,
      ],

      // potentially dangerous
      collapseBooleanAttributes: unsafe,
      collapseInlineTagWhitespace: unsafe,
      decodeEntities: unsafe,
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
