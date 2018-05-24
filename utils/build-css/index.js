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
    /* istanbul ignore if */
    if (!/^Ignoring local source map at/.test(err)) {
      process.stderr.write(`[${origin}] ${level}: ${err.toString()}\n`);
    }
  });
};

/**
 * Remove old dist directory and make a new dist directory.
 * @param {string} dir The dist directory.
 */
function cleanDistDir(dir) {
  /* istanbul ignore else */
  if (dir !== process.cwd()) {
    fs.stat(dir, (err) => {
      if (!err) {
        del.sync([dir]);
      }
      fs.mkdirSync(dir);
    });
  }
}

module.exports = async function run(env) {
  process.env.NODE_ENV = env.NODE_ENV || 'production';
  const pkgName = env.npm_package_name;
  const pkgVersion = env.npm_package_version;
  const pkgHomepage = env.npm_package_homepage;
  // const pkgBrowser = env.npm_package_browser; // currently same as env.npm_package_style
  const pkgStyle = env.npm_package_style;
  const pkgMain = env.npm_package_main;

  const banner = `/*!
 * ${pkgName} v${pkgVersion} - ${pkgHomepage}
 * Copyright ${new Date().getFullYear()} We Are Genki
 * Licensed under Apache 2.0 - https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE
 */
`;

  try {
    cleanDistDir(dirname(pkgStyle));

    const source = await readFile(pkgMain, 'utf8');

    const { plugins, options } = await postcssLoadConfig({
      from: pkgMain,
      to: pkgStyle,
      map: { inline: false },
    });

    const sourceCss = banner + source;
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
    min.styles = `${min.styles}\n/*# sourceMappingURL=${basename(options.to)}.map */`;

    writeFile(options.to, min.styles);
    writeFile(`${options.to}.map`, min.sourceMap.toString());

    return {
      result,
      min,
    };
  } catch (error) {
    process.stderr.write(`[PostCSS] ERR: ${error.message}:\n${error.showSourceCode()}`);
    throw new Error(error);
  }
};
