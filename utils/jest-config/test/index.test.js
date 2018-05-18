/* eslint-env browser */

'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const babel = require('@babel/core');
const babelPreset = require('../babel-preset.js');
const svelteTransform = require('../lib/svelte-transform.js');
const nullTransform = require('../lib/null-transform.js');

const readFile = promisify(fs.readFile);
const sourcePath = path.join(__dirname, '../fixtures/component.html');
const sourceCssPath = path.join(__dirname, '../fixtures/styles.css');

let source = '';
let sourceCss = '';

beforeAll(async () => {
  [source, sourceCss] = await Promise.all([
    readFile(sourcePath, 'utf8'),
    readFile(sourceCssPath, 'utf8'),
  ]);
});

describe('Babel preset', () => {
  it('converts ES6 modules import into CJS', async () => {
    const result = await babel.transform(`
      import Target from '../fixtures/importable.js';
      new Target();
    `, {
      babelrc: false,
      presets: [babelPreset],
    });
    expect(result.code).not.toMatch('import Target');
    expect(result.code).toMatch('use strict');
    expect(result.code).toMatch('__esModule');
  });
});

describe('Jest test runner', () => {
  it('runs basic test', () => {
    expect(2 + 3).toEqual(5);
  });

  it('handles ES6 modules correctly', () => {
    function wrapper() {
      // eslint-disable-next-line global-require
      const { shout, whisper } = require('../fixtures/importable.js');
      expect(shout('Hello')).toEqual('HELLO');
      expect(whisper('Hello')).toEqual('hello');
    }
    expect(wrapper).not.toThrow();
  });
});

describe('Null transform', () => {
  it('outputs empty content when importing CSS', () => {
    const styles = nullTransform.process(sourceCss, sourceCssPath);
    expect(styles).toEqual('');
  });
});

describe('Svelte transform', () => {
  it('compiles and mounts a component', () => {
    let SvelteComponent = svelteTransform.process(source, sourcePath);
    expect(typeof SvelteComponent.code).toEqual('string');
    SvelteComponent = eval(SvelteComponent.code); // eslint-disable-line no-eval

    const target = document.createElement('div');
    new SvelteComponent({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('has access to Svelte prototype when mounted', () => {
    let SvelteComponent = svelteTransform.process(source, sourcePath);
    SvelteComponent = eval(SvelteComponent.code); // eslint-disable-line no-eval

    const target = document.createElement('div');
    const component = new SvelteComponent({ target });

    // Svelte public methods
    const prototype = Object.getPrototypeOf(component);
    expect(prototype).toHaveProperty('destroy');
    expect(prototype).toHaveProperty('get');
    expect(prototype).toHaveProperty('fire');
    expect(prototype).toHaveProperty('on');
    expect(prototype).toHaveProperty('set');

    expect(component.get().name).toEqual('Elon Musk');
    expect(component.get().reversed).toEqual('ksuM nolE');
    component.set({ name: 'Vladimir Putin' });
    expect(component.refs.target.textContent).toEqual('test Vladimir Putin');
    expect(component.refs.reversed.textContent).toEqual('test nituP rimidalV');
  });

  // XXX: Uses require() instead of process() then eval() so imports are relative
  it('mounts components which import ES6 modules', () => {
    function wrapper() {
      // eslint-disable-next-line global-require
      const ImportsComponent = require('../fixtures/component-imports.html');
      const target = document.createElement('div');
      const component = new ImportsComponent({ target });
      expect(target.innerHTML).toEqual('Elon Musk ELON MUSK elon musk');
      expect(component.get().loud).toEqual('ELON MUSK');
      expect(component.get().quiet).toEqual('elon musk');
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
  });
});
