/** @jest-environment node */

import { gitDescribe } from '../git-describe.js';

describe('Git describe', () => {
  it('outputs a git reference description', () => {
    expect.assertions(2);
    const description = gitDescribe();
    expect(typeof description).toBe('string');
    // Either containing a version tag or just a short commit hash
    expect(description).toMatch(/(v\d+\.\d+\.\d+)|(^\w{7}$)/);
  });
});
