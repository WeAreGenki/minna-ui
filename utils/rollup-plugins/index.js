'use strict';

// helpers
const catchErr = require('./lib/catchErr.js');
const gitDescribe = require('./lib/gitDescribe.js');

// rollup plugins
const devserver = require('./lib/devserver.js');
const makeCss = require('./lib/makeCss.js');
const makeHtml = require('./lib/makeHtml.js');
const postcss = require('./lib/postcss.js');

module.exports = {
  catchErr,
  devserver,
  gitDescribe,
  makeCss,
  makeHtml,
  postcss,
};
