/**
 * ESLint config preset for minna-ui projects.
 */

/* tslint:disable object-literal-sort-keys */

'use strict';

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['import', 'html', 'markdown'],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.css', '.html', '.js', '.json', '.mjs', '.ts'],
      },
    },
  },
  rules: {
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline', // comma on multiline function params is OK
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'id-length': ['error', { min: 2, exceptions: ['_'] }], // encourage descriptive variable names
    'import/extensions': ['error', 'ignorePackages'], // do use file extensions
    'no-console': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-debugger': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-return-assign': ['error', 'except-parens'],
    'object-curly-newline': ['error', { consistent: true }],
    'prettier/prettier': 'error',
  },

  overrides: [
    // JS config files
    {
      files: ['*.config.js', '*rc.js'],
      excludedFiles: ['preact.config.js', 'rollup.config.js'], // uses ES6 modules
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        // should be node CommonJS format
        commonjs: true,
        node: true,
      },
      rules: {
        // can use any dependency
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
            peerDependencies: true,
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
