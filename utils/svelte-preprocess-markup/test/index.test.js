/* eslint-env browser */

'use strict';

const fs = require('fs');
const { promisify } = require('util');
const { preprocess, create } = require('svelte');
const preprocessMarkup = require('../index.js');

const readFile = promisify(fs.readFile);

// don't require() components to avoid Jest transform
const componentPath = require.resolve('@minna-ui/jest-config/fixtures/TestComponent.html');

const preprocessOpts = {
  markup: preprocessMarkup(),
  style: () => ({ code: '/*discarded*/' }),
};
const preprocessOptsUnsafe = {
  markup: preprocessMarkup({ unsafe: true }),
  style: () => ({ code: '/*discarded*/' }),
};
const svelteOpts = {
  filename: 'TestComponent.html',
  name: 'TestComponent',
  onwarn(warning, onwarn) {
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'development' && !/A11y:/.test(warning.message)) {
      onwarn(warning);
    }
  },
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
const sourceBadSyntax = '<div id="" class=">test</span>';
let source = '';

beforeAll(async () => {
  source = await readFile(componentPath, 'utf8');
});

describe('Svelte markup preprocessor', () => {
  it('processes a simple component', async () => {
    expect.assertions(4);
    const output = preprocess(sourceSimple, preprocessOpts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).toMatch('> <');
    expect(result).not.toMatch('><');
    expect(result).toMatchSnapshot();
  });

  it('processes a simple component unsafe', async () => {
    expect.assertions(4);
    const output = preprocess(sourceSimple, preprocessOptsUnsafe);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).toMatch('><');
    expect(result).not.toMatch('> <');
    expect(result).toMatchSnapshot();
  });

  it('processes a component', async () => {
    expect.assertions(2);
    const output = preprocess(source, preprocessOpts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).toMatchSnapshot();
  });

  it('creates and mounts a component', async () => {
    expect.assertions(1);
    const processed = await preprocess(source, preprocessOpts);
    const TestComponent = create(processed.toString(), svelteOpts);
    const target = document.createElement('div');
    new TestComponent({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('unsafe option makes output smaller', async () => {
    expect.assertions(1);
    const [unsafe, safe] = await Promise.all([
      preprocess(source, preprocessOptsUnsafe),
      preprocess(source, preprocessOpts),
    ]);
    expect(unsafe.toString().length).toBeLessThan(safe.toString().length);
  });

  it('prints error on bad HTML syntax', async () => {
    expect.assertions(1);
    const spy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    await preprocess(sourceBadSyntax, preprocessOpts);
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });
});
