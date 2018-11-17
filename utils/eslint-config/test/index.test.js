/** @jest-environment node */

'use strict';

const path = require('path');
const { CLIEngine } = require('eslint');

const linterCli = new CLIEngine({
  useEslintrc: false,
  configFile: path.join(__dirname, '../index.js'),
});
const linterCliJest = new CLIEngine({
  useEslintrc: false,
  configFile: path.join(__dirname, '../jest.js'),
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
const sourceJestValid = `/* eslint-env es6 */

'use strict';

/* eslint-disable-next-line import/no-extraneous-dependencies */
const { target } = require('@minna-ui/jest-config/fixtures/importable.js');

test('target', () => {
  expect(target()).toEqual('');
});
`;
const sourceJestInvalid = `
import config from '@minna-ui/jest-config';

console.log(this);
const output = target();
debugger;

export default output;
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

describe('Jest ESLint config', () => {
  it('runs without linting errors on valid JS', () => {
    expect.assertions(2);
    const output = linterCliJest.executeOnText(sourceJestValid);
    expect(output.errorCount).toEqual(0);
    expect(output.warningCount).toEqual(0);
  });

  it('detects linting errors', () => {
    expect.assertions(1);
    const output = linterCliJest.executeOnText(sourceJestInvalid);
    expect(output.errorCount).not.toEqual(0);
  });
});
