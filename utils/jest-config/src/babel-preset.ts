/**
 * Babel preset for use with Jest tests.
 */

/* eslint-disable sort-keys */

import babel from '@babel/core';

export = (api: babel.ConfigAPI) => {
  api.cache.using(() => process.env.NODE_ENV);

  const isTest = api.env('test');

  return {
    presets: [isTest && '@babel/preset-typescript'].filter(Boolean),
    plugins: [
      isTest && [
        '@babel/plugin-transform-modules-commonjs',
        {
          lazy: true,
        },
      ],
    ].filter(Boolean),
  };
};
