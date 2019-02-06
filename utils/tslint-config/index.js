/**
 * TSLint config preset for minna-ui projects.
 */

/* tslint:disable object-literal-sort-keys */

'use strict';

// lint rules shared between both TypeScript and JavaScript
const commonRules = {
  'comment-format': {
    severity: 'warning',
    options: [
      true,
      'check-space',
      'check-lowercase',
      { 'ignore-pattern': '[A-Z]{2,}' },
    ],
  },
  'completed-docs': {
    severity: 'warning',
    options: true, // FIXME: This is experimental and might be better removed
  },
  curly: [true, 'ignore-same-line'],
  'no-implicit-dependencies': [true, ['##']], // webpack/rollup alias
  'object-literal-sort-keys': [true, 'ignore-case', 'shorthand-first'],
  'only-arrow-functions': false,
  // FIXME: Remove next line once it has an auto fix available
  // https://github.com/buzinas/tslint-eslint-rules/issues/342
  'ter-arrow-parens': false, // conflicts with prettier and doesn't have fix
  // workaround for component var names in PascalCase
  // @see https://github.com/palantir/tslint-react/issues/120
  'variable-name': [true, 'ban-keywords', 'check-format', 'allow-pascal-case'],

  // security
  'ban-comma-operator': true,
};

module.exports = {
  extends: [
    'tslint:latest',
    'tslint-microsoft-contrib',
    'tslint-config-airbnb',
    'tslint-config-security',
  ],
  linterOptions: {
    /**
     * NOTE: The `exclude` option doesn't currently work in presets and must be
     * manually added in in each project. Copy+pasting these should be enough
     * for most projects.
     */
    exclude: [
      '**/*.css.d.ts',
      '**/*.pcss.d.ts',
      '__sapper__/**',
      'dist/**',
      'node_modules/**',
      'test/coverage/**',
    ],
    typeCheck: true,
  },
  rulesDirectory: ['tslint-microsoft-contrib'],
  rules: {
    ...commonRules,
    'import-name': [
      true,
      {
        '*Css': 'styles',
        '*Pcss': 'styles',
      },
    ],
  },
  jsRules: {
    ...commonRules,
    'no-require-imports': false,

    /**
     * The following rules are set up for TS but for some reason the
     * upstream package developers didn't include them for JS too.
     */
    quotemark: [true, 'single', 'avoid-escape', 'avoid-template', 'jsx-double'],
    'trailing-comma': [
      true,
      {
        multiline: 'always',
        singleline: 'never',
        esSpecCompliant: true,
      },
    ],
  },
};
