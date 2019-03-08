/** @jest-environment node */

import babel from '@babel/core';

const babelPreset = require.resolve('../babel-preset');
const babelTransformOpts = {
  babelrc: false,
  filename: 'test.js', // required by `@babel/preset-typescript`
  presets: [babelPreset],
};

describe('Babel preset', () => {
  it('converts ES6 modules import into CJS', () => {
    expect.assertions(3);
    const sourceJS = `
      import Target from '../../__fixtures__/importable.js';
      new Target();
    `;
    const result = babel.transform(sourceJS, babelTransformOpts);
    expect(result.code).not.toMatch('import Target');
    expect(result.code).toMatch('use strict');
    expect(result.code).toMatch('__esModule');
  });

  it('converts TS into JS', () => {
    expect.assertions(3);
    const sourceTS = `
      import Target from '../../__fixtures__/importable.js';

      declare interface ITarget {
        text?: string;
      }

      const text: string = 'test';
      const target: ITarget = new Target(text);
    `;
    const result = babel.transform(sourceTS, { ...babelTransformOpts, filename: 'test.ts' });
    expect(result.code).toMatch('const text =');
    expect(result.code).toMatch('target = new');
    expect(result.code).not.toMatch('ITarget');
  });
});
