<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/svelte-preprocess-markup.svg)](https://www.npmjs.com/package/@minna-ui/svelte-preprocess-markup)
[![Licence](https://img.shields.io/npm/l/@minna-ui/svelte-preprocess-markup.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/svelte-preprocess-markup`

Svelte markup preprocessor for use in [`minna-ui`](https://github.com/WeAreGenki/minna-ui) projects. Optimise HTML before it hits Svelte for smaller output. Primarily this trim excessive whitespace but you can enable the `unsafe` option for advanced optimisations.

## Usage

Install:

```sh
yarn add -D @minna-ui/svelte-preprocess-markup
```

Add to your Svelte compile options:

```js
const preprocessMarkup = require('@minna-ui/svelte-preprocess-markup');

const isProd = process.env.NODE_ENV === 'production';

svelte({
  preprocess: {
    // only remove whitespace in production for better feedback during development
    ...(isProd ? { markup: preprocessMarkup() } : {}),
  },
}),
```

### Known issues

**You must wrap `{}` tags in quotes when there are `{` or `}` characters inside the tag.** The exception to this is when using spread attributes (e.g. `{...child.props}`) in which case you must _not_ use quotes.

Incorrect:

```html
<MinnaNavbar segment={child.segment} menuItems={[
  { url: 'example', name: 'Example' },
]}/>
```

Correct (with `"` around `{ }`):

```html
<MinnaNavbar segment="{child.segment}" menuItems="{[
  { url: 'example', name: 'Example' },
]}"/>
```

### Options

| Name | Default | Type | Description |
| --- | --- | --- | --- |
| unsafeWhitespace | `false` | Boolean | Collapse _all_ whitespace between tags (instead of leaving a single space). When using this option you may need to manually add spaces, `{' '}`, around inline elements such as links. |
| unsafe | `false` | Boolean | Enable aggressive and potentially dangerous optimisations. |
| `*` | `undefined` | Any | Any other options you pass in will override the default `html-minifier` options. See the [html-minifier docs](https://github.com/kangax/html-minifier) for more info. |

## Licence

`@minna-ui/svelte-preprocess-markup` is part of [`minna-ui`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

-----

© 2018 [We Are Genki](https://wearegenki.com)
