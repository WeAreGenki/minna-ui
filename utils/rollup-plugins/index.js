'use strict';

// helpers
const catchErr = require('./lib/catchErr.js');
const gitDescribe = require('./lib/gitDescribe.js');

// rollup plugins
const makeCss = require('./lib/makeCss.js');
const makeHtml = require('./lib/makeHtml.js');

module.exports = {
  catchErr,
  gitDescribe,
  makeCss,
  makeHtml,
};
