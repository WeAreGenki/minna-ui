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

  // @ts-ignore - We already check there's at least one file to build
  rollupWatch(config);
}
