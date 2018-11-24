<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/css.svg)](https://www.npmjs.com/package/@minna-ui/css)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@minna-ui/css.svg)](https://bundlephobia.com/result?p=@minna-ui/css)
[![Licence](https://img.shields.io/npm/l/@minna-ui/css.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/css`

CSS framework for use in [`Minna UI`](https://github.com/WeAreGenki/minna-ui) projects or standalone.

## Usage

### Pre-built

We recommend using a [custom build](#custom-build) in most projects but for quick prototyping you can use a pre-built CSS file. Simply add this to your document head for the latest version:

```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/css" rel="stylesheet" />
```

Or use a specific version:

<!-- prettier-ignore -->
```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/css@0.0.0" rel="stylesheet"/>
```

### Custom build

1. Install this package and dependencies:

```sh
yarn add @minna-ui/css \
  && yarn add -D @minna-ui/postcss-config
```

2. Set up `@minna-ui/postcss-config` according it [its usage instructions](https://github.com/WeAreGenki/minna-ui/tree/master/utils/postcss-config).

3. If you want to override the default variables, create an `import.css` and a `_variables.css` file alongside your other CSS:

`import.css`:

```css
/* README: Import this file into components for access to CSS variables */

@import '@minna-ui/css/src/import.css';
@import '_variables.css';
```

4. Import the framework into your main CSS:

```css
@import '@minna-ui/css/src';
```

5. Although optional, we highly recommend setting up [purgecss](https://github.com/FullHuman/purgecss) in your project to remove any unused styles. This will drastically reduce your CSS file size making it faster to send over the network and faster for browsers to parse when loading pages.

## Licence

`@minna-ui/css` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2018 [We Are Genki](https://wearegenki.com)
