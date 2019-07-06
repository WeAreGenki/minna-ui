/**
 * Tool to compile Minna UI CSS packages.
 */

/* eslint-disable security/detect-non-literal-fs-filename, security/detect-object-injection, no-restricted-syntax, id-length, no-console */

import CleanCSS from 'clean-css';
import fs from 'fs';
import mri from 'mri';
import { basename, dirname, join } from 'path';
import postcss from 'postcss';
import postcssrc from 'postcss-load-config';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readdir = promisify(fs.readdir);

const ARGS_START = 2;

/**
 * Print a list of warnings or errors to the process stderr.
 *
 * @param from - Which lib the warning came from.
 * @param level - The severity of either WARN or ERR.
 * @param warnings - List of warnings to iterate over.
 */
function warn(
  from: string,
  level: 'ERR' | 'WARN',
  warnings: string[] | postcss.ResultMessage[],
): void {
  /* istanbul ignore if */
  if (warnings.length && level === 'ERR') {
    // prevent tests running too long
    process.exitCode = 1;
  }

  for (const err of warnings) {
    if (typeof err === 'string' && /^Ignoring local source map/.test(err)) {
      return;
    }

    // eslint-disable-next-line no-console
    console.warn(`[${from}] ${level}: ${err.toString()}`);
  }
}

interface ProcessCssOpts {
  banner?: string;
  from: string;
  optimize?: boolean;
  sourcemap?: boolean;
  to?: string;
}

interface ProcessCssResult {
  code: string;
  map?: string | { toString: () => string };
}

/**
 * Process CSS.
 *
 * @param opts - User defined options.
 * @param opts.banner - Banner to prepend to resulting code.
 * @param opts.from - File from.
 * @param opts.to - File to.
 */
async function processCss({
  banner = '',
  from,
  optimize = process.env.NODE_ENV === 'production',
  sourcemap,
  to = from,
}: ProcessCssOpts): Promise<ProcessCssResult> {
  const src = await readFile(from, 'utf8');

  const ctx = { from, map: sourcemap && { inline: false }, to };
  const source = banner + src;

  const { options, plugins } = await postcssrc(ctx, from);
  const result = await postcss(plugins).process(source, options);

  warn('PostCSS', 'WARN', result.warnings());

  let code = result.css;
  // eslint-disable-next-line prefer-destructuring
  let map: string | { toString(): string } | undefined = result.map;
  const hasMap = sourcemap && !!map;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const filePath = options.to!;
  const dirPath = dirname(filePath);

  if (optimize) {
    // Minify resulting CSS
    const min = new CleanCSS({
      level: {
        1: { all: true },
        2: { all: true },
      },
      sourceMap: hasMap,
    }).minify(code, map && map.toString ? map.toString() : '');

    warn('CleanCSS', 'ERR', min.errors);
    warn('CleanCSS', 'WARN', min.warnings);

    const fileName = basename(filePath);

    if (sourcemap) {
      // Add back source map comment because clean-css removes it
      code = `${min.styles}\n/*# sourceMappingURL=${fileName}.map */`;
      map = min.sourceMap;
    }
  }

  // Create output directory
  await mkdir(dirPath, { recursive: true });

  writeFile(filePath, code);
  if (sourcemap) {
    writeFile(`${filePath}.map`, map);
  }

  return {
    code,
    map,
  };
}

/**
 * Run CSS build process.
 *
 * @param env - Node `process.env`.
 * @param argv - Node `process.argv`.
 */
export async function run(
  env: NodeJS.ProcessEnv,
  argv: string[] = [],
): Promise<ProcessCssResult[] | undefined> {
  const args = mri(argv.slice(ARGS_START), {
    alias: { b: 'banner', h: 'help', m: 'sourcemap' },
    boolean: ['banner', 'help', 'sourcemap'],
    default: { b: true, m: true },
  });
  const { help, banner: hasBanner, sourcemap } = args;

  if (help) {
    console.log(`
Build CSS. Typically zero additional configuration is required because your
package.json is the config.

USAGE:
  build-css [src] [dest] [options]

OPTIONS
  -h --help       Print this help message and exit.
  -b --banner     Inject banner text atop the output (default true).
  -m --sourcemap  Generate code source maps (default true).
`);
    return;
  }

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
 */
`;

  const inputDir = args._[0];
  const outputDir = args._[1];
  const cwd = process.cwd();
  const banner = hasBanner ? cssBanner : '';
  const inputCss: string[] = [];
  const outputCss: string[] = [];

  try {
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
        inputCss.push(join(cwd, inputDir, fileName));
        outputCss.push(join(cwd, outputDir, fileName));
      });
    }

    const results = [];

    for (let index = 0; index < inputCss.length; index += 1) {
      const from = inputCss[index];
      const to = outputCss[index];

      const result = processCss({ banner, from, sourcemap, to });
      results.push(result);
    }

    // Await here to capture any errors
    const allResults = await Promise.all(results);

    // eslint-disable-next-line consistent-return
    return allResults;
  } catch (err) {
    if (err.showSourceCode) {
      console.error(
        `[build-css] PostCSS error: ${err.message}:\n${err.showSourceCode()}`,
      );
    } else {
      console.error('[build-css]', err);
    }

    // We always want internal builds to fail on error
    process.exitCode = 2;
    throw err;
  }
}
