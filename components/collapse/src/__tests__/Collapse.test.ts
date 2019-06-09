// TODO: Add integration/UI test to check the content is visually not shown

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { tick } from 'svelte';
import Collapse from '../Collapse.svelte';

describe('Collapse component', () => {
  it('renders correctly with no props', () => {
    expect.assertions(3);
    function wrapper(): void {
      const target = document.createElement('div');
      new Collapse({ target });
      expect(target.querySelector('.collapse-hide')).not.toBeNull();
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
  });

  it('renders correctly with textOpen/textClose props', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Collapse({
      props: {
        textClose: 'less',
        textOpen: 'more',
      },
      target,
    });
    const button = target.querySelector<HTMLButtonElement>('.button-collapse')!;
    expect(button.innerHTML).toEqual('more');
    expect(target.innerHTML).toMatchSnapshot();
    component.$set({ isOpen: true });
    await tick();
    expect(button.innerHTML).toEqual('less');
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('is collapsed by default', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Collapse({ target });
    expect(component.$$.ctx.isOpen).toBeFalsy();
    expect(target.querySelector('.collapse-hide')).not.toBeNull();
  });

  it('shows collapsed content on click', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Collapse({ target });
    const button = target.querySelector('button')!;
    expect(component.$$.ctx.isOpen).toBeFalsy();
    expect(target.querySelector('.collapse-hide')).not.toBeNull();
    button.click();
    await tick();
    expect(component.$$.ctx.isOpen).toBeTruthy();
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
    expect(component.$$.ctx.isOpen).toBeTruthy();
    expect(target.querySelector('.collapse-hide')).toBeNull();
    button.click();
    await tick();
    expect(component.$$.ctx.isOpen).toBeFalsy();
    expect(target.querySelector('.collapse-hide')).not.toBeNull();
  });
});
