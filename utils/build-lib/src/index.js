/**
 * Minna UI lib package compiler.
 */

/* global NodeJS */
/* eslint-disable global-require, no-console, id-length */

'use strict';

const { statSync } = require('fs');
const mri = require('mri');
const { join } = require('path');
const commonjs = require('rollup-plugin-commonjs');
const typescript = require('rollup-plugin-typescript');
const { makeLegalIdentifier } = require('rollup-pluginutils');
const { build } = require('./build');
const { resolveEntryFile } = require('./utils');
const { watch } = require('./watch');

/** @typedef {import('./types').BuildLibResult} BuildLibResult */

/**
 * Build a lib or simple package.
 *
 * Tip: Use a TypeScript `tsconfig.json` config to control output
 * compatibility. For example, if you want compatibility with old browsers
 * use `"target": "es5"`.
 *
 * @param {NodeJS.ProcessEnv} env - Node `process.env`.
 * @param {string[]} [argv] - Node `process.argv`.
 * @returns {Promise<BuildLibResult | undefined>} Resulting output when running
 * in build mode. When running in watch mode this will never resolve.
 */
async function run(env, argv = []) {
  const args = mri(argv.slice(2), {
    alias: { c: 'tsconfig', h: 'help', m: 'sourcemap', w: 'watch' },
    boolean: ['help', 'sourcemap', 'watch'],
    default: { c: 'tsconfig.json', m: true },
  });
  const { help, sourcemap, tsconfig, watch: watchMode } = args;

  if (help) {
    console.log(`
Build a lib or simple package. Typically zero additional configuration is
required because your package.json is the config.

USAGE:
  build-lib [src] [options]

OPTIONS
  -h --help       Print this help message and exit.
  -w --watch      Continuously watch files for changes and rebuild.
  -c --tsconfig   Custom path to your TypeScript config (default tsconfig.json)
  -m --sourcemap  Generate code source maps (default true)
`);
    return;
  }

  const pkgName = env.npm_package_name;
  const pkgMain = env.npm_package_main;
  const pkgModule = env.npm_package_module;
  const pkgTypes = env.npm_package_types;

  if (!pkgName) throw new Error('packge.json#name is not defined');
  if (!pkgMain && !pkgModule) {
    throw new Error(
      'You need to specify at least one of packge.json#main or packge.json#module',
    );
  }
  if (!pkgMain) console.warn('packge.json#main is not defined');
  if (!pkgModule) console.warn('packge.json#module is not defined');
  if (!pkgTypes) console.warn('packge.json#types is not defined');

  process.env.NODE_ENV = env.NODE_ENV || 'production';

  const cwd = process.cwd();
  const pkg = require(join(cwd, 'package.json')); // eslint-disable-line

  const input = args._[0] || resolveEntryFile(cwd);
  const name = makeLegalIdentifier(pkgName);
  const external = Object.keys(pkg.dependencies || {}).concat(
    Object.keys(pkg.peerDependencies || {}),
    Object.keys(pkg.optionalDependencies || {}),
    require('module').builtinModules,
  );

  const typescriptOpts = {
    exclude: /\.(post|p)?css$/,
    module: 'esnext',
    target: 'es2019', // FIXME: Why is this not inherited from `@minna-ui/ts-config`?
    typescript: require('typescript'),
  };

  const tsConfigPath = join(cwd, tsconfig);

  try {
    if (statSync(tsConfigPath)) {
      // @ts-ignore - TODO: Correctly add the value in a way TS likes
      typescriptOpts.tsconfig = tsConfigPath;
    }
  } catch (err) {}

  const plugins = [commonjs(), typescript(typescriptOpts)];

  const options = {
    external,
    input,
    name,
    pkgMain,
    pkgModule,
    pkgTypes,
    plugins,
    sourcemap,
  };

  // eslint-disable-next-line consistent-return
  return watchMode ? watch(options) : build(options);
}

exports.run = run;
