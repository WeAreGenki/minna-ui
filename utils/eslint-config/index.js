/**
 * ESLint config preset for minna-ui projects.
 */

'use strict';

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    'html',
    'import',
  ],
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
        extensions: [
          '.css',
          '.html',
          '.js',
          '.json',
          '.mjs',
          '.ts',
        ],
      },
    },
  },
  rules: {
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline', // comma on multiline function params is OK
    }],
    'id-length': ['error', { min: 2, exceptions: ['_'] }], // encourage descriptive variable names
    'import/extensions': ['error', 'ignorePackages'], // do use file extensions
    'no-console': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-debugger': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-return-assign': ['error', 'except-parens'],
    'object-curly-newline': ['error', { consistent: true }],
    'prettier/prettier': 'error',
  },

  // JS config files should be node CommonJS format
  overrides: [{
    files: ['*.config.js', '*rc.js'],
    excludedFiles: ['rollup.config.js'], // uses ES6 modules
    parserOptions: {
      sourceType: 'script',
    },
    env: {
      commonjs: true,
      node: true,
    },
    rules: {
      'import/no-extraneous-dependencies': ['error', {
        devDependencies: true,
        peerDependencies: true,
      }],
    },
  }],
};
