/**
 * Minna UI component compiler.
 */

/* eslint-disable @typescript-eslint/camelcase */

import { basename } from 'path';
import * as rollup from 'rollup';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';
import preMarkup from '@minna-ui/pre-markup';
import preStyle from '@minna-ui/pre-style';

const compilerOpts = {
  compilation_level: 'SIMPLE',
  language_out: 'ECMASCRIPT5',
  // debug: true,
  // warning_level: 'VERBOSE',
};

interface IBuildComponentResult {
  // FIXME: Don't use `any` type once svelte has types available
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  css: any;
  // element: {
  //   bundle: rollup.RollupBuild;
  //   result: rollup.RollupOutput;
  // };
  esm: {
    bundle: rollup.RollupBuild;
    result: rollup.RollupOutput;
  };
  main: {
    bundle: rollup.RollupBuild;
    result: rollup.RollupOutput;
  };
}

/**
 * Run component build process.
 * @param env Node `process.env`.
 */
export = async function run(
  env: NodeJS.ProcessEnv,
): Promise<IBuildComponentResult> {
  const pkgSvelte = env.npm_package_svelte;

  if (!pkgSvelte) {
    throw new Error(
      'Package.json `svelte` field not found, it this a svelte component?',
    );
  }

  process.env.NODE_ENV = env.NODE_ENV || 'production';
  const pkgName = env.npm_package_name;
  const pkgVersion = env.npm_package_version;
  const pkgHomepage = env.npm_package_homepage;
  const pkgModule = env.npm_package_module;
  const pkgMain = env.npm_package_main;
  const pkgStyle = env.npm_package_style;
  const name = basename(pkgSvelte, '.svelte');

  const banner = `/*!
 * ${pkgName} v${pkgVersion} (${pkgHomepage})
 * Copyright ${new Date().getFullYear()} We Are Genki
 * Apache 2.0 license - https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE
 */`;

  try {
    let resolveCss: Function;
    const resultCss = new Promise((res) => {
      resolveCss = res;
    });

    const bundleMain = await rollup.rollup({
      input: pkgSvelte,
      plugins: [
        svelte({
          preprocess: {
            markup: preMarkup(),
            style: preStyle(),
          },
          // FIXME: Don't use `any` type once svelte has types available
          // eslint-disable-next-line sort-keys, @typescript-eslint/no-explicit-any
          css(css: any) {
            resolveCss(css);
            css.write(pkgStyle);
          },
        }),
        resolve(),
        commonjs(),
        compiler(compilerOpts),
      ],
    });

    // const bundleElement = await rollup.rollup({
    //   input: pkgSvelte,
    //   plugins: [
    //     svelte({
    //       preprocess: {
    //         markup: preMarkup({ level 2 }),
    //         style: preStyle(),
    //       },
    //       css: false,
    //       customElement: true,
    //     }),
    //     resolve(),
    //     commonjs(),
    //     compiler({ ...compilerOpts, language_out: 'ECMASCRIPT_2015' }),
    //   ],
    // });

    const bundleEsm = await rollup.rollup({
      input: pkgSvelte,
      plugins: [
        svelte({
          css: false,
          preprocess: {
            markup: preMarkup(),
            style: preStyle(),
          },
        }),
        resolve(),
        commonjs(),
      ],
    });

    const resultMain = bundleMain.write({
      banner,
      file: pkgMain,
      format: 'iife',
      name,
      sourcemap: true,
    });

    // const resultElement = bundleElement.write({
    //   name,
    //   banner,
    //   file: pkgMain.replace(/\.js/, '.element.js'),
    //   format: 'iife',
    //   sourcemap: true,
    // });

    const resultEsm = bundleEsm.write({
      banner,
      file: pkgModule,
      format: 'esm',
      name,
      sourcemap: true,
    });

    // await here to capture any errors
    const results = {
      css: await resultCss,
      // element: {
      //   bundle: await bundleElement,
      //   result: await resultElement,
      // },
      esm: {
        bundle: await bundleEsm,
        result: await resultEsm,
      },
      main: {
        bundle: await bundleMain,
        result: await resultMain,
      },
    };

    return results;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[build-component]', err);

    // we always want internal builds to fail on error
    process.exit(2);
    throw err;
  }
};
