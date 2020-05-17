/* eslint-env browser */
/* eslint-disable @typescript-eslint/no-non-null-assertion, security/detect-eval-with-expression, no-eval, global-require */

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
  it('compiles and mounts a component', () => {
    expect.assertions(2);
    // @ts-expect-error
    const { code } = process(source, sourcePath);
    expect(typeof code).toBe('string');
    const { default: TestComponent } = eval(code);
    const target = document.createElement('div');
    new TestComponent({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('has access to Svelte component internals when mounted', () => {
    expect.assertions(13);
    // @ts-expect-error
    const { code } = process(source, sourcePath);
    const { default: TestComponent } = eval(code);
    const target = document.createElement('div');
    const component = new TestComponent({ target });

    // svelte component internals
    expect(component.$$).toHaveProperty('fragment');
    expect(component.$$).toHaveProperty('ctx');
    expect(component.$$).toHaveProperty('update');
    expect(component.$$).toHaveProperty('on_mount');
    expect(component.$$).toHaveProperty('on_destroy');
    expect(component.$$).toHaveProperty('before_update');
    expect(component.$$).toHaveProperty('after_update');
    expect(component.$$).toHaveProperty('context');
    expect(component.$$).toHaveProperty('callbacks');

    const name1 = target.querySelector<HTMLDivElement>('#name')!;
    expect(name1.textContent).toBe('Name: Elon Musk');
    const nameReversed1 = target.querySelector<HTMLDivElement>('#nameReversed')!;
    expect(nameReversed1.textContent).toBe('Name: ksuM nolE');
    component.name = 'Vladimir Putin';
    const name2 = target.querySelector<HTMLDivElement>('#name')!;
    expect(name2.textContent).toBe('Name: Vladimir Putin');
    const nameReversed2 = target.querySelector<HTMLDivElement>('#nameReversed')!;
    expect(nameReversed2.textContent).toBe('Name: nituP rimidalV');
  });

  it('mounts components which import ES6 modules', () => {
    expect.assertions(5);
    function wrapper(): void {
      // Use require() instead of process() + eval() so imports are relative
      const TestComponent = require('../../fixtures/TestComponentImports.svelte').default;
      const target = document.createElement('div');
      new TestComponent({ target });
      const name = target.querySelector<HTMLDivElement>('#name')!;
      expect(name.textContent).toBe('Elon Musk');
      const loud = target.querySelector<HTMLDivElement>('#loud')!;
      expect(loud.textContent).toBe('ELON MUSK');
      const quiet = target.querySelector<HTMLDivElement>('#quiet')!;
      expect(quiet.textContent).toBe('elon musk');
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
  });
});
