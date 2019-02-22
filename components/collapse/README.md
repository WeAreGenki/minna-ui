[![NPM version](https://img.shields.io/npm/v/@minna-ui/collapse.svg)](https://www.npmjs.com/package/@minna-ui/collapse)
[![NPM bundle size (minified + gzip)](https://img.shields.io/bundlephobia/minzip/@minna-ui/collapse.svg)](https://bundlephobia.com/result?p=@minna-ui/collapse)
[![Licence](https://img.shields.io/npm/l/@minna-ui/collapse.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/collapse`

A simple component to expand and collapse a section of HTML. It can be used standalone, in [Svelte](https://svelte.technology/guide) projects, or any JavaScript project.

FIXME: Test if standalone version works correctly.

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
    <link href="https://cdn.jsdelivr.net/npm/@minna-ui/collapse/dist/index.css" rel="stylesheet"/>

    <script src="https://cdn.jsdelivr.net/npm/@minna-ui/collapse"></script>
    ```

   Or use a specific version:

   <!-- prettier-ignore -->
   ```html
    <link href="https://cdn.jsdelivr.net/npm/@minna-ui/collapse@0.4.1/dist/index.css" rel="stylesheet"/>

    <script src="https://cdn.jsdelivr.net/npm/@minna-ui/collapse@0.4.1"></script>
    ```

1. Add element/s where you want the component to show in your document `<body></body>`:

   <!-- prettier-ignore -->
   ```html
    <div class="minna-collapse">
      <p>This is my collapsed content.</p>
    </div>

    <div class="minna-collapse">
      <p>This is more collapsed content.</p>
    </div>
    ```

1. Initialise the component/s (this script must come after the HTML code in step 2):

   ```html
   <script>
     var collapseEls = document.querySelectorAll('.minna-collapse');
     collapseEls.forEach(function(el) {
       new MinnaCollapse({ target: el });
     });
   </script>
   ```

### Svelte projects

Because this is actually a Svelte component, using it in your Svelte projects is simple and allows for the most flexibility and best possible performance.

1. Install the package:

   ```sh
   yarn add @minna-ui/collapse
   ```

1. Add to your Svelte component:

   `MySvelteComponent.html`:

   <!-- prettier-ignore -->
   ```html
    <MinnaCollapse>
      <p>This is my collapsed content.</p>
    </MinnaCollapse>

    <script>
      import MinnaCollapse from '@minna-ui/collapse';

      export default {
        components: {
          MinnaCollapse,
        },
      };
    </script>
    ```

### Other JavaScript projects

This component can also be used alongside any JavaScript project, regardless of your framework of choice, by using ES6 modules import.

1. Install the package:

   ```sh
   yarn add @minna-ui/collapse
   ```

1. Add to your files:

   `my-example.html`:

   <!-- prettier-ignore -->
   ```html
    <div class="minna-collapse">
      <p>This is my collapsed content.</p>
    </div>

    <div class="minna-collapse">
      <p>This is more collapsed content.</p>
    </div>
    ```

   `my-example.js`:

   <!-- eslint-disable no-new -->

   ```js
   import MinnaCollapse from '@minna-ui/collapse';

   const collapseEls = document.querySelectorAll('.minna-collapse');
   collapseEls.forEach((el) => {
     new MinnaCollapse({ target: el });
   });
   ```

## Licence

`@minna-ui/collapse` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2019 [We Are Genki](https://wearegenki.com)
