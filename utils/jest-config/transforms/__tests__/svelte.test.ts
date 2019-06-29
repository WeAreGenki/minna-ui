/* eslint-env browser */
/* eslint-disable security/detect-eval-with-expression */

import fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { process } from '../svelte.js';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);
const sourcePath = join(__dirname, '../../fixtures/TestComponent.svelte');

let source = '';

beforeAll(async () => {
  source = await readFile(sourcePath, 'utf8');
});

describe('Svelte transform', () => {
  it.skip('compiles and mounts a component', () => {
    expect.assertions(2);
    let SvelteComponent = process(source, sourcePath);
    expect(typeof SvelteComponent.code).toBe('string');
    SvelteComponent = eval(SvelteComponent.code); // eslint-disable-line no-eval

    const target = document.createElement('div');
    // @ts-ignore
    new SvelteComponent({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });

  it.skip('has access to Svelte component internals when mounted', () => {
    expect.assertions(13);
    let SvelteComponent = process(source, sourcePath);
    SvelteComponent = eval(SvelteComponent.code); // eslint-disable-line no-eval
    const target = document.createElement('div');

    // @ts-ignore
    const component = new SvelteComponent({ target });

    // svelte component internals
    expect(component.$$).toHaveProperty('fragment');
    expect(component.$$).toHaveProperty('ctx');
    expect(component.$$).toHaveProperty('update');
    expect(component.$$).toHaveProperty('on_mount');
    expect(component.$$).toHaveProperty('on_destroy');
    expect(component.$$).toHaveProperty('before_render');
    expect(component.$$).toHaveProperty('after_render');
    expect(component.$$).toHaveProperty('context');
    expect(component.$$).toHaveProperty('callbacks');

    expect(component.name).toBe('Elon Musk');
    expect(component.reversed).toBe('ksuM nolE');

    component.name = 'Vladimir Putin';

    // refs
    expect(component.target.textContent).toBe('test Vladimir Putin');
    expect(component.nameReversed.textContent).toBe('test nituP rimidalV');
  });

  // XXX: Uses require() instead of process() + eval() so imports are relative
  it('mounts components which import ES6 modules', () => {
    expect.assertions(5);
    function wrapper(): void {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, global-require
      const TestComponent = require('../../fixtures/TestComponentImports.svelte').default;
      const target = document.createElement('div');
      const component = new TestComponent({ target });
      expect(target.innerHTML).toBe('Elon Musk ELON MUSK elon musk');
      expect(component.loud).toBe('ELON MUSK');
      expect(component.quiet).toBe('elon musk');
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
  });
});
