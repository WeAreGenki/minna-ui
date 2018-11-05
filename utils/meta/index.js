const preMarkup = require('@minna-ui/pre-markup');
const preStyle = require('@minna-ui/pre-style');
const { catchErr, makeCss, makeHtml } = require('@minna-ui/rollup-plugins');

const prod = process.env.NODE_ENV === 'production';

/** Svelte preprocessors preset. */
const preprocess = {
  markup: preMarkup({ level: prod ? 2 : 0 }),
  style: preStyle(),
};

module.exports = {
  catchErr,
  makeCss,
  makeHtml,
  preMarkup,
  preprocess,
  preStyle,
};
