/**
 * Tool to compile minna-ui web components.
 */

// FIXME: Minify browser targeted JS bundle

// FIXME: Not exiting with code > 0 on error

// TODO: Add source map annotation to output

// TODO: Add banner to generated JS code without impacting the JS source map

// TODO: Generate a "custom element" web component

'use strict';

const fs = require('fs');
const { basename, dirname } = require('path');
const { promisify } = require('util');
const del = require('del');
const { compile, preprocess } = require('svelte');
const preprocessMarkup = require('@minna-ui/svelte-preprocess-markup');
const preprocessStyle = require('@minna-ui/svelte-preprocess-style');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

/**
 * Remove old dist directory and make a new dist directory.
 * @param {string} dir The dist directory.
 */
function cleanDistDir(dir) {
  if (/dist$/.test(dir)) {
    fs.stat(dir, async (err) => {
      if (err) {
        // dir doesn't exist, make new dir
        await mkdir(dir);
      } else {
        // dir does exist, remove first and then make new dir
        await del([dir]);
        await mkdir(dir);
      }
    });
  }
}

module.exports = async function run(env) {
  process.env.NODE_ENV = env.NODE_ENV || 'production';
  const name = env.npm_package_name;
  const version = env.npm_package_version;
  const homepage = env.npm_package_homepage;
  const pkgSvelte = env.npm_package_svelte;
  const pkgModule = env.npm_package_module;
  const pkgMain = env.npm_package_main;
  const pkgStyle = env.npm_package_style;

  const licence = 'https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE';
  const banner = `/*!
 * ${name} v${version} | ${homepage}
 * Copyright ${new Date().getFullYear()} We Are Genki
 * Licensed under Apache 2.0 - ${licence}
 */\n`;

  try {
    cleanDistDir(dirname(pkgMain));

    const rawSource = await readFile(pkgSvelte, 'utf8');

    const source = await preprocess(rawSource, {
      markup: preprocessMarkup(),
      style: preprocessStyle({ from: pkgSvelte, to: pkgSvelte, banner }),
    });

    const commonOpts = {
      css: false,
      filename: basename(pkgSvelte),
      name: basename(pkgSvelte, '.html'),
      onwarn(warning, onwarn) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'development' && !/A11y:/.test(warning.message)) {
          onwarn(warning);
        }
      },
    };

    const esModule = compile(source.toString(), {
      ...commonOpts,
    });

    writeFile(`${pkgStyle}.map`, esModule.css.map.toString());
    writeFile(pkgStyle, esModule.css.code);
    writeFile(`${pkgModule}.map`, esModule.js.map.toString());
    writeFile(pkgModule, esModule.js.code);

    const iifeBrowser = compile(source.toString(), {
      ...commonOpts,
      format: 'iife',
    });

    writeFile(`${pkgMain}.map`, iifeBrowser.js.map.toString());
    writeFile(pkgMain, iifeBrowser.js.code);

    // const webComponent = compile(source.toString(), {
    //   ...commonOpts,
    //   customElement: true,
    //   // format: 'iife',
    // });
    // console.log('!!!! webComponent', webComponent);
  } catch (error) {
    throw error;
  }
};
