'use strict';

const merge = require('deepmerge');
const { dirname, join } = require('path');
const postcssLoadConfig = require('postcss-load-config');
const postcss = require('postcss');

/**
 * Svelte style preprocessor.
 */
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

    result.warnings().forEach((warn) => {
      /* eslint-disable-next-line no-console */ /* tslint:disable-next-line no-console */
      console.warn(warn.toString());
    });

    // pass through dependent files so rollup can monitor them for changes
    const basePath = dirname(filename);
    const dependencies = result.map
      ? result.map._sources._array.map(dep => join(basePath, dep)) // eslint-disable-line no-underscore-dangle
      : null;

    /* eslint-disable-next-line consistent-return */
    return {
      dependencies,
      code: result.css,
      map: result.map,
    };
  } catch (error) {
    /* istanbul ignore else */
    if (error.name === 'CssSyntaxError') {
      process.stderr.write(error.message + error.showSourceCode());
    } else {
      /* eslint-disable-next-line no-console */ /* tslint:disable-next-line no-console */
      console.error('[PRE-STYLE] Error', error);
    }
  }
};
