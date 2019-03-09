/**
 * Tool to compile minna-ui CSS packages.
 */

/* eslint-disable security/detect-non-literal-fs-filename, security/detect-object-injection */

import fs from 'fs';
import { basename, dirname, join } from 'path';
import { promisify } from 'util';
import del from 'del';
import postcssLoadConfig from 'postcss-load-config';
import postcss from 'postcss';
import CleanCSS from 'clean-css';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const readdir = promisify(fs.readdir);

/**
 * Print a list of warnings or errors to the process stderr.
 * @param origin Which lib the warning came from.
 * @param level The severity of either WARN or ERR.
 * @param warnings List of warnings to iterate over.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const compileWarn = (origin: string, level: string, warnings: any[]): void => {
  /* istanbul ignore if */
  if (warnings.length && level === 'ERR') {
    process.exitCode = 1; // prevents tests running too long
  }

  warnings.forEach((err) => {
    /* istanbul ignore if */
    if (!/^Ignoring local source map at/.test(err)) {
      // eslint-disable-next-line no-console
      console.warn(`[${origin}] ${level}: ${err.toString()}`);
    }
  });
};

/**
 * Remove old dist directory and make a new dist directory.
 * @param dir The dist directory.
 */
function cleanDistDir(dir: string): void {
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
 * Process CSS.
 * @param {Object} opts User defined options.
 * @param {string} opts.from File from.
 * @param {string} opts.to File to.
 * @param {string} opts.banner Banner to prepend to resulting code.
 * @returns {Promise<{min: Object, result: Object}>}
 */
async function processCss({ from, to, banner }) {
  const src = await readFile(from, 'utf8');

  const { plugins, options } = await postcssLoadConfig({
    from,
    map: { inline: false },
    to,
  });

  const sourceCss = banner + src;
  const result = await postcss(plugins).process(sourceCss, options);

  compileWarn('PostCSS', 'WARN', result.warnings());

  // minify resulting CSS
  const min = await new CleanCSS({
    level: {
      1: { all: true },
      2: { all: true },
    },
    returnPromise: true,
    sourceMap: true,
  }).minify(result.css, result.map.toString());

  compileWarn('CleanCSS', 'ERR', min.errors);
  compileWarn('CleanCSS', 'WARN', min.warnings);

  // clean-css removes the source map comment so we need to add it back in
  min.styles = `${min.styles}\n/*# sourceMappingURL=${basename(
    options.to,
  )}.map */`;

  writeFile(options.to, min.styles);
  writeFile(`${options.to}.map`, min.sourceMap.toString());

  return {
    min,
    result,
  };
}

/**
 * @param env Node `process.env`.
 * @param argv Node `process.argv`.
 */
export = async function run(
  env: NodeJS.ProcessEnv,
  argv: string[] = [],
): Promise<object> {
  try {
    process.env.NODE_ENV = env.NODE_ENV || 'production';
    const pkgName = env.npm_package_name;
    const pkgVersion = env.npm_package_version;
    const pkgHomepage = env.npm_package_homepage;
    const pkgStyle = env.npm_package_style;
    const pkgMain = env.npm_package_main;

    const cssBanner = `/*!
 * ${pkgName} v${pkgVersion} - ${pkgHomepage}
 * Copyright ${new Date().getFullYear()} We Are Genki
 * Apache 2.0 license - https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE
 */`;

    const inputDir = argv[2];
    const outputDir = argv[3];
    const noClean = argv.includes('--no-clean');
    const noBanner = argv.includes('--no-banner');
    const banner = noBanner ? '' : cssBanner;
    const inputCss: string[] = [];
    const outputCss: string[] = [];

    if (!inputDir) {
      if (!pkgStyle && !pkgMain) {
        throw new Error('No input file or directory specified!');
      }

      inputCss.push(pkgMain);
      outputCss.push(pkgStyle);
    } else {
      if (!outputDir) throw new Error('No output directory specified!');

      const dirFiles = await readdir(inputDir);
      const cssFiles = dirFiles.filter(
        (fileName) =>
          fileName !== 'import.css' &&
          fileName.endsWith('.css') &&
          !fileName.startsWith('_'),
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

      const result = processCss({ banner, from, to });
      results.push(result);
    }

    // await here to capture any errors
    const allResults = await Promise.all(results);

    return allResults;
  } catch (error) {
    if (error.showSourceCode) {
      // eslint-disable-next-line no-console
      console.error(
        `[BUILD-CSS] PostCSS error: ${
          error.message
        }:\n${error.showSourceCode()}`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.error('[BUILD-CSS] Error', error);
    }

    // we always want internal builds to fail on error
    throw new Error(error);
  }
};
