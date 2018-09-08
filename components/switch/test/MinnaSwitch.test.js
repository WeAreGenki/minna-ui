'use strict';

const MinnaSwitch = require('../src/MinnaSwitch.html');

describe('MinnaSwitch component', () => {
  it('renders correctly with no props', () => {
    expect.assertions(7);
    function wrapper() {
      const target = document.createElement('div');
      new MinnaSwitch({ target });
      const el = target.querySelector('.switch');
      expect(el.getAttribute('tabindex')).toEqual('0');
      expect(el.getAttribute('disabled')).toBeNull();
      expect(el.getAttribute('required')).toBeNull();
      expect(document.querySelector('switch-checked')).toBeNull();
      expect(document.querySelector('switch-disabled')).toBeNull();
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
  });

  it('renders with value true', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        value: true,
      },
    });
    expect(component.get().value).toEqual(true);
    expect(target.querySelector('.switch-checked')).not.toBeNull();
  });

  it('renders with value false', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        value: false,
      },
    });
    expect(component.get().value).toEqual(false);
    expect(target.querySelector('.switch-checked')).toBeNull();
  });

  it('renders with textOn/textOff props', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        textOn: 'YES',
        textOff: 'NO',
      },
    });
    expect(component.get().textOn).toEqual('YES');
    expect(component.get().textOff).toEqual('NO');
    expect(target.querySelector('.switch-on').innerHTML).toEqual('YES');
    expect(target.querySelector('.switch-off').innerHTML).toEqual('NO');
  });

  it('renders with mini prop', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        mini: true,
      },
    });
    expect(component.get().mini).toBeTruthy();
    expect(target.querySelector('.switch-mini')).not.toBeNull();
  });

  it('renders with disabled prop', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        disabled: true,
      },
    });
    expect(component.get().disabled).toBeTruthy();
    expect(target.querySelector('.switch-disabled')).not.toBeNull();
    expect(target.querySelector('.switch').getAttribute('tabindex')).toEqual('-1');
  });

  it('toggles class when value changes', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        value: false,
      },
    });
    expect(component.get().value).toEqual(false);
    expect(target.querySelector('.switch-checked')).toBeNull();
    component.set({ value: true });
    expect(target.querySelector('.switch-checked')).not.toBeNull();
    component.set({ value: false });
    expect(target.querySelector('.switch-checked')).toBeNull();
  });

  it('toggles value on click', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        value: true,
      },
    });
    const spy = jest.spyOn(component, '_toggle');
    target.querySelector('.switch').click();
    expect(spy).toHaveBeenCalled();
    expect(component.get().value).toEqual(false);
    spy.mockReset();
    spy.mockRestore();
  });

  it('does not toggle value on click when disabled', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        value: true,
        disabled: true,
      },
    });
    const spy = jest.spyOn(component, '_toggle');
    target.querySelector('.switch').click();
    expect(spy).toHaveBeenCalled();
    expect(component.get().value).toEqual(true);
    spy.mockReset();
    spy.mockRestore();
  });

  it('toggles on enter key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        value: true,
      },
    });
    const event1 = new KeyboardEvent('keydown', { key: 'Enter' });
    component._onKeyDown(event1);
    expect(component.get().value).toEqual(false);
    const event2 = new KeyboardEvent('keydown', { keyCode: 13 });
    component._onKeyDown(event2);
    expect(component.get().value).toEqual(true);
  });

  it('toggles on spacebar key press', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        value: true,
      },
    });
    const event1 = new KeyboardEvent('keydown', { key: ' ' });
    component._onKeyDown(event1);
    expect(component.get().value).toEqual(false);
    const event2 = new KeyboardEvent('keydown', { key: 'Spacebar' });
    component._onKeyDown(event2);
    expect(component.get().value).toEqual(true);
    const event3 = new KeyboardEvent('keydown', { keyCode: 32 });
    component._onKeyDown(event3);
    expect(component.get().value).toEqual(false);
  });

  it('does not toggle on key press when disabled', () => {
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        value: true,
        disabled: true,
      },
    });
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component._onKeyDown(event);
    expect(component.get().value).toEqual(true);
  });

  it('does not toggle on invalid key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new MinnaSwitch({
      target,
      data: {
        value: true,
      },
    });
    const spy = jest.spyOn(component, '_toggle');
    const event1 = new KeyboardEvent('keydown', { key: 'Escape' });
    component._onKeyDown(event1);
    expect(component.get().value).toEqual(true);
    const event2 = new KeyboardEvent('keydown', { keyCode: 0 });
    component._onKeyDown(event2);
    expect(component.get().value).toEqual(true);
    const event3 = new KeyboardEvent('keydown', { key: '' });
    component._onKeyDown(event3);
    expect(component.get().value).toEqual(true);
    const event4 = new KeyboardEvent('keydown');
    component._onKeyDown(event4);
    expect(component.get().value).toEqual(true);
    expect(spy).not.toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });
});
