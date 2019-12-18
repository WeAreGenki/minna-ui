/** @jest-environment node */

import path from 'path';
import { runBin } from '../helpers.js';

const cliGood = path.join(__dirname, '../fixtures/cli-good.js');
const cliError = path.join(__dirname, '../fixtures/cli-error.js');
const cliExitCode = path.join(__dirname, '../fixtures/cli-exit-code.js');

describe('Helper functions', () => {
  it('runs CLI binary without error', async () => {
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
    await expect(result).rejects.toStrictEqual([]); // empty array
  });
});
