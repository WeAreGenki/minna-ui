'use strict';

const MinnaToggle = require('../src/MinnaToggle.html');

describe('MinnaToggle component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new MinnaToggle({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with value true', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        value: true,
      },
    });
    expect(component.get().value).toEqual(true);
    expect(target.querySelector('.toggle-checked')).not.toBeNull();
  });

  it('renders with value false', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        value: false,
      },
    });
    expect(component.get().value).toEqual(false);
    expect(target.querySelector('.toggle-checked')).toBeNull();
  });

  it('renders with textOn/textOff attributes', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        textOn: 'YES',
        textOff: 'NO',
      },
    });
    expect(component.get().textOn).toEqual('YES');
    expect(component.get().textOff).toEqual('NO');
    expect(target.querySelector('.toggle-on').innerHTML).toEqual('YES');
    expect(target.querySelector('.toggle-off').innerHTML).toEqual('NO');
  });

  it('renders with mini attribute', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        mini: true,
      },
    });

    expect(component.get().mini).toBeTruthy();
    expect(target.querySelector('.toggle-mini')).not.toBeNull();
  });

  it('renders with disabled attribute', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        disabled: true,
      },
    });
    expect(component.get().disabled).toBeTruthy();
    expect(target.querySelector('.toggle-disabled')).not.toBeNull();
    expect(target.querySelector('.toggle').getAttribute('tabindex')).toEqual('-1');
  });

  it('toggles class when value changes', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        value: false,
      },
    });
    expect(component.get().value).toEqual(false);
    expect(target.querySelector('.toggle-checked')).toBeNull();
    component.set({ value: true });
    expect(target.querySelector('.toggle-checked')).not.toBeNull();
    component.set({ value: false });
    expect(target.querySelector('.toggle-checked')).toBeNull();
  });

  it('toggles value on click', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        value: true,
      },
    });
    const spy = jest.spyOn(component, '__toggle');
    target.querySelector('.toggle').click();
    expect(spy).toHaveBeenCalled();
    expect(component.get().value).toEqual(false);
    spy.mockReset();
    spy.mockRestore();
  });

  it('does not toggle value on click when disabled', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        value: true,
        disabled: true,
      },
    });
    const spy = jest.spyOn(component, '__toggle');
    target.querySelector('.toggle').click();
    expect(spy).toHaveBeenCalled();
    expect(component.get().value).toEqual(true);
    spy.mockReset();
    spy.mockRestore();
  });

  it('toggles value on key press', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        value: true,
      },
    });
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.__onKeyDown(event);
    expect(component.get().value).toEqual(false);
  });

  it('does not toggle value on key press when disabled', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        value: true,
        disabled: true,
      },
    });
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.__onKeyDown(event);
    expect(component.get().value).toEqual(true);
  });

  it('changes state on valid key press', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        value: true,
      },
    });
    const event1 = new KeyboardEvent('keydown', { key: 'Enter' });
    component.__onKeyDown(event1);
    expect(component.get().value).toEqual(false);
    const event2 = new KeyboardEvent('keydown', { keyCode: 13 });
    component.__onKeyDown(event2);
    expect(component.get().value).toEqual(true);
    const event3 = new KeyboardEvent('keydown', { key: ' ' });
    component.__onKeyDown(event3);
    expect(component.get().value).toEqual(false);
    const event4 = new KeyboardEvent('keydown', { key: 'Spacebar' });
    component.__onKeyDown(event4);
    expect(component.get().value).toEqual(true);
    const event5 = new KeyboardEvent('keydown', { keyCode: 32 });
    component.__onKeyDown(event5);
    expect(component.get().value).toEqual(false);
  });

  it('does not change state on invalid key press', () => {
    const target = document.createElement('div');
    const component = new MinnaToggle({
      target,
      data: {
        value: true,
      },
    });
    const spy = jest.spyOn(component, '__toggle');
    const event1 = new KeyboardEvent('keydown', { key: 'Escape' });
    component.__onKeyDown(event1);
    expect(component.get().value).toEqual(true);
    const event2 = new KeyboardEvent('keydown', { keyCode: 0 });
    component.__onKeyDown(event2);
    expect(component.get().value).toEqual(true);
    const event3 = new KeyboardEvent('keydown', { key: '' });
    component.__onKeyDown(event3);
    expect(component.get().value).toEqual(true);
    const event4 = new KeyboardEvent('keydown');
    component.__onKeyDown(event4);
    expect(component.get().value).toEqual(true);
    expect(spy).not.toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });
});

// console.log('!! HTML', target.innerHTML);
// console.log('!! COMPONENT', component);
