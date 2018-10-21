'use strict';

const merge = require('deepmerge');
const postcssLoadConfig = require('postcss-load-config');
const postcss = require('postcss');
const parser = require('postcss-selector-parser');

/**
 * Svelte style preprocessor.
 */
/* istanbul ignore next */
module.exports = (context = {}) => async ({ attributes, content, filename }) => {
  if (attributes.type !== 'text/postcss' && !attributes.global) return;

  const processorCtx = {
    from: filename,
    to: filename,
    map: { inline: false, annotation: false },
  };

  // FIXME: Preserve banner, svelte removes it
  const source = context.banner ? context.banner + content : content;
  let options;
  let result;

  try {
    /**
     * Compile PostCSS code into CSS.
     */
    if (attributes.type === 'text/postcss') {
      const config = await postcssLoadConfig(merge(processorCtx, context));
      options = config.options; // eslint-disable-line prefer-destructuring

      result = await postcss(config.plugins).process(source, options);

      result.warnings().forEach((warn) => {
        /* istanbul ignore next */
        process.stderr.write(`${warn.toString()}\n`);
      });
    }

    /**
     * Add global pseudo & normalise selector whitespace.
     */
    if (attributes.global) {
      result = await postcss([(root) => {
        root.walkRules(async (rule) => {
          const newSelectors = await parser((selectors) => {
            // selectors.each((node) => {
            selectors.each((container) => {
              const selector = container.toString();

              // only override selectors which are not already global
              if (selector.indexOf(':global') !== 0) {
                // wrap the first part of the selector in a global pseudo element
                const firstNode = container.first;
                container.insertBefore(firstNode, parser.pseudo({ value: ':global(' }));
                container.insertAfter(firstNode, parser.pseudo({ value: ')' }));
              }
            });
          }).process(rule, { lossless: false });
          rule.selectors = newSelectors.split(','); // eslint-disable-line no-param-reassign
        });
      }]).process(result && result.css ? result.css : source, options || processorCtx);

      result.warnings().forEach((warn) => {
        /* istanbul ignore next */
        process.stderr.write(`${warn.toString()}\n`);
      });
    }

    return { // eslint-disable-line consistent-return
      code: result.css,
      map: result.map,
    };
  } catch (error) {
    /* istanbul ignore else */
    if (error.name === 'CssSyntaxError') {
      process.stderr.write(error.message + error.showSourceCode());
    } else {
      throw error;
    }
  }
};
