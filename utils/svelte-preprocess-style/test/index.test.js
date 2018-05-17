/** @jest-environment node */

'use strict';

const fs = require('fs');
const { promisify } = require('util');
const { preprocess, compile } = require('svelte');
const postcssNested = require('postcss-nested'); // eslint-disable-line import/no-extraneous-dependencies
const preprocessStyle = require('../index.js');

const readFile = promisify(fs.readFile);

// don't require() components to avoid Jest transform
const componentPath = require.resolve('@minna-ui/jest-config/fixtures/component.html');

const preprocessOpts = {
  style: preprocessStyle({
    plugins: [postcssNested],
  }),
};

const sourceSimple =
`<div id="target">test</div>

<style type="text/postcss">
  #target {
    color: red;

    &:focus {
      background: #000;
    }
  }
</style>`;

const sourceNoTypeAttr =
`<div id="target">test</div>

<style>
  #target {
    color: red;

    &:focus {
      background: #000;
    }
  }
</style>`;

const sourceForceGlobal =
`<style type="text/postcss" global>
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
</style>`;

const sourceBadSyntax =
`<style type="text/postcss">
  #target {
    color: red;
</style>`;

/** @type {string} */
let source;

beforeAll(async () => {
  source = await readFile(componentPath, 'utf8');
});

describe('Svelte style preprocessor', () => {
  it('processes a simple component', async () => {
    let result = await preprocess(sourceSimple, preprocessOpts);
    result = result.toString();
    expect(result).not.toMatch('&:focus');
    expect(result).toMatchSnapshot();
  });

  it('does not process without type attribute', async () => {
    let result = await preprocess(sourceNoTypeAttr, preprocessOpts);
    result = result.toString();
    expect(result).toMatch('&:focus');
    expect(result).toMatchSnapshot();
  });

  it('adds global pseudo when global attribute', async () => {
    let result = await preprocess(sourceForceGlobal, preprocessOpts);
    result = result.toString();
    expect(result).toMatch(':global(#target):focus');
    expect(result).toMatch(':global(.wrapper)+#target');
    expect(result).toMatchSnapshot();
  });

  it('processes a component', async () => {
    let result = await preprocess(source, preprocessOpts);
    result = result.toString();
    expect(result).not.toBeFalsy();
    expect(result).not.toEqual('');
    expect(result).toMatchSnapshot();
  });

  it('compiles a component\'s CSS', async () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const processed = await preprocess(source, preprocessOpts);
    const result = compile(processed.toString());
    expect(result.css.code).not.toBeFalsy();
    expect(result.css.code).toMatchSnapshot();
    expect(spy).toHaveBeenCalled(); // should have warned about unused CSS selector
    spy.mockReset();
    spy.mockRestore();
  });

  it('prints error on bad CSS syntax', async () => {
    const spy = jest.spyOn(process.stderr, 'write').mockImplementation(() => {});
    await preprocess(sourceBadSyntax, preprocessOpts);
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });
});
