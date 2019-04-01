/* eslint-disable security/detect-object-injection */

// eslint-disable-next-line import/named
import { MarkupPreprocessor } from './types';

/**
 * Minna UI svelte markup preprocessor.
 * Reduces the whitespace in svelte components to a minimum.
 * @param opts User defined options.
 * @param opts.enabled Enable preprocessor to tranform HTML code.
 */
export const markup = ({ enabled = true } = {}): MarkupPreprocessor => ({
  content,
}) => {
  if (!enabled) return;

  let code = `${content}`;
  let count = 0;

  const tags = [
    ['<script', '</script>'],
    ['<style', '</style>'],
    ['<pre', '</pre>'],
  ];
  const blocks: { [marker: string]: string } = {};

  // replace tag blocks with markers
  tags.forEach((tag) => {
    let start;

    // eslint-disable-next-line no-cond-assign
    while ((start = code.indexOf(tag[0])) !== -1) {
      const end = code.indexOf(tag[1], start) + tag[1].length;
      const inner = code.slice(start, end);
      const marker = `<___marker_${count}>`;
      blocks[marker] = inner;

      code = code.substring(0, start) + marker + code.substring(end);

      count += 1;
    }
  });

  // remove surounding whitespace
  code = code.trim();

  // remove whitespace between tags
  code = code.replace(/>\s*?</gm, '><');

  // reduce multiple whitespace down to a single space
  code = code.replace(/\s{2,}/gm, ' ');

  // remove HTML comments
  code = code.replace(/<!--.*?-->/gsu, '');

  // restore script and style blocks
  Object.keys(blocks).forEach((marker) => {
    code = code.replace(marker, blocks[marker]);
  });

  // eslint-disable-next-line consistent-return
  return {
    code,
  };
};
