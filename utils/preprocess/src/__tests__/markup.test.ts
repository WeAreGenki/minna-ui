/* eslint-env browser */

import { process as transform } from '@minna-ui/jest-config/transforms/es.js'; // eslint-disable-line import/no-extraneous-dependencies
import fs from 'fs';
import { promisify } from 'util';
import { compile, preprocess } from 'svelte/compiler';
import { markup } from '../markup';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);

// Don't import component to avoid Jest transform
const componentPath = require.resolve('@minna-ui/jest-config/fixtures/TestComponent.svelte');

const opts = {
  markup: markup(),
  style: () => ({ code: '/*discarded*/' }),
};

const sourceSimple = `
<div id="target">
  test

  </div>

    <hr class="one two three">

  <input type="text" name="test" class ="" readonly="readonly">

      whitespace

  <!-- comment -->
  <!---->
`;
let source = '';

beforeAll(async () => {
  source = await readFile(componentPath, 'utf8');
});

describe('Svelte markup preprocessor', () => {
  it('processes without any error', async () => {
    expect.assertions(3);
    const spy1 = jest.spyOn(process.stderr, 'write');
    const spy2 = jest.spyOn(console, 'error');
    await expect(() => preprocess(sourceSimple, opts)).not.toThrow();
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('processes a simple component', async () => {
    expect.assertions(4);
    const output = preprocess(sourceSimple, opts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).toMatch('><');
    expect(result).not.toMatch('> <');
    expect(result).toMatchSnapshot();
  });

  it('processes a component', async () => {
    expect.assertions(2);
    const output = preprocess(source, opts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).toMatchSnapshot();
  });

  it('creates and mounts a component', async () => {
    expect.assertions(1);
    const processed = await preprocess(source, opts);
    const result = compile(processed.toString());
    // eslint-disable-next-line no-eval, security/detect-eval-with-expression
    const TestComponent = eval(transform(result.js.code, 'component.ts').code);
    const target = document.createElement('div');
    new TestComponent({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
