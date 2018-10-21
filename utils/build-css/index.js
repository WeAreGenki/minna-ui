/**
 * Tool to compile minna-ui CSS packages.
 */

'use strict';

const fs = require('fs');
const { basename, dirname, join } = require('path');
const { promisify } = require('util');
const del = require('del');
const postcssLoadConfig = require('postcss-load-config');
const postcss = require('postcss');
const CleanCSS = require('clean-css');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

/**
 * Print a list of warnings or errors to the process stderr.
 * @param {string} origin Which lib the warning came from.
 * @param {string} level The severity of either WARN or ERR.
 * @param {Array} warnings List of warnings to iterate over.
 */
const compileWarn = (origin, level, warnings) => {
  /* istanbul ignore if */
  if (warnings.length && level === 'ERR') {
    process.exitCode = 1; // prevents tests running too long
  }

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

/**
 *
 * @param {object} opts
 * @param {string} opts.from
 * @param {string} opts.to
 * @param {string} opts.banner
 */
async function processCss({ from, to, banner }) {
  try {
    const src = await readFile(from, 'utf8');

    const { plugins, options } = await postcssLoadConfig({
      from,
      to,
      map: { inline: false },
    });

    const sourceCss = banner + src;
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
    if (error.showSourceCode) {
      process.stderr.write(`[PostCSS] ERROR: ${error.message}:\n${error.showSourceCode()}`);
    }
    throw error;
  }
}

module.exports = async function run(env, argv) {
  process.env.NODE_ENV = env.NODE_ENV || 'production';
  const pkgName = env.npm_package_name;
  const pkgVersion = env.npm_package_version;
  const pkgHomepage = env.npm_package_homepage;
  // const pkgBrowser = env.npm_package_browser; // currently same as env.npm_package_style
  const pkgStyle = env.npm_package_style;
  const pkgMain = env.npm_package_main;

  const cssBanner = `/*!
 * ${pkgName} v${pkgVersion} - ${pkgHomepage}
 * Copyright ${new Date().getFullYear()} We Are Genki
 * Apache 2.0 license - https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE
 */
`;

  const inputDir = argv[2];
  const outputDir = argv[3];
  const noClean = argv.includes('--no-clean');
  const noBanner = argv.includes('--no-banner');
  const banner = noBanner ? '' : cssBanner;
  /** @type {Array<string>} */
  const inputCss = [];
  /** @type {Array<string>} */
  const outputCss = [];

  if (!inputDir) {
    if (!pkgStyle && !pkgMain) throw new Error('No input file or directory specified!');

    inputCss.push(pkgMain);
    outputCss.push(pkgStyle);
  } else {
    if (!outputDir) throw new Error('No output directory specified!');

    const dirFiles = await readdir(inputDir);
    const cssFiles = dirFiles.filter(
      fileName => fileName !== 'import.css' && !fileName.startsWith('_') && fileName.endsWith('.css'),
    );

    cssFiles.forEach((fileName) => {
      inputCss.push(join(inputDir, fileName));
      outputCss.push(join(outputDir, fileName));
    });
  }

  if (!noClean) {
    cleanDistDir(outputDir || dirname(pkgStyle));
  }

  const results = [];

  for (let index = 0; index < inputCss.length; index += 1) {
    const from = inputCss[index];
    const to = outputCss[index];

    const result = processCss({ from, to, banner });
    results.push(result);
  }

  return Promise.all(results);
};
