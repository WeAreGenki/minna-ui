/**
 * Babel preset for use with Jest tests.
 */

'use strict';

module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const isTest = api.env('test');

  return {
    presets: [isTest && '@babel/preset-typescript'].filter(Boolean),
    plugins: [isTest && '@babel/plugin-transform-modules-commonjs'].filter(
      Boolean,
    ),
  };
};
