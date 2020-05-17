/**
 * Minna UI component compiler.
 */

import { preprocess } from '@minna-ui/preprocess';
import buble from '@rollup/plugin-buble';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { basename } from 'path';
import * as rollup from 'rollup';
// @ts-expect-error - Don't care about types in simple lib
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

interface CssResult {
  code: string;
  map?: string;
}

interface RollupSvelteCss extends CssResult {
  write(path: string): void;
}

interface BuildComponentResult {
  cjs: {
    bundle: rollup.RollupBuild;
    result: rollup.RollupOutput;
  };
  css: CssResult;
  element: {
    bundle: rollup.RollupBuild;
    result: rollup.RollupOutput;
  };
  esm: {
    bundle: rollup.RollupBuild;
    result: rollup.RollupOutput;
  };
}

const terserOpts = {
  compress: {
    drop_console: false,
    drop_debugger: true,
    keep_fargs: false,
    negate_iife: false,
    passes: 4,
    pure_funcs: ['Object.freeze'],
    pure_getters: true,
    side_effects: true,
  },
  mangle: true,
  output: {
    comments: /^!|[@#]__PURE__/,
    wrap_iife: true,
  },
  sourcemap: true,
  warnings: true,
};

/**
 * Run component build process.
 *
 * @param env - Node `process.env`.
 */
export async function run(
  env: NodeJS.ProcessEnv,
): Promise<BuildComponentResult> {
  const pkgBrowser = env.npm_package_browser;
  const pkgHomepage = env.npm_package_homepage;
  const pkgMain = env.npm_package_main;
  const pkgModule = env.npm_package_module;
  const pkgName = env.npm_package_name;
  const pkgStyle = env.npm_package_style;
  const pkgSvelte = env.npm_package_svelte;
  const pkgVersion = env.npm_package_version;

  if (!pkgBrowser) throw new Error('package.json#browser is not defined');
  if (!pkgMain) throw new Error('packge.json#main is not defined');
  if (!pkgStyle) throw new Error('packge.json#style is not defined');
  if (!pkgSvelte) throw new Error('package.json#svelte is not defined');

  process.env.NODE_ENV = env.NODE_ENV || 'production';
  const name = basename(pkgSvelte, '.svelte');

  if (!pkgName) throw new Error('Expected package.json#name to be set');
  if (!pkgVersion) throw new Error('Expected package.json#version to be set');
  if (!pkgHomepage) throw new Error('Expected package.json#homepage to be set');

  const banner = `/*!
 * ${pkgName} v${pkgVersion} - ${pkgHomepage}
 * Copyright ${new Date().getFullYear()} We Are Genki
 * Apache 2.0 license - https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE
 */`;

  try {
    let resolveCss: (value: CssResult) => void;
    const resultCss: Promise<CssResult> = new Promise((res) => {
      resolveCss = res;
    });

    const bundleCjs = await rollup.rollup({
      input: pkgSvelte,
      plugins: [
        svelte({
          css(css: RollupSvelteCss) {
            // eslint-disable-next-line no-param-reassign
            css.code = `${banner}\n${css.code}`;
            resolveCss({
              code: css.code,
              map: css.map,
            });
            css.write(pkgStyle);
          },
          preprocess,
        }),
        resolve(),
        commonjs(),
        buble({
          transforms: {
            dangerousForOf: true,
          },
        }),
        terser(terserOpts),
      ],
    });

    const bundleElement = await rollup.rollup({
      input: pkgSvelte,
      plugins: [
        svelte({
          customElement: true,
          preprocess,
          // FIXME: Make this customisable or use a new technique to name tags
          tag: pkgName.replace('@minna-ui/', 'minna-'),
        }),
        resolve(),
        commonjs(),
        buble({
          transforms: {
            classes: false,
            dangerousForOf: true,
          },
        }),
        terser(terserOpts),
      ],
    });

    const bundleEsm = await rollup.rollup({
      // Allow Svelte to be tree-shaken when users import multiple components
      external: ['svelte', 'svelte/internal'],
      input: pkgSvelte,
      plugins: [
        svelte({
          css: false,
          preprocess,
        }),
        resolve(),
        commonjs(),
      ],
    });

    const resultCjs = bundleCjs.write({
      banner,
      file: pkgMain,
      format: 'iife',
      name,
      sourcemap: true,
    });

    const resultElement = bundleElement.write({
      banner,
      file: pkgBrowser,
      format: 'iife',
      name,
      sourcemap: true,
    });

    const resultEsm = bundleEsm.write({
      banner,
      file: pkgModule,
      format: 'esm',
      name,
      sourcemap: true,
    });

    // await here to capture any errors
    const results = {
      cjs: {
        bundle: bundleCjs,
        result: await resultCjs,
      },
      css: await resultCss,
      element: {
        bundle: bundleElement,
        result: await resultElement,
      },
      esm: {
        bundle: bundleEsm,
        result: await resultEsm,
      },
    };

    return results;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[build-component]', err);

    // we always want internal builds to fail on error
    process.exitCode = 2;
    throw err;
  }
}
