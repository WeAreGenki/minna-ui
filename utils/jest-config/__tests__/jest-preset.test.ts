/** @jest-environment node */

/* eslint-disable @typescript-eslint/no-require-imports, global-require */

describe('Jest test runner', () => {
  it('runs basic test', () => {
    expect.assertions(1);
    expect(2 + 3).toBe(5);
  });

  it('handles ES6 modules correctly', () => {
    expect.assertions(3);
    function wrapper(): void {
      const { shout, whisper } = require('../fixtures/importable.mjs');
      expect(shout('Hello')).toBe('HELLO');
      expect(whisper('Hello')).toBe('hello');
    }
    expect(wrapper).not.toThrow();
  });
});
