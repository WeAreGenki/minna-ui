<!-- markdownlint-disable first-line-h1 no-inline-html -->

[![Build status](https://img.shields.io/circleci/project/github/WeAreGenki/minna-ui.svg)](https://circleci.com/gh/WeAreGenki/minna-ui)
[![Coverage status](https://img.shields.io/codecov/c/github/WeAreGenki/minna-ui.svg)](https://codecov.io/gh/WeAreGenki/minna-ui)
[![NPM version](https://img.shields.io/npm/v/minna-ui.svg)](https://www.npmjs.com/package/minna-ui)
[![Licence](https://img.shields.io/npm/l/minna-ui.svg)](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

# minna-ui

A friendly <abbr title="User Interface">UI</abbr> framework which aims to be straightforward, intuitive, and high performance. It can be used as standalone CSS and web components or in a Svelte or other JavaScript framework project.

皆, みんな, or _minna_, is a Japanese adverb and verb meaning all, everyone, or everybody. It embodies the idea that through mindful attention to [universal design](https://en.wikipedia.org/wiki/Universal_design) concepts the framework can work well for everybody; _everyone's UI_.

___NOTE: `minna-ui` is in early development. Before we reach v1.0.0, minor releases may contain breaking changes.___

## Overview

The `minna-ui` framework is designed around the types of projects we do at [We Are Genki](https://wearegenki.com) — ecommerce, microsites, and next-gen progressive web apps — but it's flexible so you can build any UI on the web. It aims to strike a balance between easy to use predefined styles, utilities for rapid prototyping, and opinionated but customizable web components.

Under the hood components use the Svelte JavaScript framework so `minna-ui` is a great match for your Svelte based projects. All components are also available precompiled for easy use in any web project regardless of which framework you use.

**Features:**

* Universal design as a core concept
* Semi-flat design aesthetic
* Microinteractions
* High performance

**Technologies:**

* [Svelte](https://svelte.technology) components
* [PostCSS](http://postcss.org) powered CSS
* [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)

## Documentation

To see [live examples](https://wearegenki.github.io/minna-ui/#/examples) and the docs, visit [wearegenki.github.io/minna-ui](https://wearegenki.github.io/minna-ui).

### Quick start

The easiest way to get started is to get a copy of our example [project template](https://github.com/WeAreGenki/minna-ui-template):

```sh
wget https://github.com/WeAreGenki/minna-ui-template/archive/master.zip -o minna-ui-template.zip
```

## Browser compatibility

If you choose to use the [CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) options the framework provides, you'll be limited to [browsers that support it](http://caniuse.com/#feat=css-grid). Minimum browser versions include:

* Chrome for Android 61
* Android browser 56
* iOS Safari 10.3
* Chrome 57
* Firefox 52
* Safari 10.1
* Edge 16
* Opera 46

_NOTE: Old browser compatibility via progressive fallback is possible and we'll add examples in the future._

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## Licence

`minna-ui` is an Apache-2.0 licensed open source project. See [LICENCE](https://github.com/WeAreGenki/minna-ui/blob/master/LICENCE).

-----

© 2018 [We Are Genki](https://wearegenki.com)
