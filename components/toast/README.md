[![NPM version](https://img.shields.io/npm/v/@minna-ui/toasts.svg)](https://www.npmjs.com/package/@minna-ui/toasts)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@minna-ui/toasts.svg)](https://bundlephobia.com/result?p=@minna-ui/toasts)
[![Licence](https://img.shields.io/npm/l/@minna-ui/toasts.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/toasts`

A simple "toast" notification web component. It can be used standalone, in [Svelte](https://svelte.technology/guide) projects, or any JavaScript project.

---

**NOTE: This package is unfinished.**

---

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
    <link href="https://cdn.jsdelivr.net/npm/@minna-ui/toasts/dist/index.css" rel="stylesheet"/>

    <script src="https://cdn.jsdelivr.net/npm/@minna-ui/toasts"></script>
    ```

   Or use a specific version:

   <!-- prettier-ignore -->
   ```html
    <link href="https://cdn.jsdelivr.net/npm/@minna-ui/toasts@0.0.0/dist/index.css" rel="stylesheet"/>

    <script src="https://cdn.jsdelivr.net/npm/@minna-ui@0.0.0/toasts"></script>
    ```

1. Add an element where you want the component to show in your document `<body></body>`:

   ```html
   <div id="minna-toasts"></div>
   ```

1. Initialise the component:

   ```html
   <script>
     new MinnaToasts({
       data: {},
       target: document.querySelector('#minna-toasts'),
     });
   </script>
   ```

### Svelte projects

Because this is actually a Svelte component, using it in your Svelte projects is simple and allows for the most flexibility and best possible performance.

1. Install the package:

   ```sh
   yarn add @minna-ui/toasts
   ```

1. Add to your Svelte component:

   `MySvelteComponent.svelte`:

   ```html
   <MinnaToasts />

   <script>
     import MinnaToasts from '@minna-ui/toasts';

     export default {
       components: {
         MinnaToasts,
       },
     };
   </script>
   ```

### Other JavaScript projects

This component can also be used alongside any JavaScript project, regardless of your framework of choice, by using ES6 modules import.

1. Install the package:

   ```sh
   yarn add @minna-ui/toasts
   ```

1. Add to your files:

   `my-example.html`:

   ```html
   <div id="minna-toasts"></div>
   ```

   `my-example.js`:

   <!-- eslint-disable no-new -->

   ```js
   import MinnaToasts from '@minna-ui/toasts';

   new MinnaToasts({
     data: {},
     target: document.querySelector('#minna-toasts'),
   });
   ```

## Licence

`@minna-ui/toasts` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2019 [We Are Genki](https://wearegenki.com)
