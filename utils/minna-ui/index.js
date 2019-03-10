/* istanbul ignore file */

/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'; // eslint-disable-line

const preMarkup = require('@minna-ui/pre-markup');
const preStyle = require('@minna-ui/pre-style');
const {
  catchErr,
  devserver,
  gitDescribe,
  makeCss,
  makeHtml,
  postcss,
} = require('@minna-ui/rollup-plugins');

/** Svelte preprocessor preset. */
const preprocess = {
  markup: preMarkup(),
  style: preStyle(),
};

module.exports = {
  catchErr,
  devserver,
  gitDescribe,
  makeCss,
  makeHtml,
  postcss,
  preMarkup,
  preprocess,
  preStyle,
};
