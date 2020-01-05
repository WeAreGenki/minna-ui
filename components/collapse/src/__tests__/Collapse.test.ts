// TODO: Add integration/UI test to check the content is visually not shown

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { tick } from 'svelte';
import Collapse from '../Collapse.svelte';
import UseSlot from './__fixtures__/UseSlot.svelte';

describe('Collapse component', () => {
  it('renders correctly with no props', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new Collapse({ target });
    expect(target.querySelector('.collapse-hide')).not.toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it("doesn't log errors or warnings with required props", () => {
    expect.assertions(2);
    const spy1 = jest.spyOn(console, 'error');
    const spy2 = jest.spyOn(console, 'warn');
    const target = document.createElement('div');
    new Collapse({ target });
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('renders correctly with textOpen/textClose props', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Collapse({
      props: {
        textClose: 'close',
        textOpen: 'open',
      },
      target,
    });
    const button = target.querySelector<HTMLButtonElement>('.button-collapse')!;
    expect(button.innerHTML).toBe('open');
    expect(target.innerHTML).toMatchSnapshot();
    component.$set({ isOpen: true });
    await tick();
    expect(button.innerHTML).toBe('close');
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders slot content correctly', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new UseSlot({ target });
    expect(target.querySelector('p.lead')).not.toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('is collapsed by default', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Collapse({ target });
    expect(component.isOpen).toBe(false);
    expect(target.querySelector('.collapse-hide')).not.toBeNull();
  });

  it('shows collapsed content on click', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Collapse({ target });
    const button = target.querySelector('button')!;
    expect(component.isOpen).toBe(false);
    expect(target.querySelector('.collapse-hide')).not.toBeNull();
    button.click();
    await tick();
    expect(component.isOpen).toBe(true);
    expect(target.querySelector('.collapse-hide')).toBeNull();
  });

  it('hides collapsed content on click', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Collapse({
      props: {
        isOpen: true,
      },
      target,
    });
    const button = target.querySelector('button')!;
    expect(component.isOpen).toBe(true);
    expect(target.querySelector('.collapse-hide')).toBeNull();
    button.click();
    await tick();
    expect(component.isOpen).toBe(false);
    expect(target.querySelector('.collapse-hide')).not.toBeNull();
  });
});
