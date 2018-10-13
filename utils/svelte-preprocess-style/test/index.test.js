/** @jest-environment node */

'use strict';

const fs = require('fs');
const { promisify } = require('util');
const { preprocess, compile } = require('svelte');
const postcssNested = require('postcss-nested'); // eslint-disable-line import/no-extraneous-dependencies
const preprocessStyle = require('../index.js');

const readFile = promisify(fs.readFile);

// don't require() components to avoid Jest transform
const componentPath = require.resolve('@minna-ui/jest-config/fixtures/TestComponent.html');

const preprocessOpts = {
  style: preprocessStyle({
    plugins: [postcssNested],
  }),
};

const sourceSimple = `
<div id="target">test</div>

<style type="text/postcss">
  #target {
    color: red;

    &:focus {
      background: #000;
    }
  }
</style>
`;
const sourceNoTypeAttr = `
<div id="target">test</div>

<style>
  #target {
    color: red;

    &:focus {
      background: #000;
    }
  }
</style>
`;
const sourceGlobal = `
<style type="text/postcss" global>
  body { margin: 0; }

  #target {
    color: red;

    .focus,
    &:focus {
      background: #000;
    }

    .wrapper + & {
      background: #222;
    }
  }
</style>
`;
const sourceGlobalOnly = `
<style global>
  body { margin: 0; }
  #target > .child { color: red; }
</style>
`;
const sourceGlobalExists = `
<style global>
  :global(body) { margin: 0; }
  :global(#target) > .child { color: red; }
</style>
`;
const sourceBadSyntax = `
<style type="text/postcss">
  #target {
    color: red;
</style>
`;
let source = '';

beforeAll(async () => {
  source = await readFile(componentPath, 'utf8');
});

describe('Svelte style preprocessor', () => {
  it('processes a simple component', async () => {
    expect.assertions(3);
    const output = preprocess(sourceSimple, preprocessOpts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).not.toMatch('&:focus');
    expect(result).toMatchSnapshot();
  });

  it('adds a banner comment', async () => {
    expect.assertions(2);
    let result = await preprocess(sourceSimple, {
      ...preprocessOpts,
      banner: '/*!\n * minna-ui\n */\n',
    });
    result = result.toString();
    expect(result).not.toMatch('&:focus');
    expect(result).toMatchSnapshot();
  });

  it('does not process without type attribute', async () => {
    expect.assertions(2);
    let result = await preprocess(sourceNoTypeAttr, preprocessOpts);
    result = result.toString();
    expect(result).toMatch('&:focus');
    expect(result).toMatchSnapshot();
  });

  it('adds global pseudo when global + type attributes', async () => {
    expect.assertions(3);
    let result = await preprocess(sourceGlobal, preprocessOpts);
    result = result.toString();
    expect(result).toMatch(':global(#target):focus');
    expect(result).toMatch(':global(.wrapper)+#target');
    expect(result).toMatchSnapshot();
  });

  it('adds global pseudo when global attribute only', async () => {
    expect.assertions(3);
    let result = await preprocess(sourceGlobalOnly, preprocessOpts);
    result = result.toString();
    expect(result).toMatch(':global(body)');
    expect(result).toMatch(':global(#target)>.child');
    expect(result).toMatchSnapshot();
  });

  it('doesn\'t add global pseudo when already exists', async () => {
    expect.assertions(3);
    let result = await preprocess(sourceGlobalExists, preprocessOpts);
    result = result.toString();
    expect(result).toMatch(':global(body)');
    expect(result).toMatch(':global(#target)>.child');
    expect(result).toMatchSnapshot();
  });

  it('processes a component', async () => {
    expect.assertions(4);
    const output = preprocess(source, preprocessOpts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).not.toBeFalsy();
    expect(result).not.toEqual('');
    expect(result).toMatchSnapshot();
  });

  it.skip('compiles a component\'s CSS', async () => {
    expect.assertions(2);
    const processed = await preprocess(source, preprocessOpts);
    const result = compile(processed.toString());
    expect(result.css.code).not.toBeFalsy();
    expect(result.css.code).toMatchSnapshot();
  });

  it('prints error on bad CSS syntax', async () => {
    expect.assertions(1);
    const spy = jest.spyOn(process.stderr, 'write');
    spy.mockImplementation(() => {});
    await preprocess(sourceBadSyntax, preprocessOpts);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
