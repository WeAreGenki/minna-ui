/**
 * Tool to compile Minna UI CSS packages.
 */

/* eslint-disable security/detect-non-literal-fs-filename, security/detect-object-injection */

import CleanCSS from 'clean-css';
import fs from 'fs';
import { basename, dirname, join } from 'path';
import postcss from 'postcss';
import postcssLoadConfig from 'postcss-load-config';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);

/**
 * Print a list of warnings or errors to the process stderr.
 * @param origin Which lib the warning came from.
 * @param level The severity of either WARN or ERR.
 * @param warnings List of warnings to iterate over.
 */
function compileWarn(
  origin: string,
  level: string,
  warnings: string[] | postcss.ResultMessage[],
): void {
  /* istanbul ignore if */
  if (warnings.length && level === 'ERR') {
    process.exitCode = 1; // prevents tests running too long
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warnings.forEach((err: any) => {
    /* istanbul ignore if */
    if (!/^Ignoring local source map at/.test(err)) {
      // eslint-disable-next-line no-console
      console.warn(`[${origin}] ${level}: ${err.toString()}`);
    }
  });
}

interface ProcessCssOpts {
  from: string;
  to: string;
  banner: string;
}

interface ProcessCssResult {
  min: CleanCSS.Output;
  result: postcss.Result;
}

/**
 * Process CSS.
 * @param opts User defined options.
 * @param opts.banner Banner to prepend to resulting code.
 * @param opts.from File from.
 * @param opts.to File to.
 */
async function processCss({
  banner = '',
  from,
  to = from,
}: ProcessCssOpts): Promise<ProcessCssResult> {
  const src = await readFile(from, 'utf8');

  const { options, plugins } = await postcssLoadConfig({
    from,
    map: {
      inline: false,
    },
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
    sourceMap: !!result.map,
  }).minify(result.css, result.map ? result.map.toString() : '');

  compileWarn('CleanCSS', 'ERR', min.errors);
  compileWarn('CleanCSS', 'WARN', min.warnings);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const filePath = options.to!;
  const fileName = basename(filePath);
  const dirPath = dirname(filePath);

  // clean-css removes the source map comment so we need to add it back in
  min.styles = `${min.styles}\n/*# sourceMappingURL=${fileName}.map */`;

  // create the output directory
  await mkdir(dirPath, { recursive: true });

  writeFile(filePath, min.styles);
  writeFile(`${filePath}.map`, min.sourceMap.toString());

  return {
    min,
    result,
  };
}

/**
 * Run CSS build process.
 * @param env Node `process.env`.
 * @param argv Node `process.argv`.
 */
export = async function run(
  env: NodeJS.ProcessEnv,
  argv: string[] = [],
): Promise<ProcessCssResult[]> {
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
    const noBanner = argv.includes('--no-banner');
    const banner = noBanner ? '' : cssBanner;
    const inputCss: string[] = [];
    const outputCss: string[] = [];

    if (!inputDir) {
      if (!pkgStyle && !pkgMain) {
        throw new Error('No input file or directory specified!');
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      inputCss.push(pkgMain!);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      outputCss.push(pkgStyle!);
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
  } catch (err) {
    if (err.showSourceCode) {
      // eslint-disable-next-line no-console
      console.error(
        `[build-css] PostCSS error: ${err.message}:\n${err.showSourceCode()}`,
      );
    } else {
      // eslint-disable-next-line no-console
      console.error('[build-css]', err);
    }

    // we always want internal builds to fail on error
    process.exit(2);
    throw err;
  }
};
