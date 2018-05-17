'use strict';

const postcssLoadConfig = require('postcss-load-config');
const postcss = require('postcss');
const parser = require('postcss-selector-parser');

/**
 * Svelte style preprocessor.
 */
module.exports = (context = {}) => async ({ attributes, content, filename }) => {
  if (attributes.type !== 'text/postcss' && !attributes.global) return;

  const processorCtx = {
    from: filename,
    to: filename,
    map: { inline: false, annotation: false },
  };

  let options;
  let result;

  try {
    /**
     * Compile PostCSS code into CSS.
     */
    if (attributes.type === 'text/postcss') {
      const config = await postcssLoadConfig(Object.assign(processorCtx, context));
      options = config.options; // eslint-disable-line prefer-destructuring

      // FIXME: Preserve banner, svelte removes it + add a test for the banner
      const source = context.banner ? context.banner + content : content;
      result = await postcss(config.plugins).process(source, options);

      result.warnings().forEach((warn) => {
        process.stderr.write(`${warn.toString()}\n`);
      });
    }

    /**
     * Add global pseudo & normalise selector whitespace.
     */
    if (attributes.global) {
      result = await postcss([(root) => {
        root.walkRules((rule) => {
          const newSelectors = parser((selectors) => {
            // selectors.each((node) => {
            selectors.each((container) => {
              const selector = container.toString();

              // only override selectors which are not already global
              if (selector.indexOf(':global') !== 0 && selector.indexOf('-global-') !== 0) {
                // wrap the first part of the selector in a global pseudo element
                const firstNode = container.first;
                container.insertBefore(firstNode, parser.pseudo({ value: ':global(' }));
                container.insertAfter(firstNode, parser.pseudo({ value: ')' }));
              }
            });
          // FIXME: Refactor this to use the async API - process() instead of processSync()
          }).processSync(rule, { lossless: false });
          rule.selectors = newSelectors.split(','); // eslint-disable-line no-param-reassign
        });
      }]).process(result.css, options || processorCtx);

      result.warnings().forEach((warn) => {
        process.stderr.write(`${warn.toString()}\n`);
      });
    }

    return { // eslint-disable-line consistent-return
      code: result.css,
      map: result.map,
    };
  } catch (error) {
    if (error.name === 'CssSyntaxError') {
      process.stderr.write(error.message + error.showSourceCode());
    } else {
      throw error;
    }
  }
};
