<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/toggle.svg)](https://www.npmjs.com/package/@minna-ui/toggle)
[![Licence](https://img.shields.io/npm/l/@minna-ui/toggle.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/toggle`

A simple toggle switch web component similar in function to a browser native `<input type="checkbox"/>` but much better looking and more understandable by users. It can be used standalone, in [Svelte](https://svelte.technology/guide) projects, or any JavaScript project.

TODO: Write note about `@minna-ui/css` interplay/dependency.

TODO: Example image.

TODO: Add link to demo and documentation page.

## Usage

### Standalone

The easiest way to use the component is to add the CDN hosted version directly in your HTML.

> TIP: If you're already using a JavaScript bundler you should follow the [the "Other JavaScript projects"](#other-javascript-projects) instructions.

1. Add the CSS and JS to your document, inside the `<head></head>`:

```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/toggle/dist/index.css" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/npm/@minna-ui/toggle"></script>
```

Or use a specific version:

```html
<link href="https://cdn.jsdelivr.net/npm/@minna-ui/toggle@0.0.0/dist/index.css" rel="stylesheet"/>

<script src="https://cdn.jsdelivr.net/npm/@minna-ui@0.0.0/toggle"></script>
```

2. Add an element where you want the component to show in your document `<body></body>`:

```html
<div id="minna-toggle"></div>
```

3. Initialise the component:

```html
<script>
  new MinnaToggle({
    target: document.querySelector('#minna-toggle'),
    data: {},
  });
</script>
```

### Svelte projects

Because this is actually a Svelte component, using it in your Svelte projects is simple and allows for the most flexibility and best possible performance.

1. Install the package:

```sh
yarn add @minna-ui/toggle
```

2. Add to your Svelte component:

`MySvelteComponent.html`:

```html
<MinnaToggle/>

<script>
  import MinnaToggle from '@minna-ui/toggle';

  export default {
    components: {
      MinnaToggle,
    },
  };
</script>
```

### Other JavaScript projects

This component can also be used alongside any JavaScript project, regardless of your framework of choice, by using ES6 modules import.

1. Install the package:

```sh
yarn add @minna-ui/toggle
```

2. Add to your files:

`my-example.html`:

```html
<div id="minna-toggle"></div>
```

`my-example.js`:

```js
import MinnaToggle from '@minna-ui/toggle';

new MinnaToggle({
  target: document.querySelector('#minna-toggle'),
  data: {},
});
```

## Licence

`@minna-ui/toggle` is part of [`minna-ui`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

-----

© 2018 [We Are Genki](https://wearegenki.com)
