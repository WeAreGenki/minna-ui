/**
 * Babel preset for use with Jest tests.
 */

'use strict';

module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);

  const isTest = api.env('test');

  return {
    plugins: [isTest && '@babel/plugin-transform-modules-commonjs'].filter(
      Boolean,
    ),
  };
};
