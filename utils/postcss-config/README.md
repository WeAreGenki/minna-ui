<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/postcss-config.svg)](https://www.npmjs.com/package/@minna-ui/postcss-config)
[![Licence](https://img.shields.io/npm/l/@minna-ui/postcss-config.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/postcss-config`

PostCSS config preset for use in [`minna-ui`](https://github.com/WeAreGenki/minna-ui) projects or standalone.

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

### Options

| Option | Default value | Type | Description |
| --- | --- | :---: | --- |
| importPaths | `['css', 'src/css', process.cwd(), '@minna-ui/css/src/mixins']` | array | A list of paths to search when resolving `@import` rules in CSS. |
| mixinsPath | `undefined` | string | Path to a directory with additional [CSS mixins](https://github.com/postcss/postcss-mixins/blob/master/README.md). |
| standalone | `false` | boolean | Set to `true` when `@minna-ui/css` is not installed. |
| verbose | `false` | boolean | Show additional warnings. |

## Licence

`@minna-ui/postcss-config` is part of [`minna-ui`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

-----

© 2018 [We Are Genki](https://wearegenki.com)
