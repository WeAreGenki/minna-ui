'use strict';

const merge = require('deepmerge');
const postcssLoadConfig = require('postcss-load-config');
const postcss = require('postcss');

/**
 * Svelte style preprocessor.
 */
/* istanbul ignore next */
module.exports = (context = {}) => async ({ attributes, content, filename }) => {
  if (attributes.type !== 'text/postcss') return;

  const defaultContext = {
    from: filename,
    to: filename,
    map: { inline: false, annotation: false },
  };

  /**
   * Compile PostCSS code into CSS.
   */
  try {
    const config = await postcssLoadConfig(merge(defaultContext, context));
    const result = await postcss(config.plugins).process(content, config.options);

    result.warnings().forEach((warn) => {
      /* istanbul ignore next */
      console.warn(warn.toString()); // eslint-disable-line no-console
    });

    return { // eslint-disable-line consistent-return
      code: result.css,
      map: result.map,
    };
  } catch (error) {
    /* istanbul ignore else */
    if (error.name === 'CssSyntaxError') {
      process.stderr.write(error.message + error.showSourceCode());
    } else {
      console.error('[PRE-STYLE] Error', error); // eslint-disable-line no-console
    }
  }
};
