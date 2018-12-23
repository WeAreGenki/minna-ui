<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/rollup-plugins.svg)](https://www.npmjs.com/package/@minna-ui/rollup-plugins)
[![Licence](https://img.shields.io/npm/l/@minna-ui/rollup-plugins.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/rollup-plugins`

Rollup plugins for use in [`Minna UI`](https://github.com/WeAreGenki/minna-ui) projects.

_Included plugins:_

- `devserver` — A simple server for development. In situations where you're not using a full-blown web app framework like [sapper](https://sapper.svelte.technology) it's still necessary to serve the web app while in development. This plugin takes care of that in a generic way. No fancy stuff like hot-reloading modules but it will hot-refresh the page after changes.
- `makeCss` — Process imported styles with PostCSS and optionally remove unused CSS with Purgecss and write it to disk.
- `makeHtml` — Minimal page builder when you don't want to use a whole framework like sapper. Process a HTML template and write the results to disk.
- `postcss` — Process imported styles with PostCSS and optionally remove unused CSS with Purgecss. It _does not_ write files to disk itself so it's ideal for systems like sapper which have their own file handling logic.

_Additional helpers:_

- `catchErr` — Simple error handler for node API methods with callbacks.
- `gitDescribe` — Get the result from the `git decribe` command which is useful when used together with [rollup-plugin-replace](https://github.com/rollup/rollup-plugin-replace) to programatically inject an app release/version.

## Usage

TODO: Write me :)

## Licence

`@minna-ui/rollup-plugins` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2018 [We Are Genki](https://wearegenki.com)
