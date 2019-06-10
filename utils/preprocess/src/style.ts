/* eslint-disable no-restricted-syntax */

import merge from 'deepmerge';
import postcss from 'postcss';
import postcssLoadConfig from 'postcss-load-config';
import syntax from 'postcss-scss';
import { Preprocessor } from 'svelte/types/preprocess';

interface StylePreprocessorOptions extends postcss.ProcessOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins?: postcss.Plugin<any>[];
}

/**
 * Minna UI svelte style preprocessor.
 * Processes style blocks with a `type="text/postcss"` attribute using PostCSS.
 *
 * @param opts - PostCSS options.
 */
export const style = (
  opts: StylePreprocessorOptions = {},
  // @ts-ignore - FIXME: Contribute types fix upstream
): Preprocessor => async ({ attributes, content, filename }) => {
  if (attributes.type !== 'text/postcss') return null;

  // Merge user provided options into default context
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

  try {
    const { plugins, options } = await postcssLoadConfig(context, filename);
    const result = await postcss(plugins).process(content, options);

    for (const err of result.warnings()) {
      // eslint-disable-next-line no-console
      console.warn(err.toString());
    }

    const dependencies: string[] = [];

    // Register dependencies for Rollup to detect changes
    for (const msg of result.messages) {
      if (msg.type === 'dependency') {
        dependencies.push(msg.file);
      }
    }

    return {
      code: result.css,
      dependencies,
      map: result.map.toString(),
    };
  } catch (err) {
    if (err.name === 'CssSyntaxError') {
      const { message, showSourceCode } = err as postcss.CssSyntaxError;
      process.stderr.write(message + showSourceCode());
    } else {
      // eslint-disable-next-line no-console
      throw console.error(err);
    }
  }
};
