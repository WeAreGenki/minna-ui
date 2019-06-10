/* eslint-disable no-console */

import { watch as rollupWatch } from 'rollup';
import { BuildLibProps } from './types';

export async function watch({
  external,
  input,
  name,
  pkgMain,
  pkgModule,
  pkgTypes,
  plugins,
  sourcemap,
}: BuildLibProps): Promise<void> {
  const config = [];

  if (pkgMain) {
    config.push({
      external,
      input,
      output: {
        file: pkgMain,
        format: 'commonjs',
        name,
        sourcemap,
      },
      plugins,
    });
  }

  if (pkgModule) {
    config.push({
      external,
      input,
      output: {
        file: pkgModule,
        format: 'esm',
        name,
        sourcemap,
      },
      plugins,
    });
  }

  if (pkgTypes) {
    // TODO: Generate `*.d.ts` files
  }

  // @ts-ignore - `config` will never be zero length
  const watcher = rollupWatch(config);

  console.log('Starting build in watch mode...');

  watcher.on('event', (event) => {
    switch (event.code) {
      case 'END':
        console.log(new Date(Date.now()), '- Generated new bundle/s');
        break;

      case 'FATAL':
      case 'ERROR':
        console.error(event.error);
        break;

      default:
    }
  });
}
