/**
 * ESLint config preset for minna-ui projects.
 */

/* eslint-disable sort-keys */

'use strict';

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
  ],
  plugins: [
    'security',
    'import',
    'html',
    'markdown',
    'jsdoc',
    'svelte3',
    '@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 9,
    project: 'tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: process.cwd(),
    warnOnUnsupportedTypeScriptVersion: false,
  },
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    'html/html-extensions': ['.html', '.svelte'],
    'html/indent': '+2',
    'html/report-bad-indent': 'error',
    'import/ignore': ['.html', '.svelte', '.svg', '.css', '.pcss'],
    'import/parsers': {
      // TODO: Check this is still necessary since the parser is the default
      '@typescript-eslint/parser': ['.ts', '.tsx'], // enable parsing TS exports
    },
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.json', '.node'],
      },
    },
    'svelte3/extensions': ['.html', '.svelte', '.svg'],
  },
  rules: {
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Array: null,
          // Object: 'Use {} instead',
          String: {
            fixWith: 'string',
            message: 'Use string instead',
          },
        },
      },
    ],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-type-alias': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/restrict-plus-operands': 'error',
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
    'import/prefer-default-export': 'off',
    indent: 'off', // use `@typescript-eslint/indent` instead
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
        ignorePattern: 'eslint-disable',
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
      },
    ],
    'no-console': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-debugger': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-return-assign': ['error', 'except-parens'],
    'object-curly-newline': ['error', { consistent: true }],
    'sort-keys': 'error',

    // rules incompatible with prettier :'(
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
  },

  overrides: [
    // Svelte components
    {
      files: ['*html', '*.svelte', '*.svg'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'no-labels': 'off',
      },
    },
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
            ignorePattern: 'eslint-disable',
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreTrailingComments: true,
            ignoreUrls: true,
          },
        ],
      },
    },
    // markdown documentation files
    {
      files: ['*.md'],
      rules: {
        // turns off rules that don't make sense in code snippets
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        strict: 'off',
      },
    },
  ],
};
