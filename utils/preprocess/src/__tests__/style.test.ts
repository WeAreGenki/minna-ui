/** @jest-environment node */

// TODO: Add test for returned `dependencies`

import fs from 'fs';
import { promisify } from 'util';
import { compile, preprocess } from 'svelte/compiler';
import nested from 'postcss-nested';
import { style } from '../style';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);

// don't require() component to avoid Jest transform
const componentPath = require.resolve('@minna-ui/jest-config/fixtures/TestComponent.svelte');

const preprocessOpts = {
  style: style({
    /* stylelint-disable-next-line */ // false positive! 👾
    plugins: [nested],
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

  it('does not process without type attribute', async () => {
    expect.assertions(2);
    const result = (await preprocess(sourceNoTypeAttr, preprocessOpts)).toString();
    expect(result).toMatch('&:focus');
    expect(result).toMatchSnapshot();
  });

  it('processes a component', async () => {
    expect.assertions(4);
    const output = preprocess(source, preprocessOpts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).not.toBe(false);
    expect(result).not.toEqual('');
    expect(result).toMatchSnapshot();
  });

  it("compiles a component's CSS", async () => {
    expect.assertions(2);
    const processed = await preprocess(source, preprocessOpts);
    const result = compile(processed.toString());
    expect(result.css.code).not.toBe(false);
    expect(result.css.code).toMatchSnapshot();
  });

  it('prints error on bad CSS syntax', async () => {
    expect.assertions(1);
    const spy = jest.spyOn(process.stderr, 'write');
    spy.mockImplementation(() => true);
    await preprocess(sourceBadSyntax, preprocessOpts);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('<css input>:2:3: Unclosed block'));
    spy.mockRestore();
  });
});
