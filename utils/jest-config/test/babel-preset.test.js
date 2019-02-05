/** @jest-environment node */

'use strict';

const babel = require('@babel/core');

const babelPreset = require.resolve('../babel-preset.js');

describe('Babel preset', () => {
  it('converts ES6 modules import into CJS', () => {
    expect.assertions(3);
    const sourceJs = `
      import Target from '../fixtures/importable.js';
      new Target();
    `;
    const filename = 'test.js'; // required by `@babel/preset-typescript`
    const result = babel.transform(sourceJs, {
      filename,
      babelrc: false,
      presets: [babelPreset],
    });
    expect(result.code).not.toMatch('import Target');
    expect(result.code).toMatch('use strict');
    expect(result.code).toMatch('__esModule');
  });
});
