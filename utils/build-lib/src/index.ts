/**
 * Minna UI lib package compiler.
 */

/* eslint-disable @typescript-eslint/camelcase, global-require, no-console, id-length */

import { statSync } from 'fs';
import mri from 'mri';
import { join } from 'path';
import commonjs from 'rollup-plugin-commonjs';
import typescript from 'rollup-plugin-typescript';
import { makeLegalIdentifier } from 'rollup-pluginutils';
import { build } from './build';
import { BuildLibResult } from './types';
import { resolveEntryFile } from './utils';
import { watch } from './watch';

/**
 * Build a lib or simple package.
 *
 * Tip: Use a TypeScript `tsconfig.json` config to control output
 * compatibility. For example, if you want compatibility with old browsers
 * use `"target": "es5"`.
 *
 * @param env - Node `process.env`.
 * @param argv - Node `process.argv`.
 */
export async function run(
  env: NodeJS.ProcessEnv,
  argv: string[] = [],
): Promise<BuildLibResult | void> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const pkgName = env.npm_package_name!;
  const pkgMain = env.npm_package_main;
  const pkgModule = env.npm_package_module;
  const pkgTypes = env.npm_package_types;

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

  const args = mri(argv.slice(2), {
    alias: { c: 'tsconfig', m: 'sourcemap', s: 'src', w: 'watch' },
    boolean: ['sourcemap', 'watch'],
    default: { c: 'tsconfig.json', m: true },
  });
  const input = args.src || args._[0] || resolveEntryFile(cwd);
  const { sourcemap, tsconfig, watch: watchMode } = args;

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

  return watchMode ? watch(options) : build(options);
}
