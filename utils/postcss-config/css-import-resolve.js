/**
 * Based on an existing, unmaintained project with a little clean up.
 * @see https://github.com/jonathantneal/css-import-resolve
 */

/* eslint-disable security/detect-object-injection, no-param-reassign, no-confusing-arrow */

'use strict';

const { readFile } = require('fs');
const { isAbsolute, join, sep } = require('path');

function fileContents(file, cache) {
  cache[file] =
    cache[file] ||
    new Promise((resolvePromise, rejectPromise) =>
      readFile(file, 'utf8', (error, contents) =>
        error
          ? rejectPromise(error)
          : resolvePromise({
              contents,
              file,
            }),
      ),
    );

  return cache[file];
}

function jsonContents(dir, cache) {
  const file = join(dir, 'package.json');

  return fileContents(file, cache).then(({ contents }) => JSON.parse(contents));
}

function isRelative(id) {
  return /^\.{0,2}\//.test(id);
}

function resolveAsFile(file, cache) {
  // resolve `file` as the file
  return (
    fileContents(file, cache)
      // otherwise, resolve `file.css` as the file
      .catch(() => fileContents(`${file}.css`, cache))
  );
}

function resolveAsDirectory(dir, cache) {
  // resolve the JSON contents of `dir/package.json` as `pkg`
  return jsonContents(dir, cache).then((pkg) =>
    // if `pkg` has a `style` field
    'media' in pkg
      ? // resolve `dir/pkg.style` as the file
        fileContents(join(dir, pkg.media), cache)
      : // otherwise, resolve `dir/index.css` as the file
        fileContents(join(dir, 'index.css'), cache),
  );
}

function nodeModulesDirs(cwd) {
  // segments is `cwd` split by `/`
  const segments = cwd.split(sep);

  // `count` is the length of segments
  let count = segments.length;

  // `dirs` is an empty list
  const dirs = [];

  // while `count` is greater than `0`
  while (count > 0) {
    // if `segments[count]` is not `node_modules`
    if (segments[count] !== 'node_modules') {
      // add `/`-joined `segments[0 - count]` and `node_modules` to `dirs`
      dirs.push(
        join(segments.slice(0, count).join('/') || '/', 'node_modules'),
      );
    }

    count -= 1;
  }

  // return `dirs`
  return dirs;
}

function resolveAsModule(cwd, id, cache) {
  // for each `dir` in the node modules directory using `cwd`
  return nodeModulesDirs(cwd).reduce(
    (promise, dir) =>
      promise.catch(
        // resolve as a file using `dir/id` as `file`
        () =>
          resolveAsFile(join(dir, id), cache)
            // otherwise, resolve as a directory using `dir/id` as `dir`
            .catch(() => resolveAsDirectory(join(dir, id), cache)),
      ),
    Promise.reject(),
  );
}

/**
 * Resolve the location of a file within `url(id)` from `cwd`.
 * @param {string} id File location identifier.
 * @param {string} cwd Working directory to resolve from.
 * @param {(Object<string,string>)=} cache Path resolution memoization cache.
 */
module.exports = function resolve(id, cwd, cache = {}) {
  if (isAbsolute(id)) {
    // no need to prefix with `cwd`
    cwd = '';
  }

  return (
    // resolve as a file using `cwd/id` as `file`
    resolveAsFile(join(cwd, id), cache)
      // otherwise, resolve as a directory using `cwd/id` as `dir`
      .catch(() => resolveAsDirectory(join(cwd, id), cache))
      // otherwise, if `id` does not begin with `/`, `./`, or `../`
      .catch(() =>
        !isRelative(id) ? resolveAsModule(cwd, id, cache) : Promise.reject(),
      )
      // otherwise, throw `"CSS Module not found"`
      .catch(() => Promise.reject(new Error('CSS Module not found')))
  );
};
