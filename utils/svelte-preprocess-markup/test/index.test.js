/* eslint-env browser */

'use strict';

const fs = require('fs');
const { promisify } = require('util');
const { preprocess, compile } = require('svelte');
const preprocessMarkup = require('../index.js');

const readFile = promisify(fs.readFile);

// don't require() components to avoid Jest transform
const componentPath = require.resolve('@minna-ui/jest-config/fixtures/component.html');

const preprocessOpts = {
  markup: preprocessMarkup(),
  style: () => ({ code: '/*discarded*/' }),
};
const preprocessOptsUnsafe = {
  markup: preprocessMarkup({ unsafe: true }),
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
const sourceBadSyntax = '<div id="" class=">test</span>';
let source = '';

beforeAll(async () => {
  source = await readFile(componentPath, 'utf8');
});

describe('Svelte markup preprocessor', () => {
  it('processes a simple component', async () => {
    let result = await preprocess(sourceSimple, preprocessOpts);
    result = result.toString();
    expect(result).toMatch('> <');
    expect(result).not.toMatch('><');
    expect(result).toMatchSnapshot();
  });

  it('processes a simple component unsafe', async () => {
    let result = await preprocess(sourceSimple, preprocessOptsUnsafe);
    result = result.toString();
    expect(result).toMatch('><');
    expect(result).not.toMatch('> <');
    expect(result).toMatchSnapshot();
  });

  it('processes a component', async () => {
    let result = await preprocess(source, preprocessOpts);
    result = result.toString();
    expect(result).toMatchSnapshot();
  });

  it('compiles and mounts a component', async () => {
    const processed = await preprocess(source, preprocessOpts);
    const compiled = compile(processed.toString(), { format: 'eval' });
    const SvelteComponent = eval(compiled.js.code); // eslint-disable-line no-eval
    const target = document.createElement('div');
    new SvelteComponent({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('unsafe option makes output smaller', async () => {
    const [unsafe, safe] = await Promise.all([
      preprocess(source, preprocessOptsUnsafe),
      preprocess(source, preprocessOpts),
    ]);
    expect(unsafe.toString().length).toBeLessThan(safe.toString().length);
  });

  it('prints error on bad HTML syntax', async () => {
    const spy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    await preprocess(sourceBadSyntax, preprocessOpts);
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });
});
