// TODO: Document that this plugin expects there to be only one output JS file
// or improve how this plugin works

/* eslint-disable security/detect-object-injection */

import { existsSync, readFileSync, writeFile } from 'fs';
import { isAbsolute, join } from 'path';
import rollup from 'rollup';
import { createFilter } from 'rollup-pluginutils';
import { catchErr } from './catchErr';

interface IMakeHtmlOptions {
  basePath?: string;
  content?: string | Promise<string>;
  exclude?: string[];
  file: string;
  fileCss: string;
  include?: string[];
  inlineCss?: boolean;
  scriptAttr?: string;
  template?: string;
  title?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];
  onCss?(css: string): string | Promise<string>;
}

interface IStyles {
  [x: string]: string;
}

/**
 * Ultra-minimal template engine.
 * @see https://github.com/Drulac/template-literal
 * @param template A HTML template to compile.
 */
function compileTemplate(template: string): Function {
  // eslint-disable-next-line
  return new Function('d', 'return `' + template + '`');
}

/**
 * Rollup plugin to generate HTML from a template and write it to disk.
 * @param opts User defined options.
 * @param opts.basePath Path prefix for static files.
 * @param opts.content Page HTML content. `%CSS%` and `%JS%` will be replaced
 * with tags referencing the files.
 * @param opts.exclude Files to exclude from CSS processing.
 * @param opts.file Path where to save the generated HTML file.
 * @param opts.fileCss Optional path where to save the generated CSS file.
 * @param opts.include Files to include in CSS processing.
 * @param opts.inlineCss Should CSS be injected into the page instead of
 * saving an external file?
 * @param opts.onCss Custom hook to minify or post-processes CSS. Takes a
 * function which has a `css` property and returns the new CSS string. By
 * default this does nothing.
 * @param opts.scriptAttr Attribute/s to add to script tag.
 * @param opts.template Absolute file path to a HTML document template file or
 * the template as a string.
 * @param opts.title Page title.
 * @param opts.data Any other data you want available in the template.
 */
export function makeHtml({
  basePath = '/',
  content = '%CSS%\n%JS%',
  exclude,
  file,
  fileCss,
  include = ['**/*.css'],
  inlineCss = false,
  // prettier-ignore
  onCss = css => css,
  scriptAttr = 'defer',
  template = join(__dirname, 'template.html'),
  title,
  ...data
}: IMakeHtmlOptions): rollup.Plugin {
  const filter = createFilter(include, exclude);

  // if `template` is a path and the file exists use its content otherwise
  // assume that `template` is the actual template content itself
  const htmlTemplate = existsSync(template)
    ? readFileSync(template, 'utf8')
    : template;

  const styles: IStyles = {};

  return {
    name: 'makeHtml',

    transform(source, id) {
      if (!filter(id)) return;

      styles[id] = source;

      return ''; // eslint-disable-line consistent-return
    },

    // eslint-disable-next-line sort-keys
    async generateBundle(outputOpts, bundle) {
      // combine all style sheets
      let css = '';
      // eslint-disable-next-line
      for (const id in styles) {
        css += styles[id] || '';
      }

      if (typeof onCss === 'function') {
        css = await Promise.resolve(onCss(css));

        // eslint-disable-next-line no-console
        if (!css) this.warn("onCss didn't return anything useful");
      }

      const jsFile = Object.values(bundle)[0].fileName || outputOpts.file;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const cssFile = jsFile!.replace(/js$/, 'css');

      // eslint-disable-next-line no-nested-ternary
      const cssResult = !css.length
        ? ''
        : inlineCss
        ? `<style>${css}</style>`
        : `<link href=${basePath}${cssFile} rel=stylesheet>`;

      let body = await Promise.resolve(content);
      body = body.replace('%CSS%', cssResult);
      body = body.replace(
        '%JS%',
        `<script src=${basePath}${jsFile} ${scriptAttr}></script>`,
      );

      const html = compileTemplate(htmlTemplate)({
        content: body,
        title,
        ...data,
      }).trim();

      if (!inlineCss) {
        const cssOut =
          fileCss || outputOpts.dir ? join(outputOpts.dir, cssFile) : cssFile;

        // write CSS file
        writeFile(
          isAbsolute(cssOut) ? cssOut : join(process.cwd(), cssOut),
          css,
          catchErr,
        );
      }

      const fileOut = outputOpts.dir ? join(outputOpts.dir, file) : file;

      // write HTML file
      writeFile(
        isAbsolute(fileOut) ? fileOut : join(process.cwd(), fileOut),
        html,
        catchErr,
      );
    },
  };
}
