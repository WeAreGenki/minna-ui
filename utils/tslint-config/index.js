/**
 * TSLint config preset for minna-ui projects.
 */

/* tslint:disable object-literal-sort-keys */

'use strict';

const rules = {
  'comment-format': [
    true,
    'check-space',
    'check-lowercase',
    { 'ignore-pattern': '[A-Z]{2,}' },
  ],
  curly: [true, 'ignore-same-line'],
  'object-literal-sort-keys': [true, 'ignore-case', 'shorthand-first'],
  'only-arrow-functions': false,
  prettier: true,
};

module.exports = {
  extends: ['tslint:latest', 'tslint-config-airbnb', 'tslint-config-prettier'],
  linterOptions: {
    // FIXME: This doesn't currently work and must be specified in each project
    exclude: [
      '**/__sapper__/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/test/coverage/**',
    ],
    typeCheck: true,
  },
  rulesDirectory: ['tslint-plugin-prettier'],
  rules,
  jsRules: {
    ...rules,
    'no-require-imports': false,
  },
};
