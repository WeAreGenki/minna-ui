<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/select.svg)](https://www.npmjs.com/package/@minna-ui/select)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@minna-ui/select.svg)](https://bundlephobia.com/result?p=@minna-ui/select)
[![Licence](https://img.shields.io/npm/l/@minna-ui/select.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/select`

A simple input select web component similar to the browser native `<select>` but better looking and more enjoyable to use. It can be used standalone, in [Svelte](https://svelte.technology/guide) projects, or any JavaScript project.

TODO: Write note about `@minna-ui/css` interplay/dependency.

TODO: Example image.

TODO: Add link to demo and documentation page.

## Usage

### Standalone

The easiest way to use the component is to add the CDN hosted version directly in your HTML.

> TIP: If you're already using a JavaScript bundler you should follow the [the "Other JavaScript projects"](#other-javascript-projects) instructions.

1. Add the CSS and JS to your document, inside the `<head></head>`:

```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/select/dist/index.css" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/npm/@minna-ui/select"></script>
```

Or use a specific version:

```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/select@0.0.0/dist/index.css" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/npm/@minna-ui@0.0.0/select"></script>
```

2. Add an element where you want the component to show in your document `<body></body>`:

```html
<div id="minna-select"></div>
```

3. Initialise the component:

```html
<script>
  new MinnaSelect({
    target: document.querySelector('#minna-select'),
    data: {},
  });
</script>
```

### Svelte projects

Because this is actually a Svelte component, using it in your Svelte projects is simple and allows for the most flexibility and best possible performance.

1. Install the package:

```sh
yarn add @minna-ui/select
```

2. Add to your Svelte component:

`MySvelteComponent.html`:

```html
<MinnaSelect/>

<script>
  import MinnaSelect from '@minna-ui/select';

  export default {
    components: {
      MinnaSelect,
    },
  };
</script>
```

### Other JavaScript projects

This component can also be used alongside any JavaScript project, regardless of your framework of choice, by using ES6 modules import.

1. Install the package:

```sh
yarn add @minna-ui/select
```

2. Add to your files:

`my-example.html`:

```html
<div id="minna-select"></div>
```

`my-example.js`:

```js
import MinnaSelect from '@minna-ui/select';

new MinnaSelect({
  target: document.querySelector('#minna-select'),
  data: {},
});
```

## Licence

`@minna-ui/select` is part of [`minna-ui`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

-----

© 2018 [We Are Genki](https://wearegenki.com)
