/**
 * Jest transform for compiling Svelte components into JavaScript.
 *
 * NOTE: `svelte` is not listed as a dependency so developers can use this
 * jest preset for non-svelte projects.
 */

'use strict';

const { compile } = require('svelte/compiler'); // eslint-disable-line import/no-extraneous-dependencies

/** @type {import('../types').JestTransformer} */
exports.process = (src, filename) => {
  // Strip out <style> tags to prevent errors when unable to parse PostCSS etc.
  const re = /<style[^>]*>[\S\s]*?<\/style>/g;
  const normalised = src.replace(re, '');

  const result = compile(normalised, {
    accessors: true, // Easy access to component props for tests
    css: false,
    dev: true,
    filename,
    format: 'cjs',
    preserveWhitespace: true,
  });

  const esInterop =
    'Object.defineProperty(exports, "__esModule", { value: true });';

  return {
    code: result.js.code + esInterop,
    map: result.js.map,
  };
};
