import { rollup } from 'rollup';
import { BuildLibProps, BuildLibResult } from './types';

export async function build({
  external,
  input,
  name,
  pkgMain,
  pkgModule,
  pkgTypes,
  plugins,
  sourcemap,
}: BuildLibProps): Promise<BuildLibResult> {
  try {
    let outputMain;
    let outputModule;

    if (pkgMain) {
      const bundleMain = await rollup({
        external,
        input,
        plugins,
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
      const bundleModule = await rollup({
        external,
        input,
        plugins,
      });

      const resultModule = bundleModule.write({
        file: pkgModule,
        format: 'esm',
        name,
        sourcemap,
      });

      outputModule = resultModule;
    }

    if (pkgTypes) {
      // TODO: Generate `*.d.ts` files
    }

    // Await here to capture any errors
    const output = {
      main: outputMain && (await outputMain),
      module: outputModule && (await outputModule),
    };

    return output;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[build-lib]', err);

    // We always want internal builds to fail on error
    process.exitCode = 2;
    throw err;
  }
}
