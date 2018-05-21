/**
 * Jest transform for compiling Svelte components into JavaScript.
 */

'use strict';

const svelte = require('svelte');

function process(src, filename) {
  // strip out <style> tags to prevent failure when unable to parse PostCSS/SASS etc.
  const re = /<style[^>]*>([\S\s]*?)<\/style>/g;
  const normalised = src.replace(re, '');

  const result = svelte.compile(normalised, {
    filename,
    format: 'cjs',
    css: false,
  });

  return {
    code: result.js.code,
    map: result.js.map,
  };
}

module.exports = {
  process,
};
