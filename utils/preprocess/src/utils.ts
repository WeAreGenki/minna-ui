import { minify } from './markup';

/**
 * Minify whitespace in HTML contained in a tagged template literal.
 */
export function html(
  strings: TemplateStringsArray,
  ...values: string[]
): string {
  let code = '';

  strings.forEach((string, index) => {
    // eslint-disable-next-line security/detect-object-injection
    code += `${string}${values[index] || ''}`;
  });

  return minify(code, true);
}
