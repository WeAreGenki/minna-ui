/**
 * Jest transform for compiling Svelte components into JavaScript.
 *
 * NOTE: `svelte` is not listed as a dependency so developers can use this
 * jest preset for non-svelte projects.
 */

import { basename } from 'path';
// @ts-ignore TODO: Once svelte has types remove this exception
import { compile } from 'svelte/compiler'; // eslint-disable-line import/no-extraneous-dependencies

export function process(src: string, filename: string): jest.TransformedSource {
  // strip out <style> tags to prevent failure when unable to parse PostCSS etc.
  const re = /<style[^>]*>([\S\s]*?)<\/style>/g;
  const normalised = src.replace(re, '');

  const result = compile(normalised, {
    css: false,
    filename: basename(filename),
    format: 'cjs',
  });

  // FIXME: Remove this once upstream issue is fixed:
  // TODO: Add link to Github issue and PR once I submit them
  const esInterop = '\nObject.defineProperty(exports, "__esModule", {\n\tvalue: true\n});';

  return {
    code: result.js.code + esInterop,
    map: result.js.map,
  };
}
