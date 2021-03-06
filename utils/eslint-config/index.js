/**
 * Minna UI base ESLint config preset.
 *
 * @file Base ESLint configuration including parsing of various file types, a
 * somewhat opinionated set of base rules, and file overrides to automate
 * applying the different rules for different files (based on file name).
 *
 * This preset makes use of file extensions to infer the file type. Make sure
 * you use the correct extension otherwise you may get incorrect lint feedback.
 *
 * TIP: If you have a TypeScript project, use the `typed` add-on config. It
 * requires extra set up steps which are outlined in the config file.
 *
 * MAINTAINERS: To debug rule performance, use a `TIMING=1` environment
 * variable, e.g. `TIMING=1 yarn eslint ...`. ESLint will print a table with
 * timing stats and highlight the slowest rules.
 *
 * @see https://eslint.org/docs/user-guide/configuring
 */

/* eslint-disable @typescript-eslint/no-magic-numbers, sort-keys */

'use strict';

const { join } = require('path');
const jestConfig = require('./jest.js');
const legacyConfig = require('./legacy.js');
const nodeJsConfig = require('./node-js.js');
const nodeTsConfig = require('./node-ts.js');

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

/** @type {import('./types').ESLintConfig} */
module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:jsdoc/recommended',
    'plugin:security/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: [
    'import',
    'html',
    'markdown',
    'jsdoc',
    'security',
    '@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
  },
  reportUnusedDisableDirectives: true,
  settings: {
    'html/indent': '+2',
    'html/report-bad-indent': ERROR,
    'html/xml-extensions': ['.svg', '.xhtml', 'xml'],
    'import/cache': Infinity, // Only OK when not using long running processes e.g. eslint-loader
    'import/extensions': [
      '.mjs',
      '.js',
      '.ts',
      '.svelte',
      '.jsx',
      '.tsx',
      '.d.ts',
    ],
    'import/ignore': ['.css', '.pcss', '.svelte'],
    'import/resolver': {
      '@minna-ui/eslint-import-resolver': {
        alias: {
          '^##\\/(.*)$': join(process.cwd(), 'src/$1'),
        },
        extensions: [
          '.mjs',
          '.js',
          '.ts',
          '.svelte',
          '.jsx',
          '.tsx',
          '.json',
          '.css',
          '.pcss',
          '.node',
          '.d.ts',
        ],
      },
    },
    jsdoc: {
      mode: 'typescript',
    },
  },
  rules: {
    /* eslint-enable sort-keys */
    '@typescript-eslint/ban-ts-ignore': WARNING,
    '@typescript-eslint/ban-types': [
      ERROR,
      {
        types: {
          Array: 'Use [] instead',
          Object: 'Use object or {} instead',
          String: {
            fixWith: 'string',
            message: 'Use string instead',
          },
        },
      },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      ERROR,
      {
        allowExpressions: true,
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/explicit-member-accessibility': [
      ERROR,
      { accessibility: 'no-public' },
    ],
    '@typescript-eslint/indent': [
      ERROR,
      2,
      {
        // ESTree spec: https://github.com/estree/estree
        // TS node types: https://git.io/fj6bE
        ignoredNodes: ['ConditionalExpression *'], // Prettier :'(
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/member-ordering': ERROR,
    '@typescript-eslint/no-empty-function': ERROR,
    '@typescript-eslint/no-empty-interface': [
      ERROR,
      { allowSingleExtends: true },
    ],
    '@typescript-eslint/no-extra-semi': ERROR,
    '@typescript-eslint/no-extraneous-class': ERROR,
    '@typescript-eslint/no-magic-numbers': [
      WARNING,
      {
        detectObjects: false,
        enforceConst: false,
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true,
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
        ignoreReadonlyClassProperties: true,
      },
    ],
    '@typescript-eslint/no-this-alias': ERROR,
    '@typescript-eslint/no-unused-vars': [
      WARNING,
      {
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-useless-constructor': ERROR,
    '@typescript-eslint/prefer-for-of': WARNING,
    '@typescript-eslint/prefer-function-type': WARNING,
    '@typescript-eslint/unified-signatures': ERROR,
    'comma-dangle': [
      ERROR,
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline', // On multiline function params is OK 👌
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'id-length': [ERROR, { exceptions: ['_'], min: 2 }], // Encourage descriptive names
    'import/extensions': [
      ERROR,
      'always',
      {
        js: 'ignorePackages',
        jsx: 'ignorePackages',
        mjs: 'ignorePackages',
        ts: 'never',
        tsx: 'never',
      },
    ],
    // FIXME: Enable after issue is resolved: https://github.com/typescript-eslint/typescript-eslint/issues/389
    // 'import/no-deprecated': WARNING,
    'import/prefer-default-export': OFF,
    indent: OFF, // Handled by `@typescript-eslint/indent`
    // FIXME: Enable after issue is resolved: https://github.com/typescript-eslint/typescript-eslint/issues/389
    // 'jsdoc/check-examples': [WARNING, { matchingFileName: 'example.md' }],
    'jsdoc/check-examples': OFF,
    'jsdoc/check-indentation': WARNING,
    'jsdoc/check-tag-names': [
      WARNING,
      { definedTags: ['externs', 'jest-environment', 'jsx'] },
    ],
    'jsdoc/require-description-complete-sentence': WARNING,
    'jsdoc/require-hyphen-before-param-description': WARNING,
    'jsdoc/require-jsdoc': OFF, // Far too annoying
    'jsdoc/require-returns': [WARNING, { forceReturnsWithAsync: true }],
    'max-classes-per-file': WARNING,
    'max-len': [
      ERROR,
      {
        code: 80, // Consistency with prettier
        ignorePattern:
          'eslint-disable|eslint-enable|@ts-ignore|stylelint-disable|@typedef',
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
      },
    ],
    'no-console': ERROR,
    'no-debugger': ERROR,
    'no-empty': [ERROR, { allowEmptyCatch: true }],
    'no-extra-semi': OFF, // Handled by `@typescript-eslint/no-extra-semi`
    'no-magic-numbers': OFF, // Handled by `@typescript-eslint/no-magic-numbers`
    'no-return-assign': [ERROR, 'except-parens'],
    'no-useless-constructor': OFF, // Handled by `@typescript-eslint/no-useless-constructor`
    'object-curly-newline': [ERROR, { consistent: true }],
    'sort-keys': [WARNING, 'asc', { caseSensitive: false, natural: true }],
    'spaced-comment': [
      ERROR,
      'always',
      {
        block: {
          balanced: true,
          exceptions: ['*'],
          markers: ['!'], // Immutable comments
        },
        line: {
          markers: ['/'], // TypeScript triple slash directives
        },
      },
    ],
    /* eslint-disable sort-keys */

    // Rules incompatible with prettier :'(
    'arrow-parens': OFF,
    'function-paren-newline': OFF,
    'implicit-arrow-linebreak': OFF,
    'operator-linebreak': OFF,

    // Rules which are too slow
    // TODO: Consider removing after issue is resolved:
    // - https://github.com/typescript-eslint/typescript-eslint/issues/389
    // - https://github.com/benmosher/eslint-plugin-import/pull/1409
    'import/default': OFF,
    'import/export': OFF,
    'import/named': OFF,
    'import/namespace': OFF,
    'import/no-cycle': OFF,
    'import/no-deprecated': OFF,
    'import/no-named-as-default-member': OFF,
    'import/no-named-as-default': OFF,
    'import/no-unused-modules': OFF,
  },

  overrides: [
    // JavaScript
    {
      files: ['*.js', '*.jsx'],
      parserOptions: nodeJsConfig.parserOptions,
      rules: nodeJsConfig.rules,
    },
    {
      files: ['*.js', '*.jsx', '*.mjs'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': OFF,
        '@typescript-eslint/explicit-member-accessibility': OFF,
      },
    },

    // ES module files
    {
      files: ['*.mjs', 'preact.config.js', 'rollup.config.js'],
      parserOptions: {
        sourceType: 'module',
      },
      env: {
        commonjs: false,
        node: true, // It's uncommon to use ESM in browsers
      },
      rules: {
        '@typescript-eslint/no-require-imports': ERROR,
      },
    },

    // JSX
    {
      files: ['*.jsx', '*.tsx'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    // TypeScript
    {
      files: ['*.ts', '*.tsx'],
      parserOptions: nodeTsConfig.parserOptions,
      rules: nodeTsConfig.rules,
    },

    // TypeScript declaration files
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-extraneous-class': OFF,
        'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
        'no-useless-constructor': OFF, // Crashes node process
        'no-var': OFF,
        'vars-on-top': OFF,
      },
    },

    // Config files
    {
      files: ['*.config.js', '*rc.js'],
      excludedFiles: ['preact.config.js', 'rollup.config.js'], // Use ES modules
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        commonjs: true,
        node: true,
      },
      rules: {
        // Can use any installed dependency
        'import/no-extraneous-dependencies': [
          ERROR,
          {
            devDependencies: true,
            peerDependencies: true,
          },
        ],
      },
    },

    // Unit tests
    {
      files: [
        '__mocks__/*',
        '__tests__/*',
        '*.spec.js',
        '*.spec.mjs',
        '*.spec.ts',
        '*.test.js',
        '*.test.jsx',
        '*.test.mjs',
        '*.test.ts',
        '*.test.tsx',
      ],
      ...jestConfig,
    },

    // Raw HTML (without transpiling)
    {
      files: ['*.html'],
      parserOptions: {
        // https://github.com/BenoitZugmeyer/eslint-plugin-html#multiple-scripts-tags-in-a-html-file
        sourceType: 'module',
      },
      env: {
        browser: true,
        commonjs: false,
        es6: false,
        node: false,
      },
      rules: legacyConfig.rules,
    },

    // Auto-generated declarations
    {
      files: ['*.css.d.ts', '*.pcss.d.ts'],
      rules: {
        '@typescript-eslint/interface-name-prefix': OFF,
        '@typescript-eslint/member-delimiter-style': OFF,
      },
    },

    // Markdown documentation files
    {
      files: ['*.md'],
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
      rules: {
        // Disable rules that don't make sense in code snippets
        '@typescript-eslint/no-var-requires': OFF,
        'import/no-extraneous-dependencies': OFF,
        'import/no-unresolved': OFF,
        'no-console': OFF,
        strict: OFF,
      },
    },
  ],
};
