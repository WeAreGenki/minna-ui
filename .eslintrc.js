// https://eslint.org/docs/user-guide/configuring

'use strict';

module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:import/recommended',
  ],
  parserOptions: {
    ecmaVersion: 9,
    sourceType: 'script',
  },
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
};
