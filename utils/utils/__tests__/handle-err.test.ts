/** @jest-environment node */

import { handleErr } from '../handle-err';

describe('Nodejs error handler', () => {
  it('throws error when it exists', () => {
    expect.assertions(1);
    function wrapper(): void {
      handleErr(new Error('err'));
    }
    expect(wrapper).toThrow();
  });

  it("doesn't throw when error is missing", () => {
    expect.assertions(1);
    function wrapper(): void {
      handleErr();
    }
    expect(wrapper).not.toThrow();
  });

  it('throws on string input', () => {
    expect.assertions(1);
    function wrapper(): void {
      // @ts-expect-error - Wrong type on purpose
      handleErr('just a string');
    }
    expect(wrapper).toThrow();
  });
});
