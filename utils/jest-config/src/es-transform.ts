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
      transforms,
    });

    return {
      code: result.code,
      map: result.sourceMap,
    };
  }

  return src;
}
