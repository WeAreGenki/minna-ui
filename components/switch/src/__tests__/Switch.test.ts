/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { tick } from 'svelte';
import Switch from '../Switch.svelte';

describe('Switch component', () => {
  it('renders correctly with no props', () => {
    expect.assertions(7);
    function wrapper(): void {
      const target = document.createElement('div');
      new Switch({ target });
      const el = target.querySelector('.switch')!;
      expect(el.getAttribute('tabindex')).toBe('0');
      expect(el.getAttribute('disabled')).toBeNull();
      expect(el.getAttribute('required')).toBeNull();
      expect(document.querySelector('.switch-checked')).toBeNull();
      expect(document.querySelector('.switch-disabled')).toBeNull();
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
  });

  it('renders with value true', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    expect(component.value).toBe(true);
    expect(target.querySelector('.switch-checked')).not.toBeNull();
  });

  it('renders with value false', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: false,
      },
      target,
    });
    expect(component.value).toBe(false);
    expect(target.querySelector('.switch-checked')).toBeNull();
  });

  it('renders with textOn/textOff props', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        textOff: 'NO',
        textOn: 'YES',
      },
      target,
    });
    expect(component.textOn).toBe('YES');
    expect(component.textOff).toBe('NO');
    const switchOn = target.querySelector('.switch-on')!;
    const switchOff = target.querySelector('.switch-off')!;
    expect(switchOn.innerHTML).toBe('YES');
    expect(switchOff.innerHTML).toBe('NO');
  });

  it('renders with mini prop', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        mini: true,
      },
      target,
    });
    expect(component.mini).toBe(true);
    expect(target.querySelector('.switch-mini')).not.toBeNull();
  });

  it('renders with disabled prop', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        disabled: true,
      },
      target,
    });
    expect(component.disabled).toBe(true);
    expect(target.querySelector('.switch-disabled')).not.toBeNull();
    expect(target.querySelector('.switch')!.getAttribute('tabindex')).toBe('-1');
  });

  it('toggles class when value changes', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: false,
      },
      target,
    });
    expect(component.value).toBe(false);
    expect(target.querySelector('.switch-checked')).toBeNull();
    component.$set({ value: true });
    await tick();
    expect(target.querySelector('.switch-checked')).not.toBeNull();
    component.$set({ value: false });
    await tick();
    expect(target.querySelector('.switch-checked')).toBeNull();
  });

  it('toggles value on click', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    expect(component.value).toBe(true);
    expect(target.querySelector('.switch-checked')).not.toBeNull();
    const el = target.querySelector<HTMLDivElement>('.switch')!;
    el.click();
    await tick();
    expect(component.value).toBe(false);
    expect(target.querySelector('.switch-checked')).toBeNull();
  });

  it('does not toggle value on click when disabled', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        disabled: true,
        value: true,
      },
      target,
    });
    expect(component.value).toBe(true);
    expect(target.querySelector('.switch-checked')).not.toBeNull();
    const el = target.querySelector<HTMLDivElement>('.switch')!;
    el.click();
    await tick();
    expect(component.value).toBe(true);
    expect(target.querySelector('.switch-checked')).not.toBeNull();
  });

  it('toggles on enter key press', async () => {
    expect.assertions(6);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    expect(component.value).toBe(true);
    expect(target.querySelector('.switch-checked')).not.toBeNull();
    const el = target.querySelector('div.switch')!;
    const event1 = new KeyboardEvent('keydown', { key: 'Enter' });
    el.dispatchEvent(event1);
    await tick();
    expect(component.value).toBe(false);
    expect(target.querySelector('.switch-checked')).toBeNull();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore - keyCode does actually exist!
    const event2 = new KeyboardEvent('keydown', { keyCode: 13 });
    el.dispatchEvent(event2);
    await tick();
    expect(component.value).toBe(true);
    expect(target.querySelector('.switch-checked')).not.toBeNull();
  });

  it('toggles on spacebar key press', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    const el = target.querySelector('div.switch')!;
    const event1 = new KeyboardEvent('keydown', { key: ' ' });
    el.dispatchEvent(event1);
    expect(component.value).toBe(false);
    const event2 = new KeyboardEvent('keydown', { key: 'Spacebar' });
    el.dispatchEvent(event2);
    expect(component.value).toBe(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore - keyCode does actually exist!
    const event3 = new KeyboardEvent('keydown', { keyCode: 32 });
    el.dispatchEvent(event3);
    expect(component.value).toBe(false);
  });

  it('does not toggle on key press when disabled', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        disabled: true,
        value: true,
      },
      target,
    });
    const el = target.querySelector('div.switch')!;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    el.dispatchEvent(event);
    expect(component.value).toBe(true);
  });

  it('does not toggle on invalid key press', () => {
    expect.assertions(8);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    const el = target.querySelector('div.switch')!;
    expect(component.value).toBe(true);
    const event1 = new KeyboardEvent('keydown', { key: 'Escape' });
    el.dispatchEvent(event1);
    expect(component.value).toBe(true);
    component.value = false;
    expect(component.value).toBe(false);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore - keyCode does actually exist!
    const event2 = new KeyboardEvent('keydown', { keyCode: 0 });
    el.dispatchEvent(event2);
    expect(component.value).toBe(false);
    component.value = true;
    expect(component.value).toBe(true);
    const event3 = new KeyboardEvent('keydown', { key: '' });
    el.dispatchEvent(event3);
    expect(component.value).toBe(true);
    component.value = false;
    expect(component.value).toBe(false);
    const event4 = new KeyboardEvent('keydown');
    el.dispatchEvent(event4);
    expect(component.value).toBe(false);
  });
});
