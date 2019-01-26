/** @jest-environment node */

// TODO: Add tests for node.js config

'use strict';

// const { join } = require('path');
const { CLIEngine } = require('eslint');
const baseConfig = require('../index.js');

const linterCli = new CLIEngine({
  // configFile: join(__dirname, '..', 'index.js'),
  baseConfig,
  useEslintrc: false,
});

const sourceValid = `/* eslint-disable-next-line import/no-extraneous-dependencies */
import { target } from '@minna-ui/jest-config/fixtures/importable.js';

const output = target();

export default output;
`;
const sourceInvalid = `
'use strict';

const { target } = require('@minna-ui/jest-config/fixtures/importable.js');

const output = target();
console.log(output);
debugger;

module.exports = output;
`;

describe('ESLint config', () => {
  it('runs without linting errors on valid JS', () => {
    expect.assertions(2);
    const output = linterCli.executeOnText(sourceValid);
    expect(output.errorCount).toEqual(0);
    expect(output.warningCount).toEqual(0);
  });

  it('detects linting errors', () => {
    expect.assertions(1);
    const output = linterCli.executeOnText(sourceInvalid);
    expect(output.errorCount).not.toEqual(0);
  });
});
