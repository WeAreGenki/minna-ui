/* eslint-disable security/detect-object-injection */

interface ISveltePreprocessOpts {
  attributes: {
    type: string;
    [x: string]: string;
  };
  content: string;
  filename: string;
}

interface IBlocks {
  [x: string]: string;
}

/**
 * Minna UI svelte markup preprocessor.
 * Reduces the whitespace in svelte components to a minimum.
 * @param opts User defined options.
 * @param opts.enabled Should the preprocessor be run?
 */
export = ({ enabled = true } = {}) => async ({
  content,
}: ISveltePreprocessOpts) => {
  if (!enabled) return;

  let html = `${content}`;
  let count = 0;

  const tags = [['<script', '</script>'], ['<style', '</style>']];
  const blocks: IBlocks = {};

  // replace tag blocks with markers
  tags.forEach((tag) => {
    let start;

    // eslint-disable-next-line no-cond-assign
    while ((start = html.indexOf(tag[0])) !== -1) {
      const end = html.indexOf(tag[1], start) + tag[1].length;
      const inner = html.slice(start, end);
      const marker = `<___marker_${count}>`;
      blocks[marker] = inner;

      html = html.substring(0, start) + marker + html.substring(end);

      count += 1;
    }
  });

  // remove surounding whitespace
  html = html.trim();

  // remove whitespace between tags
  html = html.replace(/>\s*?</gm, '><');

  // reduce multiple whitespace down to a single space
  html = html.replace(/\s{2,}/gm, ' ');

  // restore script and style blocks
  Object.keys(blocks).forEach((marker) => {
    html = html.replace(marker, blocks[marker]);
  });

  // eslint-disable-next-line consistent-return
  return {
    code: html,
  };
};
