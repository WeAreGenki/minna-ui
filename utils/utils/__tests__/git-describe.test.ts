/** @jest-environment node */

import { gitDescribe } from '../git-describe.js';

describe('Git describe', () => {
  it('outputs a git reference description', () => {
    expect.assertions(2);
    const description = gitDescribe();
    expect(typeof description).toBe('string');
    expect(description).toMatch(/v\d+\.\d+\.\d+/);
  });
});
