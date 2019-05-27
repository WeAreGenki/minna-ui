/** @jest-environment node */

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import postcss from 'postcss';
import postcssConfig from '../index';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);
const jestConfigPath = require.resolve('@minna-ui/jest-config');
const fixturesPath = path.join(path.dirname(jestConfigPath), 'fixtures');
const sourceCssPath = path.join(fixturesPath, 'import.css');
// const sourceCssMixinPath = path.join(fixturesPath, 'mixin.css');
// const mixinsPath = path.join(fixturesPath, 'css-mixins');

const options = {
  from: sourceCssPath,
  map: {
    // annotation: true,
    inline: false,
  },
};

let sourceCss = '';
// let sourceCssMixin = '';

beforeAll(async () => {
  // [sourceCss, sourceCssMixin] = await Promise.all([
  //   readFile(sourceCssPath, 'utf8'),
  //   readFile(sourceCssMixinPath, 'utf8'),
  // ]);
  sourceCss = await readFile(sourceCssPath, 'utf8');
});

describe('PostCSS config', () => {
  it('compiles valid CSS', async () => {
    expect.assertions(5);
    const output = postcss(postcssConfig()).process(sourceCss, options);
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.processor!.plugins).not.toHaveLength(0);
    expect(result.opts!.from).toBeDefined();
    expect(result.map).toBeDefined();
    expect(result.css).toMatchSnapshot();
  });

  it('compiles CSS with optimize option true', async () => {
    expect.assertions(5);
    const output = postcss(postcssConfig({ optimize: true })).process(sourceCss, options);
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.processor!.plugins).not.toHaveLength(0);
    expect(result.opts!.from).toBeDefined();
    expect(result.map).toBeDefined();
    expect(result.css).toMatchSnapshot();
  });

  it('compiles CSS with optimize option false', async () => {
    expect.assertions(5);
    const output = postcss(postcssConfig({ optimize: false })).process(sourceCss, options);
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.processor!.plugins).not.toHaveLength(0);
    expect(result.opts!.from).toBeDefined();
    expect(result.map).toBeDefined();
    expect(result.css).toMatchSnapshot();
  });

  it('compiles CSS with unsafe option true', async () => {
    expect.assertions(5);
    const output = postcss(postcssConfig({ optimize: true, unsafe: true })).process(
      sourceCss,
      options,
    );
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.processor!.plugins).not.toHaveLength(0);
    expect(result.opts!.from).toBeDefined();
    expect(result.map).toBeDefined();
    expect(result.css).toMatchSnapshot();
  });

  it('compiles CSS with unsafe option false', async () => {
    expect.assertions(5);
    const output = postcss(postcssConfig({ optimize: true, unsafe: false })).process(
      sourceCss,
      options,
    );
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.processor!.plugins).not.toHaveLength(0);
    expect(result.opts!.from).toBeDefined();
    expect(result.map).toBeDefined();
    expect(result.css).toMatchSnapshot();
  });

  it.skip('compiles CSS with debug option true', async () => {
    expect.assertions(6);
    const spy = jest.spyOn(global.console, 'log');
    spy.mockImplementation(() => {});
    const output = postcss(postcssConfig({ debug: true })).process(sourceCss, options);
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.processor!.plugins).not.toHaveLength(0);
    expect(result.opts!.from).toBeDefined();
    expect(result.map).toBeDefined();
    expect(result.css).toMatchSnapshot();
    expect(spy).toHaveBeenCalledTimes(2); // should log import path twice
    spy.mockRestore();
  });

  it('compiles CSS with debug option false', async () => {
    expect.assertions(6);
    const spy = jest.spyOn(global.console, 'log');
    spy.mockImplementation(() => {});
    const output = postcss(postcssConfig({ debug: false })).process(sourceCss, options);
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.processor!.plugins).not.toHaveLength(0);
    expect(result.opts!.from).toBeDefined();
    expect(result.map).toBeDefined();
    expect(result.css).toMatchSnapshot();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it.todo('writes correct import path');
  it.todo('writes correct import path with importAlias option');
  it.todo('compiles with importPaths option');
  it.todo('compiles with custom options');
  it.todo('supports $var compile-time variables');
  it.todo('supports --var runtime variables');
  it.todo('supports @import');
  it.todo('supports @mixin');
  it.todo('supports inline comments');
  it.todo('supports inline comments in imports');
});
