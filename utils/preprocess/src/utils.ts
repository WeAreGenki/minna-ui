import { markup } from './markup';
import { PreprocessResults } from './types';

const minify = markup();

/**
 * Minify whitespace in HTML contained in a tagged template literal.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function html(strings: TemplateStringsArray, ...values: any[]): string {
  let code = '';

  strings.forEach((string, index) => {
    // eslint-disable-next-line security/detect-object-injection
    code += string + (values[index] || '');
  });

  const result = minify({ content: code }) as PreprocessResults;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return result!.code;
}
