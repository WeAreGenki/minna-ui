/** @jest-environment node */

// TODO: Add tests for node.js config

'use strict';

const { CLIEngine } = require('eslint');

const linterCli = new CLIEngine({
  configFile: require.resolve('../index.js'),
  useEslintrc: false,
});

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

describe('ESLint config', () => {
  it('runs without linting errors on valid JS', () => {
    expect.assertions(2);
    const output = linterCli.executeOnText(sourceValid);
    expect(output.errorCount).toEqual(0);
    expect(output.warningCount).toEqual(0);
  });

  it('detects linting errors', () => {
    expect.assertions(2);
    const output = linterCli.executeOnText(sourceInvalid);
    expect(output.errorCount).toEqual(2);
    expect(output.warningCount).toEqual(2);
  });
});
