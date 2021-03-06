/* eslint-disable no-restricted-syntax */

import { PreprocessorGroup } from 'svelte/types/compiler/preprocess';

export function minify(source: string, unsafe = false): string {
  let code = `${source}`;
  let count = 0;

  const tags = [
    ['<script', '</script>'],
    ['<style', '</style>'],
    ['<pre', '</pre>'],
  ];
  const blocks = new Map();

  // replace tag blocks with markers
  for (const tag of tags) {
    let start;

    // eslint-disable-next-line no-cond-assign
    while ((start = code.indexOf(tag[0])) !== -1) {
      const end = code.indexOf(tag[1], start) + tag[1].length;
      const inner = code.slice(start, end);
      const marker = `<___marker_${count}>`;
      blocks.set(marker, inner);

      code = code.substring(0, start) + marker + code.substring(end);

      count += 1;
    }
  }

  // remove HTML comments
  code = code.replace(/<!--[\s\S]*?-->/gu, '');

  // remove whitespace between tags
  code = code.replace(/>\s*?</gm, unsafe ? '><' : '> <');

  // reduce multiple whitespace down to a single space
  code = code.replace(/\s{2,}/gm, ' ');

  // convert remaining whitespace characters into a space
  code = code.replace(/\s/gm, ' ');

  // remove surrounding whitespace
  code = code.trim();

  // restore tag blocks
  for (const marker of blocks.keys()) {
    code = code.replace(marker, blocks.get(marker));
  }

  return code;
}

type MarkupPreprocessor = PreprocessorGroup['markup'];

/**
 * Minna UI svelte markup preprocessor.
 * Reduces the whitespace in svelte components to a minimum.
 *
 * @param opts - User defined options.
 * @param opts.enabled - Enable preprocessor to transform HTML code.
 */
export const markup = ({
  enabled = true,
  unsafe = true,
  // @ts-ignore - FIXME: null is a valid return type, submit PR upstream
} = {}): MarkupPreprocessor => ({ content }) => {
  if (!enabled) return null;

  const code = minify(content, unsafe);

  return { code };
};
