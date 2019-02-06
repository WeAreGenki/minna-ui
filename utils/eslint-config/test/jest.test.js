/** @jest-environment node */

'use strict';

const { join } = require('path');
const { CLIEngine } = require('eslint');

const linterCli = new CLIEngine({
  configFile: join(__dirname, '..', 'jest.js'),
  useEslintrc: false,
});

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

describe('Jest ESLint config', () => {
  it('runs without linting errors on valid JS', () => {
    expect.assertions(2);
    const output = linterCli.executeOnText(sourceJestValid);
    expect(output.errorCount).toEqual(0);
    expect(output.warningCount).toEqual(0);
  });

  it('detects linting errors', () => {
    expect.assertions(1);
    const output = linterCli.executeOnText(sourceJestInvalid);
    expect(output.errorCount).not.toEqual(0);
  });
});
