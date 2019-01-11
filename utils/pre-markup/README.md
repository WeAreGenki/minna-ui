<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/pre-markup.svg)](https://www.npmjs.com/package/@minna-ui/pre-markup)
[![Licence](https://img.shields.io/npm/l/@minna-ui/pre-markup.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/pre-markup`

Svelte markup preprocessor for use in [`Minna UI`](https://github.com/WeAreGenki/minna-ui) projects. Optimise HTML before it hits Svelte for smaller output. Primarily this trim excessive white space but you can enable the `unsafe` option for advanced optimisations.

## Usage

### Install

```sh
yarn add -D @minna-ui/pre-markup
```

### Quick start

Add both `@minna-ui/pre-markup` and `@minna-ui/pre-style` with default settings to your Svelte compile options:

```js
const svelte = require('svelte');
const { preprocess } = require('minna-ui');

svelte({ preprocess });
```

### Custom configuration

Add to your Svelte compile options:

```js
const svelte = require('svelte');
const preMarkup = require('@minna-ui/pre-markup');

const dev = process.env.NODE_ENV === 'development';

svelte({
  preprocess: {
    // disable for better feedback during development
    markup: preMarkup({ level: dev ? 0 : 3 }),
  },
});
```

### Known issues

**You must wrap `{}` tags in quotes when there are `{` or `}` characters inside the tag.** The exception to this is when using spread attributes (e.g. `{...child.props}`) in which case you must _not_ use quotes.

Incorrect:

<!-- prettier-ignore -->
```html
<MinnaNavbar segment={child.segment} menuItems={[
  { url: 'example', name: 'Example' },
]}/>
```

Correct (with `"` around `{ }`):

```html
<MinnaNavbar
  segment="{child.segment}"
  menuItems="{[
  { url: 'example', name: 'Example' },
]}"
/>
```

### Options

<!-- prettier-ignore -->
| Name | Default | Type | Description |
| --- | --- | --- | --- |
| unsafeWhitespace | `false` | Boolean | Collapse _all_ whitespace between tags (instead of leaving a single space). When using this option you may need to manually add spaces, `{' '}`, around inline elements such as links. |
| unsafe | `false` | Boolean | Enable aggressive and potentially dangerous optimisations. |
| `*` | `undefined` | Any | Any other options you pass in will override the default `html-minifier` options. See the [html-minifier docs](https://github.com/kangax/html-minifier) for more info. |

## Licence

`@minna-ui/pre-markup` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2019 [We Are Genki](https://wearegenki.com)
