'use strict';

const {
  notAnExportedName,
} = require('@minna-ui/jest-config/fixtures/importable.js');

const output = notAnExportedName();
console.log(output);
debugger;

module.exports = output;
