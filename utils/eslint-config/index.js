/**
 * ESLint config preset for minna-ui projects.
 */

/* eslint-disable sort-keys */

'use strict';

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  extends: [
    'eslint:recommended',
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
    project: 'tsconfig.json',
    tsconfigRootDir: process.cwd(),
  },
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    'html/indent': '+2',
    'html/report-bad-indent': 'error',
    'html/xml-extensions': ['.svg', '.xhtml', 'xml'],
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
      node: {
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
    'svelte3/ignore-styles': (attr) => attr.type === 'text/postcss',
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
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        ignoredNodes: ['ConditionalExpression *'], // incompatible with prettier :'(
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-empty-interface': [
      'error',
      { allowSingleExtends: true },
    ],
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-qualifier': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/require-array-sort-compare': 'warn',
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
    'import/extensions': [
      'error',
      'ignorePackages', // do use file extensions
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-deprecated': 'warn',
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
    'jsdoc/require-returns-check': 'warn',
    'jsdoc/require-returns-type': 'warn',
    'jsdoc/valid-types': 'warn',
    'max-len': [
      'error',
      {
        code: 80, // consistency with prettier
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
    'sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }],

    // rules incompatible with prettier :'(
    'arrow-parens': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
  },

  overrides: [
    // Svelte components
    {
      files: ['*.svelte'],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
          },
        ],
        'import/no-mutable-exports': 'off',
        'no-labels': 'off',

        // NOTE: Based on airbnb-base rule but with `LabeledStatement` removed
        // Keep up to date with changes to the upstream source:
        // https://github.com/airbnb/javascript/blob/master/packages/eslint-config-airbnb-base/rules/style.js#L332
        'no-restricted-syntax': [
          'error',
          {
            selector: 'ForInStatement',
            message:
              'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
          },
          {
            selector: 'ForOfStatement',
            message:
              'iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.',
          },
          {
            selector: 'WithStatement',
            message:
              '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
          },
        ],
      },
    },

    // TypeScript
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'jsdoc/require-param': 'off',
        'jsdoc/require-returns': 'off',
        'jsdoc/valid-types': 'off',
      },
    },

    // TypeScript declaration files
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-extraneous-class': 'off',
        'no-useless-constructor': 'off', // crashes node process
      },
    },

    // config files
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
            code: 100, // consistency with prettier override
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
