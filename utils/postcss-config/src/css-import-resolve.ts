/**
 * Based on an existing, unmaintained project with a little clean up.
 * @see https://github.com/jonathantneal/css-import-resolve
 */

/* eslint-disable security/detect-object-injection, no-param-reassign, no-confusing-arrow */

import { readFile } from 'fs';
import { isAbsolute, join, sep } from 'path';

export type ImportCacheEntry = Promise<{
  contents: string;
  file: string;
}>;

export type ImportCache = Record<string, ImportCacheEntry>;

function fileContents(file: string, cache: ImportCache): ImportCacheEntry {
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

function jsonContents(
  dir: string,
  cache: ImportCache,
): Promise<{ style?: string }> {
  const file = join(dir, 'package.json');

  return fileContents(file, cache).then(({ contents }) => JSON.parse(contents));
}

function isRelative(id: string): boolean {
  return /^\.{0,2}\//.test(id);
}

function resolveAsFile(file: string, cache: ImportCache): ImportCacheEntry {
  // resolve `file` as the file
  return (
    fileContents(file, cache)
      // otherwise, resolve `file.css` as the file
      .catch(() => fileContents(`${file}.css`, cache))
  );
}

function resolveAsDirectory(dir: string, cache: ImportCache): ImportCacheEntry {
  // resolve the JSON contents of `dir/package.json` as `pkg`
  return jsonContents(dir, cache).then((pkg) =>
    // if `pkg` has a `style` field
    'style' in pkg
      ? // resolve `dir/pkg.style` as the file
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fileContents(join(dir, pkg.style!), cache)
      : // otherwise, resolve `dir/index.css` as the file
        fileContents(join(dir, 'index.css'), cache),
  );
}

function nodeModulesDirs(cwd: string): string[] {
  const segments = cwd.split(sep);

  let count = segments.length;

  const dirs = [];

  while (count > 0) {
    if (segments[count] !== 'node_modules') {
      // add `/`-joined `segments[0 - count]` and `node_modules` to `dirs`
      dirs.push(
        join(segments.slice(0, count).join('/') || '/', 'node_modules'),
      );
    }

    count -= 1;
  }

  return dirs;
}

function resolveAsModule(
  cwd: string,
  id: string,
  cache: ImportCache,
): ImportCacheEntry {
  // for each `dir` in the node modules directory using `cwd`
  return nodeModulesDirs(cwd).reduce(
    (promise, dir) =>
      // @ts-ignore FIXME: Can this be solved to make TS happy?
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
 *
 * @param id - File location identifier.
 * @param cwd - Working directory to resolve from.
 * @param cache - Path resolution memoization cache.
 */
export function resolve(
  id: string,
  cwd: string,
  cache: ImportCache = {},
): ImportCacheEntry {
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
}

/**
 * @example
 * { '^##\\/(.*)$': 'src/$1' }
 */
export interface ImportAlias {
  [alias: string]: string;
}

/**
 * Provides the same functionality as `resolve` but firstly replaces paths
 * with matching aliases.
 */
export function aliasedResolve(importAlias: ImportAlias): typeof resolve {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (id: string, cwd: string, opts: any): ImportCacheEntry => {
    // replace import aliases before trying to resolve
    Object.entries(importAlias).forEach(([alias, value]) => {
      // eslint-disable-next-line security/detect-non-literal-regexp
      const aliasRe = new RegExp(alias);

      if (aliasRe.test(id)) {
        // eslint-disable-next-line no-param-reassign
        id = id.replace(aliasRe, value);
      }
    });

    return resolve(id, cwd, opts.importCache);
  };
}
