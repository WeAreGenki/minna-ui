/** @jest-environment node */

// TODO: Add tests for node.js config

// import { CLIEngine } from 'eslint';

// const linterCli = new CLIEngine({
//   configFile: require.resolve('../index.js'),
//   useEslintrc: false,
// });

const sourceValid = `// eslint-disable-next-line import/no-extraneous-dependencies
import { shout } from '@minna-ui/jest-config/fixtures/importable.js';

const output = shout('test');

export default output;
`;
const sourceInvalid = `
'use strict';

const { notAnExportedName } = require('@minna-ui/jest-config/fixtures/importable.js');

const output = notAnExportedName();
console.log(output);
debugger;

module.exports = output;
`;
const sourceJestValid = `/* eslint-env es6 */

'use strict';

// eslint-disable-next-line import/no-extraneous-dependencies
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
  it.skip('runs without linting errors on valid JS', () => {
    // expect.assertions(2);
    // const output = linterCli.executeOnText(sourceValid);
    // expect(output.errorCount).toEqual(0);
    // expect(output.warningCount).toEqual(0);
  });

  it.skip('detects linting errors', () => {
    // expect.assertions(2);
    // const output = linterCli.executeOnText(sourceInvalid);
    // expect(output.errorCount).toEqual(2);
    // expect(output.warningCount).toEqual(2);
  });

  // FIXME: How to trigger overrides in tests?
  describe('Jest overrides', () => {
    it.skip('runs without linting errors on valid JS', () => {
      // expect.assertions(2);
      // const output = linterCli.executeOnText(sourceJestValid);
      // expect(output.errorCount).toEqual(0);
      // expect(output.warningCount).toEqual(0);
    });

    it.skip('detects linting errors', () => {
      // expect.assertions(1);
      // const output = linterCli.executeOnText(sourceJestInvalid);
      // expect(output.errorCount).not.toEqual(0);
    });
  });
});
