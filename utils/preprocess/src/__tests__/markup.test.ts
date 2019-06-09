import fs from 'fs';
import { promisify } from 'util';
// @ts-ignore - FIXME: Remove this line once the next version of Svelte is released
import { preprocess, create } from 'svelte/compiler';
import { markup } from '../markup';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);

// don't import component to avoid Jest transform
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
const sourceBadSyntax = '<div id="" class=">test</span>';
let source = '';

beforeAll(async () => {
  source = await readFile(componentPath, 'utf8');
});

describe('Svelte markup preprocessor', () => {
  it('processes without any error', () => {
    expect.assertions(2);
    const spy = jest.spyOn(process.stderr, 'write');
    function wrapper(): void {
      preprocess(sourceSimple, opts);
    }
    expect(wrapper).not.toThrow();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it.skip('processes a simple component', async () => {
    expect.assertions(4);
    const output = preprocess(sourceSimple, opts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).toMatch('> <');
    expect(result).not.toMatch('><');
    expect(result).toMatchSnapshot();
  });

  it('processes a component', async () => {
    expect.assertions(2);
    const output = preprocess(source, opts);
    await expect(output).resolves.toBeDefined();
    const result = (await output).toString();
    expect(result).toMatchSnapshot();
  });

  it.skip('creates and mounts a component', async () => {
    expect.assertions(1);
    const processed = await preprocess(source, opts);
    const TestComponent = create(processed.toString());
    const target = document.createElement('div');
    new TestComponent({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });

  it.skip('prints error on bad HTML syntax', async () => {
    expect.assertions(1);
    const spy = jest.spyOn(process.stderr, 'write');
    spy.mockImplementation(() => true);
    await preprocess(sourceBadSyntax, opts);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
