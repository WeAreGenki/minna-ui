const preMarkup = require('@minna-ui/pre-markup');
const preStyle = require('@minna-ui/pre-style');

const prod = process.env.NODE_ENV === 'production';

/** Svelte preprocessors preset. */
const preprocess = {
  markup: preMarkup({ level: prod ? 2 : 0 }),
  style: preStyle(),
};

module.exports = {
  preMarkup,
  preprocess,
  preStyle,
};
