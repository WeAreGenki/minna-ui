'use strict';

const merge = require('deepmerge');
const postcssLoadConfig = require('postcss-load-config');
const postcss = require('postcss');

/**
 * Svelte style preprocessor.
 */
/* istanbul ignore next */
module.exports = (context = {}) => async ({
  attributes,
  content,
  filename,
}) => {
  if (attributes.type !== 'text/postcss') return;

  // merge user provided context into defaults
  const ctx = merge(
    {
      from: filename,
      to: filename,
      /* tslint:disable-next-line object-literal-sort-keys */
      map: { inline: false, annotation: false },
    },
    context,
  );

  /**
   * Compile PostCSS code into CSS.
   */
  try {
    const { plugins, options } = await postcssLoadConfig(ctx);
    const result = await postcss(plugins).process(content, options);

    result.warnings().forEach(warn => {
      /* tslint:disable-next-line no-console */
      console.warn(warn.toString()); // eslint-disable-line no-console
    });

    /* eslint-disable-next-line consistent-return */
    return {
      code: result.css,
      map: result.map,
    };
  } catch (error) {
    /* istanbul ignore else */
    if (error.name === 'CssSyntaxError') {
      process.stderr.write(error.message + error.showSourceCode());
    } else {
      /* tslint:disable-next-line no-console */
      console.error('[PRE-STYLE] Error', error); // eslint-disable-line no-console
    }
  }
};
