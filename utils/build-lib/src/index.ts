/**
 * Minna UI lib package compiler.
 */

// TODO: Implement --watch

/* eslint-disable @typescript-eslint/camelcase, global-require, security/detect-object-injection, no-console, id-length */

import { statSync } from 'fs';
import mri from 'mri';
import { join } from 'path';
import * as rollup from 'rollup';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
// @ts-ignore - FIXME: It's ironic this package doesn't have types...
import typescript from 'rollup-plugin-typescript';
import { makeLegalIdentifier } from 'rollup-pluginutils';

interface BuildLibResult {
  main?: rollup.RollupOutput;
  module?: rollup.RollupOutput;
}

function resolveEntryFile(cwd: string): string {
  const files = [
    'index.js',
    'index.ts',
    'index.jsx',
    'index.tsx',
    'src/index.js',
    'src/index.ts',
    'src/index.jsx',
    'src/index.tsx',
  ];
  let result = '';
  let index = 0;

  while (!result && index < files.length) {
    index += 1;

    try {
      const file = join(cwd, files[index]);
      if (statSync(file)) result = file;
    } catch (err) {}
  }
  if (!result) {
    throw new Error("Couldn't find any entry files and src was not defined");
  }

  return result;
}

/**
 * Build a lib or simple package.
 *
 * @param env - Node `process.env`.
 * @param argv - Node `process.argv`.
 */
export async function run(
  env: NodeJS.ProcessEnv,
  argv: string[] = [],
): Promise<BuildLibResult> {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const pkgName = env.npm_package_name!;
  const pkgMain = env.npm_package_main;
  const pkgModule = env.npm_package_module;
  const pkgTypes = env.npm_package_types;

  if (!pkgModule) console.warn('packge.json#module is not defined');
  if (!pkgModule) console.warn('packge.json#module is not defined');
  if (!pkgTypes) console.warn('packge.json#types is not defined');

  process.env.NODE_ENV = env.NODE_ENV || 'production';

  const cwd = process.cwd();
  const pkg = await import(join(cwd, 'package.json'));

  const args = mri(argv.slice(2), {
    alias: { m: 'sourcemap', s: 'src', w: 'watch' },
    boolean: ['sourcemap', 'watch'],
    default: { m: true },
  });
  const input = args.src || args._[0] || resolveEntryFile(cwd);
  const { sourcemap } = args;

  const name = makeLegalIdentifier(pkgName);
  const external = Object.keys(pkg.dependencies || {}).concat(
    Object.keys(pkg.peerDependencies || {}),
    Object.keys(pkg.optionalDependencies || {}),
  );

  const typescriptOpts = {
    exclude: /\.css$/,
    typescript: require('typescript'),
  };

  try {
    const tsConfigPath = join(cwd, 'tsconfig.json');

    if (statSync(tsConfigPath)) {
      // @ts-ignore - FIXME: Deal with missing types
      typescriptOpts.tsconfig = tsConfigPath;
    }
  } catch (err) {}

  try {
    let outputMain;
    let outputModule;

    if (pkgMain) {
      const bundleMain = await rollup.rollup({
        external,
        input,
        plugins: [
          commonjs(),
          typescript(typescriptOpts),
          buble({
            transforms: {
              dangerousForOf: true,
            },
          }),
        ],
      });

      const resultMain = bundleMain.write({
        file: pkgMain,
        format: 'commonjs',
        name,
        sourcemap,
      });

      outputMain = resultMain;
    }

    if (pkgModule) {
      const bundleModule = await rollup.rollup({
        external,
        input,
        plugins: [commonjs(), typescript(typescriptOpts)],
      });

      const resultModule = bundleModule.write({
        file: pkgModule,
        format: 'esm',
        name,
        sourcemap,
      });

      outputModule = resultModule;
    }

    // await here to capture any errors
    const output = {
      main: outputMain && (await outputMain),
      module: outputModule && (await outputModule),
    };

    return output;
  } catch (err) {
    console.error('[build-lib]', err);

    // we always want internal builds to fail on error
    process.exitCode = 2;
    throw err;
  }
}
