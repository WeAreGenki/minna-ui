/**
 * Tool to compile minna-ui web components.
 */

// TODO: Generate a "custom element" web component

'use strict';

const fs = require('fs');
const { basename, dirname, join } = require('path');
const del = require('del');
const { rollup } = require('rollup');
const compiler = require('@ampproject/rollup-plugin-closure-compiler');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
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
  use_types_for_optimization: true,
  warning_level: 'VERBOSE',

  // FIXME: Shouldn't need this
  jscomp_off: 'duplicate',

  // uncomment for debugging
  // formatting: 'PRETTY_PRINT',
  // debug: true,
};

const isClean = new Map();

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
 * Licensed under Apache 2.0 (https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)
 */
`;

  /** @type {Function} */
  let resolveCss;
  const resultCss = new Promise((resolve) => {
    resolveCss = resolve;
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
      nodeResolve(),
      commonjs(),
      svelte({
        preprocess: {
          markup: preprocessMarkup(),
          style: preprocessStyle(),
        },
        css(css) {
          resolveCss(css);
          css.write(pkgStyle);
        },
      }),
      compiler(compilerOpts),
    ],
  });

  const bundleEsm = await rollup({
    input: pkgSvelte,
    plugins: [
      nodeResolve(),
      commonjs(),
      svelte({
        preprocess: {
          markup: preprocessMarkup(),
          style: preprocessStyle(),
        },
        css: false,
      }),
    ],
  });

  const resultMain = bundleMain.write({
    name,
    banner,
    file: pkgMain,
    format: 'iife',
    sourcemap: true,
  });

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
    esm: {
      bundle: await bundleEsm,
      result: await resultEsm,
    },
  };
};
