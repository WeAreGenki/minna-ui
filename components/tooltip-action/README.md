<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/tooltip-action.svg)](https://www.npmjs.com/package/@minna-ui/tooltip-action)
[![Licence](https://img.shields.io/npm/l/@minna-ui/tooltip-action.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/tooltip-action`

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
yarn add @minna-ui/tooltip-action
```

2. Add to your Svelte component:

`MySvelteComponent.html`:

```html
<div use:tooltip="Example tooltip message">My example</div>

<div use:tooltip="Example tooltip message" class="tooltip-right">
  My right example
</div>

<script>
  import tooltip from '@minna-ui/tooltip-action';

  export default {
    actions: {
      tooltip,
    },
  };
</script>

<style>
  @import '@minna-ui/tooltip-action';
</style>
```

## Licence

`@minna-ui/tooltip-action` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2018 [We Are Genki](https://wearegenki.com)
