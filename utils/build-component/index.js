/**
 * Tool to compile minna-ui web components.
 */

'use strict';

const fs = require('fs');
const { basename, dirname, join } = require('path');
const del = require('del');
const { rollup } = require('rollup');
const compiler = require('@ampproject/rollup-plugin-closure-compiler');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');
const svelte = require('rollup-plugin-svelte');
const preprocessMarkup = require('@minna-ui/svelte-preprocess-markup');
const preprocessStyle = require('@minna-ui/svelte-preprocess-style');

const compilerOpts = {
  externs: [
    // require.resolve('google-closure-compiler/contrib/externs/svg.js'),
    join(__dirname, 'component-externs.js'),
  ],
  language_out: 'ECMASCRIPT5',
  compilation_level: 'ADVANCED',

  // uncomment for debugging
  // warning_level: 'VERBOSE',
  // jscomp_off: 'duplicate', // FIXME: Deprecated `method` var
  // formatting: 'PRETTY_PRINT',
  // debug: true,
};

const isClean = new Map();

/**
 * Run component build process.
 * @param {NodeJS.ProcessEnv} env
 */
module.exports = async function run(env) {
  process.env.NODE_ENV = env.NODE_ENV || 'production';
  const pkgName = env.npm_package_name;
  const pkgVersion = env.npm_package_version;
  const pkgHomepage = env.npm_package_homepage;
  const pkgSvelte = env.npm_package_svelte;
  const pkgModule = env.npm_package_module;
  const pkgMain = env.npm_package_main;
  const pkgStyle = env.npm_package_style;
  const name = basename(pkgSvelte, '.html');

  const banner = `/*!
 * ${pkgName} v${pkgVersion} (${pkgHomepage})
 * Copyright ${new Date().getFullYear()} We Are Genki
 * Apache 2.0 license - https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE
 */`;

  /** @type {Function} */
  let resolveCss;
  const resultCss = new Promise((res) => {
    resolveCss = res;
  });

  const distDir = dirname(pkgMain);

  // TODO: Better safety checks to make sure we don't delete something important
  /* istanbul ignore else */
  if (!isClean.has(distDir)) {
    isClean.set(distDir, null);

    /* istanbul ignore else */
    if (distDir !== process.cwd()) {
      fs.stat(distDir, (err) => {
        /* istanbul ignore if */
        if (err && err.code !== 'ENOENT') throw err;

        del.sync([distDir]);
      });
    }
  }

  const bundleMain = await rollup({
    input: pkgSvelte,
    plugins: [
      svelte({
        preprocess: {
          markup: preprocessMarkup({ level: 2 }),
          style: preprocessStyle(),
        },
        css(css) {
          resolveCss(css);
          css.write(pkgStyle);
        },
      }),
      resolve(),
      commonjs(),
      compiler(compilerOpts),
    ],
  });

  // const bundleElement = await rollup({
  //   input: pkgSvelte,
  //   plugins: [
  //     svelte({
  //       preprocess: {
  //         markup: preprocessMarkup({ level 2 }),
  //         style: preprocessStyle(),
  //       },
  //       css: false,
  //       customElement: true,
  //     }),
  //     resolve(),
  //     commonjs(),
  //     compiler({ ...compilerOpts, language_out: 'ECMASCRIPT_2015' }),
  //   ],
  // });

  const bundleEsm = await rollup({
    input: pkgSvelte,
    plugins: [
      svelte({
        preprocess: {
          markup: preprocessMarkup({ level: 2 }),
          style: preprocessStyle(),
        },
        css: false,
      }),
      resolve(),
      commonjs(),
    ],
  });

  const resultMain = bundleMain.write({
    name,
    banner,
    file: pkgMain,
    format: 'iife',
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
    name,
    banner,
    file: pkgModule,
    format: 'esm',
    sourcemap: true,
  });

  return {
    css: await resultCss,
    main: {
      bundle: await bundleMain,
      result: await resultMain,
    },
    // element: {
    //   bundle: await bundleElement,
    //   result: await resultElement,
    // },
    esm: {
      bundle: await bundleEsm,
      result: await resultEsm,
    },
  };
};
