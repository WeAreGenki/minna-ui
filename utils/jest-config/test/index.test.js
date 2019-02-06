/** @jest-environment node */

'use strict';

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
