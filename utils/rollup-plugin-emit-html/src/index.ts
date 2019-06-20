// TODO: Add support for CSS source maps

/* eslint-disable security/detect-object-injection */

import CleanCSS from 'clean-css';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';

interface EmitHtmlOptions {
  /** Path prefix for files in URLs (e.g. in script.src). */
  basePath?: string;
  /**
   * Document HTML content. `%CSS%` and `%JS%` will be replaced with tags
   * referencing the files.
   */
  content?: string | Promise<string>;
  /** Files to exclude from CSS processing. */
  exclude?: RegExp[] | string[];
  /** Files to include in CSS processing. */
  include?: RegExp[] | string[];
  /** Inline CSS code instead of emiting to seperate file. */
  inlineCss?: boolean;
  /**
   * Perform output code optimisations (e.g. CSS minification). You can
   * optionally use an object to pass through options to the optimizer/s.
   */
  optimize?: boolean | CleanCSS.OptionsOutput;
  /** Attribute/s to add to script tag. */
  scriptAttr?: string;
  /** Path to a HTML document template file or the template as a string. */
  template?: string;
  /** Document title. */
  title?: string;
  /** Any other data you want available in the template. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
}

/**
 * Ultra-minimal template engine.
 *
 * @see https://github.com/Drulac/template-literal
 *
 * @param template - A HTML template to compile.
 */
export function compileTemplate(template: string): Function {
  // eslint-disable-next-line
  return new Function('d', 'return `' + template + '`');
}

/**
 * Emit HTML Rollup plugin.
 * Generates HTML from a template, injects entry scripts, and combines CSS,
 * optionally inlining it. Emits all assets back to Rollup for futher
 * processing or to save to disk. The asset names will be based on
 * `rollup#output.name` if defined otherwise they'll be the same base name as
 * the first `.js` bundle file.
 */
export function emitHtml({
  basePath = '',
  content = '%CSS%\n%JS%',
  exclude,
  include = [/\.(p|post)?css$/],
  inlineCss = false,
  optimize = process.env.NODE_ENV === 'production',
  scriptAttr = 'defer',
  template = join(__dirname, '../src/template.html'),
  title,
  ...data
}: EmitHtmlOptions = {}): rollup.Plugin {
  const filter = createFilter(include, exclude);

  // if `template` is a path and the file exists use its content otherwise
  // assume that `template` is the actual template content itself
  const htmlTemplate = existsSync(template)
    ? readFileSync(template, 'utf8')
    : template;

  const styles: { [id: string]: string } = {};

  return {
    name: 'emit-html',

    transform(code, id) {
      if (!filter(id)) return;

      styles[id] = code;

      return ''; // eslint-disable-line consistent-return
    },

    // eslint-disable-next-line sort-keys
    async generateBundle(outputOpts, bundle) {
      const minifyCss = (css: string): string => {
        const cleancss = new CleanCSS({
          sourceMap: false, // TODO: Add source map support
          ...(typeof optimize === 'object' ? optimize : {}),
        });

        const result = cleancss.minify(css);

        result.warnings.forEach((err) => this.warn(err));
        result.errors.forEach((err) => this.error(err));

        return result.styles;
      };

      try {
        // combine all style sheets
        let css = '';
        // eslint-disable-next-line
        for (const id in styles) {
          css += styles[id] || '';
        }

        if (optimize) {
          css = minifyCss(css);
        }

        const jsFiles = Object.values(bundle).filter(
          // @ts-ignore FIXME: Work how to best work with discriminating unions, ideally without type casting
          (chunk) => chunk.isEntry && chunk.fileName.endsWith('.js'),
        );

        const scripts: string[] = [];

        jsFiles.forEach(({ fileName }) => {
          scripts.push(
            `<script src=${basePath}${fileName} ${scriptAttr}></script>`,
          );
        });

        const name =
          outputOpts.name || jsFiles[0].fileName.replace(/\.js$/, '');
        const cssFile = `${name}.css`;
        const htmlFile = `${name}.html`;

        // eslint-disable-next-line no-nested-ternary
        const cssResult = !css.length
          ? ''
          : inlineCss
          ? `<style>${css}</style>`
          : `<link href=${basePath}${cssFile} rel=stylesheet>`;

        let body = await Promise.resolve(content);
        body = body.replace('%CSS%', cssResult);
        body = body.replace('%JS%', scripts.join('\n'));

        const html = compileTemplate(htmlTemplate)({
          content: body,
          title,
          ...data,
        }).trim();

        if (!inlineCss) {
          this.emitAsset(cssFile, css);
        }

        this.emitAsset(htmlFile, html);
      } catch (err) {
        this.error(err);
      }
    },
  };
}

export default emitHtml;
