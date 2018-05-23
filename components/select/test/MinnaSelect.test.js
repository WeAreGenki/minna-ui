'use strict';

const MinnaSelect = require('../src/MinnaSelect.html');

const options = [
  { id: 'au', text: 'Australia' },
  { id: 'cn', text: 'China' },
  { id: 'jp', text: 'Japan' },
  { id: 'kr', text: 'Korea' },
  { id: 'other', text: 'Other / Unknown' },
];
const optionsDisabled = [
  { id: '0', text: 'Zero', disabled: true },
  { id: '1', text: 'One' },
  { id: '2', text: 'Two', disabled: true },
  { id: '3', text: 'Three' },
  { id: '4', text: 'Four', disabled: true },
  { id: '5', text: 'Five', disabled: true },
  { id: '6', text: 'Six', disabled: true },
  { id: '7', text: 'Seven' },
  { id: '8', text: 'Eight', disabled: true },
  { id: '9', text: 'Nine', disabled: true },
];
const selectOpts = {
  options,
  id: 'test-select',
  value: '',
};

describe('MinnaSelect component', () => {
  it('throws error with no props', () => {
    expect.assertions(1);
    function wrapper() {
      const target = document.createElement('div');
      new MinnaSelect({ target });
    }
    expect(wrapper).toThrow();
  });

  it('renders correctly with required props set', () => {
    expect.assertions(10);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const select = target.querySelector('.select');
    expect(Array.isArray(component.get().options)).toEqual(true);
    expect(component.get().options).not.toHaveLength(0);
    expect(component.refs.__target).toBeDefined();
    expect(select.getAttribute('tabindex')).toEqual('0');
    expect(select.getAttribute('disabled')).toBeNull();
    expect(select.getAttribute('required')).toBeNull();
    expect(select.getAttribute('placeholder')).not.toBeFalsy();
    expect(document.querySelector('select-active')).toBeNull();
    expect(document.querySelector('select-disabled')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  // FIXME: Add more assertions than just a snapshot
  // TODO: Make sure __selected is set to correct value
  it('renders with value set', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        value: 'jp',
      },
    });
    expect(target.innerHTML).toMatchSnapshot();
  });

  // FIXME: Add more assertions than just a snapshot
  it('renders with filterable prop set false', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        filterable: false,
      },
    });
    expect(target.innerHTML).toMatchSnapshot();
  });

  // FIXME: Add more assertions than just a snapshot
  it('renders with filterHelp prop', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        filterHelp: 'Filter me',
      },
    });
    expect(target.innerHTML).toMatchSnapshot();
  });

  // FIXME: Add more assertions than just a snapshot
  it('renders with placeholder prop', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        placeholder: 'Hold your places',
      },
    });
    expect(target.innerHTML).toMatchSnapshot();
  });

  // FIXME: Add more assertions than just a snapshot
  it('renders with disabled prop', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        disabled: true,
      },
    });
    expect(target.innerHTML).toMatchSnapshot();
  });

  // FIXME: Add more assertions than just a snapshot
  it('renders with readonly prop', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        readonly: true,
      },
    });
    expect(target.innerHTML).toMatchSnapshot();
  });

  // FIXME: Add more assertions than just a snapshot
  it.skip('renders with required prop', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        required: true,
      },
    });
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('shows on click', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy = jest.spyOn(component, '__open');
    const select = target.querySelector('.select');
    expect(component.get().__isOpen).toEqual(false);
    select.click();
    expect(spy).toHaveBeenCalled();
    expect(component.get().__isOpen).toEqual(true);
    spy.mockReset();
    spy.mockRestore();
  });

  it('does not show on click when disabled', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        disabled: true,
      },
    });
    const spy = jest.spyOn(component, '__open');
    const select = target.querySelector('.select');
    expect(component.get().__isOpen).toEqual(false);
    select.click();
    expect(spy).not.toHaveBeenCalled(); // browsers shouldn't send MouseEvents for disabled inputs
    expect(component.get().__isOpen).toEqual(false);
    spy.mockReset();
    spy.mockRestore();
  });

  it('shows on enter key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, '__onKeyDown');
    const spy2 = jest.spyOn(component, '__open');
    expect(component.get().__isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.get().__isOpen).toEqual(true);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('shows on spacebar key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, '__onKeyDown');
    const spy2 = jest.spyOn(component, '__open');
    expect(component.get().__isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'Spacebar' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.get().__isOpen).toEqual(true);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('shows on down key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, '__onKeyDown');
    const spy2 = jest.spyOn(component, '__open');
    expect(component.get().__isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.get().__isOpen).toEqual(true);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('shows on up key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, '__onKeyDown');
    const spy2 = jest.spyOn(component, '__open');
    expect(component.get().__isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.get().__isOpen).toEqual(true);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('shows automatically on focus', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    document.body.appendChild(target);
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy = jest.spyOn(component, '__open');
    expect(component.get().__isOpen).toEqual(false);
    const select = target.querySelector('.select');
    select.focus();
    expect(spy).toHaveBeenCalled();
    expect(component.get().__isOpen).toEqual(true);
    expect(document.activeElement).toBe(select);
    spy.mockReset();
    spy.mockRestore();
  });

  it('hides on click outside the component', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    document.body.appendChild(target);
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy = jest.spyOn(component, '__close');
    const select = target.querySelector('.select');
    select.focus();
    expect(component.get().__isOpen).toEqual(true);
    expect(document.activeElement).toBe(select);
    select.blur();
    expect(spy).toHaveBeenCalled();
    expect(component.get().__isOpen).toEqual(false);
    expect(document.activeElement).toBe(document.body);
    spy.mockReset();
    spy.mockRestore();
  });

  it('hides on ESC key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        __isOpen: true,
      },
    });
    const spy1 = jest.spyOn(component, '__onKeyDown');
    const spy2 = jest.spyOn(component, '__close');
    expect(component.get().__isOpen).toEqual(true);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.get().__isOpen).toEqual(false);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('does nothing on invalid key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, '__onKeyDown');
    const spy2 = jest.spyOn(component, '__open');
    expect(component.get().__isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'xxx' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    expect(component.get().__isOpen).toEqual(false);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it.skip('selects an item on click', () => { });

  it.skip('selects item on enter key press', () => {});

  it('selects next item on down key press', () => {
    expect.assertions(8);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        __isOpen: true,
        __selected: 0,
      },
    });
    const spy1 = jest.spyOn(component, '__onKeyDown');
    const spy2 = jest.spyOn(component, '__down');
    expect(component.get().__isOpen).toEqual(true);
    expect(component.get().__selected).toEqual(0);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get().__selected).toEqual(1);
    select.dispatchEvent(event);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(component.get().__selected).toEqual(2);
    expect(component.get().__isOpen).toEqual(true); // still open
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('selects previous item on up key press', () => {
    expect.assertions(8);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        __isOpen: true,
        __selected: 2,
      },
    });
    const spy1 = jest.spyOn(component, '__onKeyDown');
    const spy2 = jest.spyOn(component, '__up');
    expect(component.get().__isOpen).toEqual(true);
    expect(component.get().__selected).toEqual(2);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get().__selected).toEqual(1);
    select.dispatchEvent(event);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(component.get().__selected).toEqual(0);
    expect(component.get().__isOpen).toEqual(true); // still open
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('skips over disabled options on down key press', () => {
    expect.assertions(6);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        options: optionsDisabled,
        __isOpen: true,
        __selected: 1,
      },
    });
    const spy = jest.spyOn(component, '__down');
    expect(component.get().__selected).toEqual(1);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(3);
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(7);
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(7);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(component.get().__isOpen).toEqual(true); // still open
    spy.mockReset();
    spy.mockRestore();
  });

  it('skips over disabled options on up key press', () => {
    expect.assertions(6);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        options: optionsDisabled,
        __isOpen: true,
        __selected: 7,
      },
    });
    const spy = jest.spyOn(component, '__up');
    expect(component.get().__selected).toEqual(7);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(3);
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(1);
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(1);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(component.get().__isOpen).toEqual(true); // still open
    spy.mockReset();
    spy.mockRestore();
  });

  it('doesn\'t go past end of options on down key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        __isOpen: true,
        __selected: 3,
      },
    });
    const spy = jest.spyOn(component, '__down');
    expect(component.get().__selected).toEqual(3);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(4);
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(4);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.get().__isOpen).toEqual(true); // still open
    spy.mockReset();
    spy.mockRestore();
  });

  it('doesn\'t go past end of options on up key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        __isOpen: true,
        __selected: 1,
      },
    });
    const spy = jest.spyOn(component, '__up');
    expect(component.get().__selected).toEqual(1);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(0);
    select.dispatchEvent(event);
    expect(component.get().__selected).toEqual(0);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.get().__isOpen).toEqual(true); // still open
    spy.mockReset();
    spy.mockRestore();
  });

  it.skip('typing in input filters the shown options', () => {});

  it.skip('input is cleared on ESC key press', () => {});

  it('can dynamically add options', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    expect(component.get().options).toHaveLength(5);
    component.set({ options: [...options, { id: 'new', text: 'New' }]});
    expect(component.get().options).toHaveLength(6);
    const listbox = target.querySelector('.select-listbox');
    expect(listbox.innerHTML).toMatch('<div class="option  " value="new" role="option">New</div>');
  });
});
