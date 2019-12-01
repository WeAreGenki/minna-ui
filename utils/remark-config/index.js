// https://github.com/remarkjs/remark-lint/blob/master/doc/rules.md

'use strict';

module.exports = {
  plugins: [
    ['remark-frontmatter', ['yaml', 'toml']],
    'remark-preset-lint-consistent',
    'remark-preset-lint-recommended',
    'remark-preset-lint-markdown-style-guide',
    'remark-validate-links',

    // Rules
    'remark-lint-emphasis-marker',
    ['lint-maximum-line-length', false],
    ['lint-list-item-indent', 'space'],
  ],
  settings: {
    emphasis: '_', // Same as prettier
  },
};
