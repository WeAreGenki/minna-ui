[![NPM version](https://img.shields.io/npm/v/@minna-ui/tooltip.svg)](https://www.npmjs.com/package/@minna-ui/tooltip)
[![Licence](https://img.shields.io/npm/l/@minna-ui/tooltip.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/tooltip`

A plugin to add tooltips as a [Svelte](https://svelte.technology/guide) action.

---

**NOTE: This package is unfinished.**

---

TODO: Write note about `@minna-ui/css` interplay/dependency.

TODO: Example image.

TODO: Add link to demo and documentation page.

## Usage

1. Install the package:

   ```sh
   yarn add @minna-ui/tooltip
   ```

1. Add to your Svelte component:

   `MySvelteComponent.svelte`:

   ```html
   <div use:tooltip="Example tooltip message">My example</div>

   <div use:tooltip="Example tooltip message" class="tooltip-right">
     My right example
   </div>

   <script>
     import tooltip from '@minna-ui/tooltip';

     export default {
       actions: {
         tooltip,
       },
     };
   </script>

   <style>
     @import '@minna-ui/tooltip';
   </style>
   ```

## Licence

`@minna-ui/tooltip` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2020 [We Are Genki](https://wearegenki.com)
