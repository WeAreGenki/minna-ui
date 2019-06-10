import { minify } from './markup';

/**
 * Minify whitespace in HTML contained in a tagged template literal.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function html(strings: TemplateStringsArray, ...values: any[]): string {
  let code = '';

  strings.forEach((string, index) => {
    code += `${string}${values[index] || ''}`;
  });

  return minify(code, true);
}
