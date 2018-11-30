/* eslint-env browser */

'use strict';

const fs = require('fs');
const zlib = require('zlib');
const { promisify } = require('util');
const { preprocess, create } = require('svelte');
const preprocessMarkup = require('../index.js');

const readFile = promisify(fs.readFile);

// don't require() components to avoid Jest transform
const componentPath = require.resolve(
  '@minna-ui/jest-config/fixtures/TestComponent.html',
);

const opts = {
  markup: preprocessMarkup(),
  style: () => ({ code: '/*discarded*/' }),
};
const optsUnsafe = {
  markup: preprocessMarkup({ unsafe: true }),
  style: () => ({ code: '/*discarded*/' }),
};
const optsUnsafeWhitespace = {
  markup: preprocessMarkup({ unsafeWhitespace: true }),
  style: () => ({ code: '/*discarded*/' }),
};
const svelteOpts = {
  filename: 'TestComponent.html',
  name: 'TestComponent',
  onwarn(warning, onwarn) {
    /* istanbul ignore if */
    if (
      process.env.NODE_ENV !== 'development' &&
      !/A11y:/.test(warning.message)
    ) {
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
  it('processes without any error', () => {
    expect.assertions(2);
    const spy = jest.spyOn(process.stderr, 'write');
    function wrapper() {
      preprocess(sourceSimple, opts);
    }
    expect(wrapper).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('processes a simple component', async () => {
    expect.assertions(4);
    const output = preprocess(sourceSimple, opts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).toMatch('> <');
    expect(result).not.toMatch('><');
    expect(result).toMatchSnapshot();
  });

  it.skip('processes a simple component with unsafe', async () => {
    expect.assertions(4);
    const output = preprocess(sourceSimple, optsUnsafe);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).toMatch('> <');
    expect(result).not.toMatch('><');
    expect(result).toMatchSnapshot();
  });

  it.skip('processes a simple component with unsafeWhitespace', async () => {
    expect.assertions(4);
    const output = preprocess(sourceSimple, optsUnsafeWhitespace);
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
    const TestComponent = create(processed.toString(), svelteOpts);
    const target = document.createElement('div');
    new TestComponent({ target }); // tslint:disable-line no-unused-expression
    expect(target.innerHTML).toMatchSnapshot();
  });

  it.skip('unsafe option makes output smaller', async () => {
    expect.assertions(2);
    const [unsafe, safe] = await Promise.all([
      preprocess(sourceSimple, optsUnsafe),
      preprocess(sourceSimple, opts),
    ]);
    expect(unsafe.toString()).not.toEqual(safe.toString());
    expect(unsafe.toString().length).toBeLessThan(safe.toString().length);
  });

  it.skip("unsafe option makes output smaller when gzip'd", async () => {
    expect.assertions(1);
    const [unsafe, safe] = await Promise.all([
      preprocess(sourceSimple, optsUnsafe),
      preprocess(sourceSimple, opts),
    ]);
    const unsafeGZip = zlib.gzipSync(unsafe.toString());
    const safeGZip = zlib.gzipSync(safe.toString());
    expect(unsafeGZip.length).toBeLessThan(safeGZip.length);
  });

  it.skip('unsafeWhitespace option makes output smaller', async () => {
    expect.assertions(2);
    const [unsafeWhitespace, safe] = await Promise.all([
      preprocess(sourceSimple, optsUnsafeWhitespace),
      preprocess(sourceSimple, opts),
    ]);
    expect(unsafeWhitespace.toString()).not.toEqual(safe.toString());
    expect(unsafeWhitespace.toString().length).toBeLessThan(
      safe.toString().length,
    );
  });

  it('prints error on bad HTML syntax', async () => {
    expect.assertions(1);
    const spy = jest.spyOn(process.stderr, 'write');
    spy.mockImplementation(() => {}); // tslint:disable-line no-empty
    await preprocess(sourceBadSyntax, opts);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
