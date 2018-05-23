<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/tabs.svg)](https://www.npmjs.com/package/@minna-ui/tabs)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@minna-ui/tabs.svg)](https://bundlephobia.com/result?p=@minna-ui/tabs)
[![Licence](https://img.shields.io/npm/l/@minna-ui/tabs.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/tabs`

A simple multiple tabs switcher web component. It can be used standalone, in [Svelte](https://svelte.technology/guide) projects, or any JavaScript project.

-----

**NOTE: This package is unfinished.**

-----

TODO: Write note about `@minna-ui/css` interplay/dependency.

TODO: Example image.

TODO: Add link to demo and documentation page.

## Usage

### Standalone

The easiest way to use the component is to add the CDN hosted version directly in your HTML.

> TIP: If you're already using a JavaScript bundler you should follow the [the "Other JavaScript projects"](#other-javascript-projects) instructions.

1. Add the CSS and JS to your document, inside the `<head></head>`:

```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/tabs/dist/index.css" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/npm/@minna-ui/tabs"></script>
```

Or use a specific version:

```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/tabs@0.0.0/dist/index.css" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/npm/@minna-ui@0.0.0/tabs"></script>
```

2. Add an element where you want the component to show in your document `<body></body>`:

```html
<div id="minna-tabs"></div>
```

3. Initialise the component:

```html
<script>
  new MinnaTabs({
    target: document.querySelector('#minna-tabs'),
    data: {},
  });
</script>
```

### Svelte projects

Because this is actually a Svelte component, using it in your Svelte projects is simple and allows for the most flexibility and best possible performance.

1. Install the package:

```sh
yarn add @minna-ui/tabs
```

2. Add to your Svelte component:

`MySvelteComponent.html`:

```html
<MinnaTabs/>

<script>
  import MinnaTabs from '@minna-ui/tabs';

  export default {
    components: {
      MinnaTabs,
    },
  };
</script>
```

### Other JavaScript projects

This component can also be used alongside any JavaScript project, regardless of your framework of choice, by using ES6 modules import.

1. Install the package:

```sh
yarn add @minna-ui/tabs
```

2. Add to your files:

`my-example.html`:

```html
<div id="minna-tabs"></div>
```

`my-example.js`:

```js
import MinnaTabs from '@minna-ui/tabs';

new MinnaTabs({
  target: document.querySelector('#minna-tabs'),
  data: {},
});
```

## Licence

`@minna-ui/tabs` is part of [`minna-ui`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

-----

© 2018 [We Are Genki](https://wearegenki.com)
