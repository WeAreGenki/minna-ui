/**
 * Based on an existing, unmaintained project with a little clean up.
 *
 * @see https://github.com/jonathantneal/css-import-resolve
 */

/* eslint-disable security/detect-object-injection, no-confusing-arrow, no-param-reassign */

import { readFile } from 'fs';
import { isAbsolute, join, sep } from 'path';

export type ImportCacheEntry = Promise<{
  contents: string;
  file: string;
}>;

export type ImportCache = Record<string, ImportCacheEntry>;

function fileContents(file: string, cache: ImportCache): ImportCacheEntry {
  cache[file] =
    // FIXME: Is this logic wrong? Why is the lint rule triggered?
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    cache[file] ||
    new Promise((resolvePromise, rejectPromise) =>
      readFile(file, 'utf8', (error, contents) =>
        error ? rejectPromise(error) : resolvePromise({ contents, file }),
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
  // Resolve `file` as the file
  return fileContents(file, cache).catch(() =>
    // Otherwise, resolve `file.css` as the file
    fileContents(`${file}.css`, cache),
  );
}

function resolveAsDirectory(dir: string, cache: ImportCache): ImportCacheEntry {
  // Resolve the JSON contents of `dir/package.json` as `pkg`
  return jsonContents(dir, cache).then((pkg) =>
    'style' in pkg
      ? // Resolve `dir/pkg.style` as the file
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        fileContents(join(dir, pkg.style!), cache)
      : // Otherwise, resolve `dir/index.css` as the file
        fileContents(join(dir, 'index.css'), cache),
  );
}

function nodeModulesDirs(cwd: string): string[] {
  const dirs = [];
  const segments = cwd.split(sep);
  let count = segments.length;

  while (count > 0) {
    if (segments[count] !== 'node_modules') {
      // Add `/`-joined `segments[0 - count]` and `node_modules` to `dirs`
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
  // For each `dir` in the node modules directory using `cwd`
  return nodeModulesDirs(cwd).reduce(
    (promise: ImportCacheEntry, dir) =>
      promise.catch(() =>
        // Resolve as a file using `dir/id` as `file`
        resolveAsFile(join(dir, id), cache).catch(() =>
          // Otherwise, resolve as a directory using `dir/id` as `dir`
          resolveAsDirectory(join(dir, id), cache),
        ),
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
    cwd = '';
  }

  return (
    // Resolve as a file using `cwd/id` as `file`
    resolveAsFile(join(cwd, id), cache)
      // Otherwise, resolve as a directory using `cwd/id` as `dir`
      .catch(() => resolveAsDirectory(join(cwd, id), cache))
      // Otherwise, if `id` does not begin with `/`, `./`, or `../`
      .catch(() =>
        !isRelative(id) ? resolveAsModule(cwd, id, cache) : Promise.reject(),
      )
      // Otherwise, throw `"CSS Module not found"`
      .catch(() => Promise.reject(new Error('CSS Module not found')))
  );
}

/**
 * @example ```json
 * { "^##\\/(.*)$": "src/$1" }
 * ```
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
    // Replace import aliases before trying to resolve
    Object.entries(importAlias).forEach(([alias, value]) => {
      // eslint-disable-next-line security/detect-non-literal-regexp
      const aliasRe = new RegExp(alias);

      if (aliasRe.test(id)) {
        id = id.replace(aliasRe, value);
      }
    });

    return resolve(id, cwd, opts.importCache);
  };
}
