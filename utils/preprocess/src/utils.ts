import { markup } from './markup';

const minify = markup();

/**
 * Minify whitespace in HTML contained in a tagged template literal.
 */
export function html(strings: TemplateStringsArray): string {
  let newString = '';

  strings.forEach((str) => {
    const result = minify({ content: str });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    newString += result!.code;
  });

  return newString;
}
