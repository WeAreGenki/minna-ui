/**
 * Tool to compile minna-ui web components.
 */

// TODO: Generate a "custom element" web component

'use strict';

const fs = require('fs');
const { basename, dirname } = require('path');
const del = require('del');
const { rollup } = require('rollup');
const buble = require('rollup-plugin-buble');
const butternut = require('rollup-plugin-butternut');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const svelte = require('rollup-plugin-svelte');
const preprocessMarkup = require('@minna-ui/svelte-preprocess-markup');
const preprocessStyle = require('@minna-ui/svelte-preprocess-style');

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

  // FIXME: Banner is missing in resulting code
  const banner = `/*!
 * ${pkgName} v${pkgVersion} - ${pkgHomepage}
 * Copyright ${new Date().getFullYear()} We Are Genki
 * Licensed under Apache 2.0 - https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE
 */
`;

  /** @type {Function} */
  let resolveCss;
  const resultCss = new Promise((resolve) => {
    resolveCss = resolve;
  });

  const distDir = dirname(pkgMain);

  if (!isClean.has(distDir)) {
    isClean.set(distDir, null);

    // TODO: Better safety checks to make sure we don't delete something important
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
      buble(),
      butternut(),
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
    footer: banner,
    intro: banner,
    outro: banner,
    file: pkgMain,
    format: 'iife',
    sourcemap: true,
  });

  const resultEsm = bundleEsm.write({
    name,
    banner,
    file: pkgModule,
    format: 'es',
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
