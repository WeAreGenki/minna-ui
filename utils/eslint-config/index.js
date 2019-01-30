/**
 * ESLint config preset for minna-ui projects.
 */

/* tslint:disable object-literal-sort-keys */

/**
 * TODO: Add a README and add a note explaining why we have both TSLint AND
 * ESLint at the same time -- ESLint can do way more at the moment including
 * parsing non-JS files like HTML or markdown and lint JS contained within.
 *
 * NOTE: There is a promising project which is trying to bring TS linting into
 * ESLint. If the project becomes popular and covers most of our TSLint rules
 * then we should consider switching to a pure ESLint setup.
 * @see {@link https://github.com/typescript-eslint/typescript-eslint}
 */

'use strict';

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:security/recommended',
  ],
  plugins: ['security', 'import', 'html', 'markdown', 'jsdoc'],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    'import/ignore': ['.html', '.svg', '.pcss', '.css'],
    'import/parsers': {
      'typescript-eslint-parser': ['.ts', '.tsx'], // enable parsing TS exports
    },
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
      },
    },
  },
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline', // comma on multiline function params is OK 👌
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'id-length': ['error', { min: 2, exceptions: ['_'] }], // encourage descriptive names
    'import/extensions': ['error', 'ignorePackages'], // do use file extensions
    'jsdoc/check-examples': 'warn',
    'jsdoc/check-param-names': 'warn',
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/check-types': 'warn',
    'jsdoc/newline-after-description': ['warn', 'never'],
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-name': 'warn',
    'jsdoc/require-param-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-type': 'warn',
    'jsdoc/valid-types': 'warn',
    'max-len': [
      'error',
      {
        code: 80, // consistency with prettier + tslint (since it doesn't have autofix for max-len)
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      },
    ],
    'no-console': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-debugger': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-return-assign': ['error', 'except-parens'],
    'object-curly-newline': ['error', { consistent: true }],

    // rules incompatible with prettier :'(
    'operator-linebreak': 'off',
  },

  overrides: [
    // JS config files
    {
      files: ['*.config.js', '*rc.js'],
      excludedFiles: ['preact.config.js', 'rollup.config.js'], // use ES modules
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        // should be node CommonJS format
        commonjs: true,
        node: true,
      },
      rules: {
        // can use any installed dependency
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
            peerDependencies: true,
          },
        ],
      },
    },
    // unit tests
    {
      files: ['*.test.js', '*.spec.js'],
      env: {
        jest: true,
      },
      plugins: ['jest', 'import'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
            peerDependencies: true,
          },
        ],
        'max-len': [
          'error',
          {
            code: 100, // consistency with prettier override settings
            ignoreTrailingComments: true,
            ignoreUrls: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreRegExpLiterals: true,
          },
        ],
      },
    },
    // markdown documentation files
    {
      files: ['*.md'],
      rules: {
        // turns off rules that don't make sense in code snippets
        strict: 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
      },
    },
  ],
};
