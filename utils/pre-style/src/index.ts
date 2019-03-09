/* eslint-disable jsdoc/valid-types */

import merge from 'deepmerge';
import { dirname, join } from 'path';
import postcssLoadConfig from 'postcss-load-config';
import postcss from 'postcss';

interface ISveltePreprocessOpts {
  attributes: {
    type: string;
    [x: string]: string;
  };
  content: string;
  filename: string;
}

/**
 * Minna UI svelte style preprocessor.
 * @param opts PostCSS options.
 */
export = (opts: postcss.ProcessOptions = {}) => async ({
  attributes,
  content,
  filename,
}: ISveltePreprocessOpts) => {
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

    let dependencies: string[] = [];

    if (result.map && filename) {
      // pass through dependent files so rollup can monitor them for changes
      const basePath = dirname(filename);
      // @ts-ignore
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
