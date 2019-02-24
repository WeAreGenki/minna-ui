/**
 * Jest transform for compiling Svelte components into JavaScript.
 */

'use strict';

const { basename } = require('path');
// NOTE: `svelte` is not listed as a dependency in case developers want to use
// this package for non-svelte projects.
const { compile } = require('svelte/compiler'); // eslint-disable-line import/no-extraneous-dependencies

function process(src, filename) {
  // strip out <style> tags to prevent failure when unable to parse PostCSS etc.
  const re = /<style[^>]*>([\S\s]*?)<\/style>/g;
  const normalised = src.replace(re, '');

  const result = compile(normalised, {
    css: false,
    filename: basename(filename),
    format: 'cjs',
  });

  return {
    code: result.js.code,
    map: result.js.map,
  };
}

exports.process = process;
