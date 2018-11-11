// TODO: Document that this plugin expects there to be only one output JS file

'use strict';

const { existsSync, readFileSync, writeFile } = require('fs');
const path = require('path');
const { createFilter } = require('rollup-pluginutils');
const catchErr = require('./catchErr.js');

/**
 * Ultra-minimal template engine.
 * @see https://github.com/Drulac/template-literal
 * @param {string} template A HTML template to compile.
 * @returns {Function}
 */
function compileTemplate(template) {
  return new Function('d', 'return `' + template + '`'); // eslint-disable-line
}

/**
 * Rollup plugin to generate HTML from a template and write it to disk.
 * @param {object} opts
 * @param {string} opts.file Path where to save the generated HTML file.
 * @param {string=} opts.basePath Path prefix for static files.
 * @param {(string|Promise<string>)=} opts.content Page HTML content. `%CSS%` and
 * `%JS%` will be replaced with tags referencing the files.
 * @param {Array<string>=} opts.exclude Files to exclude from CSS processing.
 * @param {Array<string>=} opts.include Files to include in CSS processing.
 * @param {boolean=} opts.inlineCss Should CSS be injected into the page instead
 * of saving an external file?
 * @param {function(string): (string|Promise<string>)=} opts.onCss Custom hook to
 * minify or post-processes CSS. Takes a function which has a `css` property and
 * returns the new CSS string. By default this does nothing.
 * @param {string=} opts.scriptAttr Attribute/s to add to script tag.
 * @param {string=} opts.template Absolute file path to a HTML document template
 * file or the template as a string.
 * @param {string=} opts.title Page title.
 * @param {...any=} opts.data Any other data you want available in the template.
 */
function makeHtml({
  file,
  basePath = '/',
  content = '%CSS%\n%JS%',
  exclude,
  include = ['**/*.css'],
  inlineCss = false,
  onCss = css => css,
  scriptAttr = 'defer',
  template = path.join(__dirname, 'template.html'),
  title,
  ...data
}) {
  const filter = createFilter(include, exclude);

  // if `template` is a path and the file exists use its content otherwise assume
  // that `template` is the actual template content itself
  const htmlTemplate = existsSync(template)
    ? readFileSync(template, 'utf8')
    : template;

  /** @type {Object<string, string>} */
  const styles = {};

  return {
    name: 'makeHtml',

    transform(source, id) {
      if (!filter(id)) return;

      styles[id] = source;

      return ''; // eslint-disable-line consistent-return
    },

    async generateBundle(outputOpts, bundle) {
      // combine all style sheets
      let css = '';
      for (const id in styles) { // eslint-disable-line
        css += styles[id] || '';
      }

      if (typeof onCss === 'function') {
        css = await Promise.resolve(onCss(css));

        /* eslint-disable-next-line no-console */
        if (!css) this.warn('onCss didn\'t return anything useful');
      }

      const jsFile = Object.values(bundle)[0].fileName || outputOpts.file;
      const cssFile = jsFile.replace(/js$/, 'css');

      /* eslint-disable-next-line no-nested-ternary */
      const cssResult = !css.length
        ? ''
        : inlineCss
          ? `<style>${css}</style>`
          : `<link href=${basePath}${cssFile} rel=stylesheet>`;

      let body = await Promise.resolve(content);
      body = body.replace('%CSS%', cssResult);
      body = body.replace('%JS%', `<script src=${basePath}${jsFile} ${scriptAttr}></script>`);

      const html = compileTemplate(htmlTemplate)({
        content: body,
        title,
        ...data,
      }).trim();

      if (!inlineCss) {
        const cssOut = outputOpts.dir
          ? path.join(outputOpts.dir, cssFile)
          : cssFile;

        // write CSS file
        writeFile(path.join(process.cwd(), cssOut), css, catchErr);
      }

      const fileOut = outputOpts.dir
        ? path.join(outputOpts.dir, file)
        : file;

      // write HTML file
      writeFile(path.join(process.cwd(), fileOut), html, catchErr);
    },
  };
}

module.exports = makeHtml;
