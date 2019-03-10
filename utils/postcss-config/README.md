[![NPM version](https://img.shields.io/npm/v/@minna-ui/postcss-config.svg)](https://www.npmjs.com/package/@minna-ui/postcss-config)
[![Licence](https://img.shields.io/npm/l/@minna-ui/postcss-config.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/postcss-config`

PostCSS config preset for use in [`Minna UI`](https://github.com/WeAreGenki/minna-ui) projects or standalone.

Included plugins (in execution order):

<!-- lint disable table-pipe-alignment -->
<!-- prettier-ignore -->
| Plugin | Docs | Notes |
| --- | --- | --- |
| `postcss-advanced-variables` | [link](https://github.com/jonathantneal/postcss-advanced-variables) | |
| `postcss-use` | [link](https://github.com/postcss/postcss-use) | |
| `postcss-nested` | [link](https://github.com/postcss/postcss-nested) | |
| `postcss-color-mod-function` | [link](https://github.com/jonathantneal/postcss-color-mod-function) | |
| `css-mqpacker` | [link](https://github.com/hail2u/node-css-mqpacker) | (`optimize` only) |
| `autoprefixer` | [link](https://github.com/postcss/autoprefixer) | (`optimize` only) |
| `cssnano` | [link](https://github.com/cssnano/cssnano) | (`optimize` only) |

<!-- lint enable -->

## Usage

1. Install this package and its dependencies:

   ```sh
   yarn add -D @minna-ui/postcss-config postcss postcss-scss
   ```

1. Create a `postcss.config.js` file in your project root with this package as a plugin:

   ```js
   module.exports = {
     map: true,
     plugins: {
       // the `unsafe` option is fine when compiling components separately, it
       // only becomes potentially dangerous when compiling a whole app
       '@minna-ui/postcss-config': { unsafe: true },
     },
     syntax: 'postcss-scss',
   };
   ```

1. CSS is automatically transformed with our preset PostCSS plugins, but if you need extra functionality, you can specify PostCSS plugins directly in your CSS using [`@use`](https://github.com/postcss/postcss-use) (after first installing the plugin):

   ```css
   @use postcss-extend-rule();

   .navbar-icon {
     @extend .icon;
   }
   ```

### Options

<!-- lint disable table-pipe-alignment -->
<!-- prettier-ignore -->
| Option | Default value | Type | Description |
| --- | --- | :---: | --- |
| importAlias | `{ '^##\\/(.*)$': 'src/$1' }` | object | A map of import aliases. Given a matching regex key, will replace the import path with the value. |
| importPaths | `[process.cwd(), 'src', 'src/css']` | array | A list of extra paths to search when resolving `@import` rules in CSS. First, imports will try to resolve according to the [CSS Import Resolve spec](https://jonathantneal.github.io/css-import-resolve/) and then try again with each of the `importPaths`. |
| optimize | `process.env.NODE_ENV === 'production'` | boolean | Perform optimisations to reduce output file size and minimise runtime style computation. |
| unsafe | `false` | boolean | Apply potentially unsafe transformations (e.g. combining same `@media`). |
| debug | `true` | boolean | Show useful debugging feedback (e.g. unresolved variables). |
| ...options | `undefined` | any | Any other options will be passed to all PostCSS plugins and to the `nanocss` preset options.</br></br>This can be particuarly powerful if you need to pass options when using the `@use` rule — use the plugin name as a key, as shown in the [postcss-use docs](https://github.com/postcss/postcss-use#options-1). |

<!-- lint enable -->

## Licence

`@minna-ui/postcss-config` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2019 [We Are Genki](https://wearegenki.com)
