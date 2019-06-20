/**
 * Jest transform for compiling Svelte components into JavaScript.
 *
 * NOTE: `svelte` is not listed as a dependency so developers can use this
 * jest preset for non-svelte projects.
 */

'use strict';

const { basename } = require('path');
// @ts-ignore - FIXME: Remove ignore once Svelte ships with types
const { compile } = require('svelte/compiler'); // eslint-disable-line import/no-extraneous-dependencies

/** @typedef {import('jest')} jest */

/**
 * @param {string} src - File source code.
 * @param {string} filename - File name.
 * @returns {jest.TransformedSource} Transformed source code.
 */
exports.process = (src, filename) => {
  // strip out <style> tags to prevent errors when unable to parse PostCSS etc.
  const re = /<style[^>]*>[\S\s]*?<\/style>/g;
  const normalised = src.replace(re, '');

  const result = compile(normalised, {
    accessors: true, // easy access to component internals for tests
    css: false,
    filename: basename(filename),
    format: 'cjs',
  });

  const esInterop =
    'Object.defineProperty(exports, "__esModule", { value: true });';

  return {
    code: result.js.code + esInterop,
    map: result.js.map,
  };
};
