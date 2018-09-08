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
      functions: 'only-multiline', // awkward comma on multiline function params is OK
    }],
    'id-length': ['error', { min: 2 }], // encourage descriptive variable names
    'import/extensions': ['error', 'ignorePackages'], // do use file extentions
    'no-console': /* istanbul ignore next */ isProd ? 'error' : 'off',
    'no-debugger': /* istanbul ignore next */ isProd ? 'error' : 'off',
    'no-return-assign': ['error', 'except-parens'],
    'no-underscore-dangle': 'off', // we use __ to indicate properties to mangle
    'object-curly-newline': ['error', { consistent: true }],
    'object-curly-spacing': ['error', 'always', {
      arraysInObjects: false,
      objectsInObjects: false,
    }],
  },

  // JS config files should be node/CommonJS format
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
