// https://github.com/remarkjs/remark-lint/blob/master/doc/rules.md

export = {
  plugins: [
    'remark-preset-lint-consistent',
    'remark-preset-lint-recommended',
    'remark-preset-lint-markdown-style-guide',

    // rules
    'remark-lint-emphasis-marker',
    ['lint-maximum-line-length', false],
    ['lint-list-item-indent', 'space'],
  ],
  settings: {
    emphasis: '_', // same as prettier
  },
};
