<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/switch.svg)](https://www.npmjs.com/package/@minna-ui/switch)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@minna-ui/switch.svg)](https://bundlephobia.com/result?p=@minna-ui/switch)
[![Licence](https://img.shields.io/npm/l/@minna-ui/switch.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/switch`

A simple togglable switch web component similar in function to a browser native `<input type="checkbox"/>` but better looking and more understandable by users. It can be used standalone, in [Svelte](https://svelte.technology/guide) projects, or any JavaScript project.

TODO: Write note about `@minna-ui/css` interplay/dependency.

TODO: Example image.

TODO: Add link to demo and documentation page.

## Usage

### Standalone

The easiest way to use the component is to add the CDN hosted version directly in your HTML.

> TIP: If you're already using a JavaScript bundler you should follow the [the "Other JavaScript projects"](#other-javascript-projects) instructions.

1. Add the CSS and JS to your document, inside the `<head></head>`:

<!-- prettier-ignore -->
```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/switch/dist/index.css" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/npm/@minna-ui/switch"></script>
```

Or use a specific version:

<!-- prettier-ignore -->
```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/switch@0.5.0/dist/index.css" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/npm/@minna-ui/switch@0.5.0"></script>
```

2. Add an element where you want the component to show in your document `<body></body>`:

```html
<div id="minna-switch"></div>
```

3. Initialise the component:

<!-- eslint-disable no-new -->

```html
<script>
  new MinnaSwitch({
    target: document.querySelector('#minna-switch'),
    data: {},
  });
</script>
```

### Svelte projects

Because this is actually a Svelte component, using it in your Svelte projects is simple and allows for the most flexibility and best possible performance.

1. Install the package:

```sh
yarn add @minna-ui/switch
```

2. Add to your Svelte component:

`MySvelteComponent.html`:

```html
<MinnaSwitch/>

<script>
  import MinnaSwitch from '@minna-ui/switch';

  export default {
    components: {
      MinnaSwitch,
    },
  };
</script>
```

### Other JavaScript projects

This component can also be used alongside any JavaScript project, regardless of your framework of choice, by using ES6 modules import.

1. Install the package:

```sh
yarn add @minna-ui/switch
```

2. Add to your files:

`my-example.html`:

```html
<div id="minna-switch"></div>
```

`my-example.js`:

```js
import MinnaSwitch from '@minna-ui/switch';

/* eslint-disable-next-line no-new */
new MinnaSwitch({
  target: document.querySelector('#minna-switch'),
  data: {},
});
```

## Licence

`@minna-ui/switch` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2018 [We Are Genki](https://wearegenki.com)
