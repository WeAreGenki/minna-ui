/**
 * Minna UI lib package compiler.
 */

/* eslint-disable @typescript-eslint/no-require-imports, global-require, no-console, id-length */

import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import typescript, { RollupTypescriptOptions } from '@rollup/plugin-typescript';
import { makeLegalIdentifier } from '@rollup/pluginutils';
import { statSync } from 'fs';
import mri from 'mri';
import { join } from 'path';
import rollup from 'rollup';
import { build } from './build';
import { BuildLibProps, BuildLibResult } from './types';
import { resolveEntryFile } from './utils';
import { watch } from './watch';

const ARGS_START = 2;

/**
 * Build a lib or simple package.
 *
 * Tip: Use a TypeScript `tsconfig.json` config to control output
 * compatibility. For example, if you want compatibility with old browsers
 * use `"target": "es5"`.
 *
 * @param env - Node `process.env`.
 * @param argv - Node `process.argv`.
 * @returns Resulting output when running
 * in build mode. When running in watch mode this will never resolve.
 */
export async function run(
  env: NodeJS.ProcessEnv,
  argv: string[] = [],
): Promise<BuildLibResult | void> {
  const args = mri(argv.slice(ARGS_START), {
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
  -c --tsconfig   Custom path to your TypeScript config (default tsconfig.json).
  -m --sourcemap  Generate code source maps (default true).
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
  const pkg = await import(join(cwd, 'package.json'));

  const input = args._[0] || resolveEntryFile(cwd);
  const name = makeLegalIdentifier(pkgName);
  const externals = Object.keys(pkg.dependencies || {}).concat(
    Object.keys(pkg.peerDependencies || {}),
    Object.keys(pkg.optionalDependencies || {}),
    require('module').builtinModules,
  );
  const external = (id: string): boolean =>
    externals.some((key) => id === key || id.startsWith(`${key}/`));

  const typescriptOpts: RollupTypescriptOptions = {
    exclude: ['**/*.test.ts'],
    include: ['*.ts', '*.mjs', '*.js', '**/*.ts', '**/*.mjs', '**/*.js'],
  };

  const tsConfigPath = join(cwd, tsconfig);

  try {
    if (statSync(tsConfigPath).isFile()) {
      typescriptOpts.tsconfig = tsConfigPath;
    }
  } catch (err) {}

  const plugins: rollup.Plugin[] = [
    json(),
    commonjs(),
    typescript(typescriptOpts),
  ];

  const options: BuildLibProps = {
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
