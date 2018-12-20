/* istanbul ignore file */

'use strict'; // eslint-disable-line

const preMarkup = require('@minna-ui/pre-markup');
const preStyle = require('@minna-ui/pre-style');
const {
  catchErr,
  gitDescribe,
  makeCss,
  makeHtml,
} = require('@minna-ui/rollup-plugins');

const prod = process.env.NODE_ENV === 'production';

/** Svelte preprocessor preset. */
const preprocess = {
  markup: preMarkup({ level: prod ? 2 : 0 }),
  style: preStyle(),
};

module.exports = {
  catchErr,
  gitDescribe,
  makeCss,
  makeHtml,
  preMarkup,
  preprocess,
  preStyle,
};
