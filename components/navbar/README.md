[![NPM version](https://img.shields.io/npm/v/@minna-ui/navbar.svg)](https://www.npmjs.com/package/@minna-ui/navbar)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@minna-ui/navbar.svg)](https://bundlephobia.com/result?p=@minna-ui/navbar)
[![Licence](https://img.shields.io/npm/l/@minna-ui/navbar.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/navbar`

A simple navbar menu web component. It can be used standalone, in [Svelte](https://svelte.technology/guide) projects, or any JavaScript project.

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
    <link href="https://cdn.jsdelivr.net/npm/@minna-ui/navbar/dist/index.css" rel="stylesheet"/>

    <script src="https://cdn.jsdelivr.net/npm/@minna-ui/navbar"></script>
    ```

   Or use a specific version:

   <!-- prettier-ignore -->
   ```html
    <link href="https://cdn.jsdelivr.net/npm/@minna-ui/navbar@0.5.0/dist/index.css" rel="stylesheet"/>

    <script src="https://cdn.jsdelivr.net/npm/@minna-ui/navbar@0.5.0"></script>
    ```

1. Add an element where you want the component to show in your document `<body></body>`:

   ```html
   <div id="minna-navbar"></div>
   ```

1. Initialise the component:

   <!-- eslint-disable no-new -->

   ```html
   <script>
     new MinnaNavbar({
       target: document.querySelector('#minna-navbar'),
       data: {},
     });
   </script>
   ```

### Svelte projects

Because this is actually a Svelte component, using it in your Svelte projects is simple and allows for the most flexibility and best possible performance.

1. Install the package:

   ```sh
   yarn add @minna-ui/navbar
   ```

1. Add to your Svelte component:

   `MySvelteComponent.html`:

   ```html
   <MinnaNavbar />

   <script>
     import MinnaNavbar from '@minna-ui/navbar';

     export default {
       components: {
         MinnaNavbar,
       },
     };
   </script>
   ```

### Other JavaScript projects

This component can also be used alongside any JavaScript project, regardless of your framework of choice, by using ES6 modules import.

1. Install the package:

   ```sh
   yarn add @minna-ui/navbar
   ```

1. Add to your files:

   `my-example.html`:

   ```html
   <div id="minna-navbar"></div>
   ```

   `my-example.js`:

   <!-- eslint-disable no-new -->

   ```js
   import MinnaNavbar from '@minna-ui/navbar';

   new MinnaNavbar({
     data: {},
     target: document.querySelector('#minna-navbar'),
   });
   ```

## Licence

`@minna-ui/navbar` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2019 [We Are Genki](https://wearegenki.com)
