/** @jest-environment node */

// import { CLIEngine } from 'eslint';
// import baseConfig from '../index.js';
// import { bad, empty, valid } from './__fixtures__';

// const cli = new CLIEngine({
//   baseConfig,
//   useEslintrc: false,
// });

describe('Base ESLint config', () => {
  it.todo('fix tests!!!');

  // it('runs on empty.js without errors', () => {
  //   expect.assertions(2);
  //   const [name, src] = empty;
  //   const result = cli.executeOnText(src, name);
  //   expect(result.errorCount).toEqual(0);
  //   expect(result.warningCount).toEqual(0);
  // });

  // it.each(valid)('runs on %s without errors', (name, src) => {
  //   expect.assertions(2);
  //   const result = cli.executeOnText(src, name);
  //   expect(result.errorCount).toEqual(0);
  //   expect(result.warningCount).toEqual(0);
  // });

  // // FIXME: Need to be more specific to avoid false positives
  // it.each(bad)('detects linting errors on %s', (name, src) => {
  //   expect.assertions(2);
  //   const result = cli.executeOnText(src, name);
  //   expect(result.errorCount).toBeGreaterThan(0);
  //   expect(result.warningCount).toBeGreaterThan(0);
  //   // FIXME: Expect not to contain broken rule defs, e.g.
  //   // "message": "Definition for rule '...' was not found"
  //   // expect(result).not.toBe(expect.arrayContaining(expect.objectContaining({ message: '' })));
  // });
});
