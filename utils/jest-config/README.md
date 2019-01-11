<!-- markdownlint-disable first-line-h1 ol-prefix -->

[![NPM version](https://img.shields.io/npm/v/@minna-ui/jest-config.svg)](https://www.npmjs.com/package/@minna-ui/jest-config)
[![Licence](https://img.shields.io/npm/l/@minna-ui/jest-config.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)

# `@minna-ui/jest-config`

Jest config preset for use when testing in [`Minna UI`](https://github.com/WeAreGenki/minna-ui) projects.

## Usage

TODO: Write me :)

For any project:

```sh
yarn add @minna-ui/jest-config jest
```

For Svelte projects:

```sh
yarn add @minna-ui/jest-config jest svelte
```

Add tasks to your `package.json`:

```json
{
  "scripts": {
    "test": "JEST_CIRCUS=1 jest --notify --watch",
    "test-ci": "JEST_CIRCUS=1 jest --coverage --runInBand --ci"
  }
}
```

## Licence

`@minna-ui/jest-config` is part of [`Minna UI`](https://github.com/WeAreGenki/minna-ui), an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

---

© 2019 [We Are Genki](https://wearegenki.com)
