<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/postcss-config.svg)](https://www.npmjs.com/package/@minna-ui/postcss-config)
[![Licence](https://img.shields.io/npm/l/@minna-ui/postcss-config.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/postcss-config`

PostCSS config preset for use in [`minna-ui`](https://github.com/WeAreGenki/minna-ui) projects or standalone.

TODO: List included plugins, what they do, and documentation links.

## Usage

1. Install this package and its `postcss` dependency:

```sh
yarn add -D postcss @minna-ui/postcss-config
```

2. Create a `postcss.config.js` file in your project root with this package as a plugin:

```js
const minnaUiPostcssConfig = require('@minna-ui/postcss-config');

module.exports = {
  plugins: [
    minnaUiPostcssConfig({
      verbose: process.env.NODE_ENV === 'development',
    }),
  ],
};
```

3. CSS is automatically transformed with our preset PostCSS plugins, but if you need extra functionality, you can optionally specify PostCSS plugins directly in your CSS using [`@use`](https://github.com/postcss/postcss-use) (after first installing the plugin):

```css
@use postcss-extend-rule();

.navbar-icon {
  @extend .icon; /* stylelint-disable-line at-rule-no-unknown */
}
```

### Options

| Option | Default value | Type | Description |
| --- | --- | :---: | --- |
| importPaths | `[process.cwd(), 'css', 'src', 'src/css', '@minna-ui/css/src']` | array | A list of paths to search when resolving `@import` rules in CSS. |
| mixinsPath | `undefined` | string | Path to a directory with additional [CSS mixins](https://github.com/postcss/postcss-mixins/blob/master/README.md). |
| variables | `{}` | object | Allows overriding component style variables (CSS custom properties). More info in [plugin docs](https://github.com/postcss/postcss-custom-properties). |
| optimize | `true` | boolean | Perform additional optimisations to prepare for production use and minimise output file size. |
| optimizeSafe | `false` | boolean | Don't apply potentially unsafe transformations. See [cssnano advanced transforms](https://cssnano.co/guides/advanced-transforms/). |
| standalone | `false` | boolean | Set to `true` when `@minna-ui/css` is not installed. |
| verbose | `false` | boolean | Show additional warnings. |
| debug | `false` | boolean | Unlock additional debugging features; preserve and append CSS variables, and show warnings. |

## Licence

`@minna-ui/postcss-config` is part of [`minna-ui`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

-----

© 2018 [We Are Genki](https://wearegenki.com)
