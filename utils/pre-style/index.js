/* eslint-disable jsdoc/valid-types */

'use strict';

const merge = require('deepmerge');
const { dirname, join } = require('path');
const postcssLoadConfig = require('postcss-load-config');
const postcss = require('postcss');

/**
 * Minna UI svelte style preprocessor.
 * @param {import('postcss').ProcessOptions} opts PostCSS options.
 * @returns {Object}
 */
module.exports = (opts = {}) => async ({ attributes, content, filename }) => {
  if (attributes.type !== 'text/postcss') return;

  // merge user provided options into default context
  const context = merge(
    {
      from: filename,
      map: { annotation: false, inline: false },
      to: filename,
    },
    opts,
  );

  /**
   * Compile PostCSS code into CSS.
   */
  try {
    const { plugins, options } = await postcssLoadConfig(context);
    const result = await postcss(plugins).process(content, options);

    result.warnings().forEach((warn) => {
      // eslint-disable-next-line no-console
      console.warn(warn.toString());
    });

    /** @type {string[]} */
    let dependencies = [];

    if (result.map && filename) {
      // pass through dependent files so rollup can monitor them for changes
      const basePath = dirname(filename);
      // eslint-disable-next-line no-underscore-dangle
      dependencies = result.map._sources._array.map((dep) =>
        join(basePath, dep),
      );
    }

    // eslint-disable-next-line consistent-return
    return {
      code: result.css,
      dependencies,
      map: result.map,
    };
  } catch (error) {
    /* istanbul ignore else */
    if (error.name === 'CssSyntaxError') {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      process.stderr.write(error.message + error.showSourceCode());
    } else {
      // TODO: Throw an error to stop turther processing (?)
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }
};
