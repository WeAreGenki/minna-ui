/**
 * Jest transform for compiling Svelte components into JavaScript.
 */

'use strict';

// NOTE: `svelte` is not listed as a dependency in case developers want to use
// this package for non-svelte projects.
/* tslint:disable-next-line no-implicit-dependencies */
const svelte = require('svelte'); // eslint-disable-line import/no-extraneous-dependencies

function process(src, filename) {
  // strip out <style> tags to prevent failure when unable to parse PostCSS etc.
  const re = /<style[^>]*>([\S\s]*?)<\/style>/g;
  const normalised = src.replace(re, '');

  const result = svelte.compile(normalised, {
    filename,
    css: false,
    format: 'cjs',
  });

  return {
    code: result.js.code,
    map: result.js.map,
  };
}

module.exports = {
  process,
};
