/** @jest-environment node */

'use strict';

const path = require('path');
const babel = require('@babel/core');
const babelPreset = require('../babel-preset.js');
const { runBin } = require('../lib/helpers.js');

const cliGood = path.join(__dirname, '../fixtures/cli-good.js');
const cliError = path.join(__dirname, '../fixtures/cli-error.js');
const cliExitCode = path.join(__dirname, '../fixtures/cli-exit-code.js');

describe('Jest test runner', () => {
  it('runs basic test', () => {
    expect(2 + 3).toEqual(5);
  });

  it('handles ES6 modules correctly', () => {
    expect.assertions(3);
    function wrapper() {
      // eslint-disable-next-line global-require
      const { shout, whisper } = require('../fixtures/importable.js');
      expect(shout('Hello')).toEqual('HELLO');
      expect(whisper('Hello')).toEqual('hello');
    }
    expect(wrapper).not.toThrow();
  });
});

describe('Babel preset', () => {
  it('converts ES6 modules import into CJS', () => {
    expect.assertions(3);
    const sourceJs = `
      import Target from '../fixtures/importable.js';
      new Target();
    `;
    const result = babel.transform(sourceJs, {
      babelrc: false,
      presets: [babelPreset],
    });
    expect(result.code).not.toMatch('import Target');
    expect(result.code).toMatch('use strict');
    expect(result.code).toMatch('__esModule');
  });
});

describe('Helper functions', () => {
  it('run CLI binary without error', async () => {
    expect.assertions(2);
    const result = runBin(cliGood);
    await expect(result).resolves.toBeDefined();
    await expect(result).resolves.toContain('OK');
  });

  it('errors on CLI binary with error', async () => {
    expect.assertions(2);
    const result = runBin(cliError);
    await expect(result).rejects.toBeDefined();
    await expect(result).rejects.toContain('BAD');
  });

  it('errors on CLI binary which has non-zero exit', async () => {
    expect.assertions(2);
    const result = runBin(cliExitCode);
    await expect(result).rejects.toBeDefined();
    await expect(result).rejects.toEqual([]); // empty array
  });
});
