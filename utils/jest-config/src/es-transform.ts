// based on `@sucrase/jest-plugin` but without flow support and with mjs support
// @see https://github.com/alangpierce/sucrase/blob/master/integrations/jest-plugin/src/index.ts

// eslint-disable-next-line import/named
import { Transform, transform } from 'sucrase';

function getTransforms(filename: string): Transform[] | null {
  if (filename.endsWith('.js') || filename.endsWith('.jsx')) {
    return ['jsx', 'imports'];
  }
  if (filename.endsWith('.ts')) {
    return ['typescript', 'imports'];
  }
  if (filename.endsWith('.tsx')) {
    return ['typescript', 'jsx', 'imports'];
  }
  if (filename.endsWith('.mjs')) {
    return ['imports'];
  }
  return null;
}

export function process(
  src: string,
  filename: string,
): jest.TransformedSource | string {
  const transforms = getTransforms(filename);

  if (transforms !== null) {
    const result = transform(src, {
      filePath: filename,
      jsxFragmentPragma: 'Fragment', // Preact style JSX
      jsxPragma: 'h',
      transforms,
    });

    return {
      code: result.code,
      map: result.sourceMap,
    };
  }

  return src;
}
