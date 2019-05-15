[![NPM version](https://img.shields.io/npm/v/@minna-ui/preprocess.svg)](https://www.npmjs.com/package/@minna-ui/preprocess)
[![Licence](https://img.shields.io/npm/l/@minna-ui/preprocess.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/preprocess`

Collection of Svelte preprocessors for use in [`Minna UI`](https://github.com/WeAreGenki/minna-ui) projects. It consists of a markup preprocessor which strips out excessive whitespace (collapses relevant whitespace down to a single space but leaves appropriate tags alone, e.g. `<pre>`, `<script>`, `<style>`) and a style preprocessor which runs styles through [PostCSS](https://github.com/postcss/postcss).

## Usage

Install:

```sh
yarn add @minna-ui/preprocess
```

Next add the preprocessor to your Svelte settings (e.g. in `webpack.config.js` or `rollup.config.js`).

If you want all our preprocessors use the all-in-one preset:

<!-- global svelte -->

```js
import { preprocess } from '@minna-ui/preprocess';

svelte({
  preprocess,
});
```

Or if you prefer, you can select the preprocessors individually:

<!-- global svelte -->

```js
import { markup, style } from '@minna-ui/preprocess';

svelte({
  preprocess: {
    markup: markup({
      // only use in production builds for better dev debugging
      enabled: process.env.NODE_ENV === 'production',
    }),
    style: style(),
  },
});
```

### Utils

You can also strip whitespace from any HTML in a string template literal by using the `html` helper:

```js
import { html } from '@minna-ui/preprocess';

const myMarkup = html`
  <div>
    <h1>My Title</h1>
  </div>
`;

console.log(myMarkup); // '<div><h1>My Title</h1></div>'
```

> Tip: If you're using rollup with the setting `treeshake.pureExternalModules = true` ([docs](https://rollupjs.org/guide/en#treeshake)), prepend the call with a pure annotation so the module is tree shaken from the final JS bundle:

<!-- prettier-ignore -->
```js
/*#__PURE__*/html`...`; // eslint-disable-line
```

## Licence

`@minna-ui/preprocess` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2019 [We Are Genki](https://wearegenki.com)
