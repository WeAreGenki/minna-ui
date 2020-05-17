/* eslint-disable no-restricted-syntax */

import merge from 'deepmerge';
import postcss, { CssSyntaxError } from 'postcss';
import postcssrc from 'postcss-load-config';
// @ts-expect-error - no included types
import syntax from 'postcss-scss';
import { Preprocessor } from 'svelte/types/compiler/preprocess';

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
  // @ts-expect-error - FIXME: Contribute types fix upstream
): Preprocessor => async ({ attributes, content, filename }) => {
  if (attributes.type !== 'text/postcss') return;

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
    const { plugins, options } = await postcssrc(context, filename);
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

    // eslint-disable-next-line consistent-return
    return {
      code: result.css,
      dependencies,
      map: result.map.toString(),
    };
  } catch (err) {
    if (err.name === 'CssSyntaxError') {
      process.stderr.write(
        (err as CssSyntaxError).message +
          (err as CssSyntaxError).showSourceCode(),
      );
    } else {
      throw err;
    }
  }
};
