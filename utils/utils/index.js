/* istanbul ignore file */

'use strict'; // eslint-disable-line

const { gitDescribe } = require('./git-describe');
const { handleErr } = require('./handle-err');

module.exports = {
  gitDescribe,
  handleErr,
};
