import merge from 'deepmerge';
import postcss from 'postcss';
import postcssLoadConfig from 'postcss-load-config';
import syntax from 'postcss-scss';
// eslint-disable-next-line import/named
import { Preprocessor } from './types';

/**
 * Minna UI svelte style preprocessor.
 * @param opts PostCSS options.
 */
export const style = (
  opts: postcss.ProcessOptions = {},
): Preprocessor => async ({ attributes, content, filename }) => {
  if (attributes.type !== 'text/postcss') return;

  // merge user provided options into default context
  const context = merge(
    {
      from: filename,
      map: {
        annotation: false,
        inline: false,
      },
      syntax,
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

    const dependencies: string[] = [];

    // register dependencies so rollup can monitor them for changes
    // eslint-disable-next-line no-restricted-syntax
    for (const msg of result.messages) {
      if (msg.type === 'dependency') {
        dependencies.push(msg.file);
      }
    }

    // eslint-disable-next-line consistent-return
    return {
      code: result.css,
      dependencies,
      map: result.map,
    };
  } catch (err) {
    if (err.name === 'CssSyntaxError') {
      process.stderr.write(err.message + err.showSourceCode());
    } else {
      // eslint-disable-next-line no-console
      console.error(err);
      throw err;
    }
  }
};