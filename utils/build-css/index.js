/**
 * Tool to compile minna-ui CSS packages.
 */

'use strict';

/* istanbul ignore next */
const fs = require('fs');
const { basename, dirname } = require('path');
const { promisify } = require('util');
const del = require('del');
const postcssLoadConfig = require('postcss-load-config');
const postcss = require('postcss');
const CleanCSS = require('clean-css');

const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

/**
 * Print a list of warnings or errors to the process stderr.
 * @param {string} origin Which lib the warning came from.
 * @param {string} level The severity of either WARN or ERR.
 * @param {Array} warnings List of warnings to iterate over.
 */
const compileWarn = (origin, level, warnings) => {
  warnings.forEach((err) => {
    process.stderr.write(`[${origin}] ${level}: ${err.toString()}\n`);
  });
};

/**
 * Remove old dist directory and make a new dist directory.
 * @param {string} dir The dist directory.
 */
function cleanDistDir(dir) {
  if (/dist$/.test(dir)) {
    fs.stat(dir, async (err) => {
      if (err) {
        // dir doesn't exist, make new dir
        await mkdir(dir);
      } else {
        // dir does exist, remove first and then make new dir
        await del([dir]);
        await mkdir(dir);
      }
    });
  }
}

module.exports = async function run(env) {
  process.env.NODE_ENV = env.NODE_ENV || 'production';
  const version = env.npm_package_version;
  const homepage = env.npm_package_homepage;
  const src = env.npm_package_main;
  const out = env.npm_package_style;

  const licence = 'https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE';
  const banner = `/*!
 * minna-ui v${version} | ${homepage}
 * Copyright ${new Date().getFullYear()} We Are Genki
 * Licensed under Apache 2.0 - ${licence}
 */\n`;

  try {
    cleanDistDir(dirname(out));

    const source = readFile(src, 'utf8');

    const { plugins, options } = await postcssLoadConfig({
      from: src,
      to: out,
      map: { inline: false },
    });

    // compile PostCSS into CSS
    const sourceCss = banner + (await source);
    const result = await postcss(plugins).process(sourceCss, options);

    compileWarn('PostCSS', 'WARN', result.warnings());

    // minify resulting CSS
    const min = await new CleanCSS({
      returnPromise: true,
      sourceMap: true,
      level: {
        1: { all: true },
        2: { all: true },
      },
    }).minify(result.css, result.map.toString());

    compileWarn('CleanCSS', 'ERR', min.errors);
    compileWarn('CleanCSS', 'WARN', min.warnings);

    // clean-css removes the source map comment so we need to add it back in
    const annotation = `\n/*# sourceMappingURL=${basename(options.to)}.map */`;

    writeFile(options.to, min.styles.toString() + annotation);
    writeFile(`${options.to}.map`, min.sourceMap.toString());
  } catch (error) {
    /* istanbul ignore else */
    if (error.name === 'CssSyntaxError') {
      process.stderr.write(error.message + error.showSourceCode());
    } else {
      throw error;
    }
  }
};
