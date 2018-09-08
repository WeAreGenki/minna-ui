'use strict';

const MinnaSelect = require('../src/MinnaSelect.html');

const items = [
  { id: 'au', text: 'Australia' },
  { id: 'cn', text: 'China' },
  { id: 'jp', text: 'Japan' },
  { id: 'kr', text: 'Korea' },
  { id: 'other', text: 'Other / Unknown' },
];
const itemsDisabled = [
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
  items,
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
    expect(Array.isArray(component.get().items)).toEqual(true);
    expect(component.get().items).not.toHaveLength(0);
    expect(component.refs._target).toBeDefined();
    expect(select.getAttribute('tabindex')).toEqual('0');
    expect(select.getAttribute('disabled')).toBeNull();
    expect(select.getAttribute('required')).toBeNull();
    expect(select.getAttribute('placeholder')).not.toBeFalsy();
    expect(document.querySelector('select-active')).toBeNull();
    expect(document.querySelector('select-disabled')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with value set', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        value: 'jp',
      },
    });
    expect(component.get()._inputText).toEqual('Japan');
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with filterable prop set to false', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        filterable: false,
        _isOpen: true,
      },
    });
    expect(component.get().filterable).toEqual(false);
    const select = target.querySelector('.select');
    expect(select.getAttribute('placeholder')).toEqual('Choose...'); // not "Filer..."
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with filterHelp prop', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        filterHelp: 'Filter me',
        _isOpen: true,
      },
    });
    expect(component.get().filterHelp).toEqual('Filter me');
    const select = target.querySelector('.select');
    expect(select.getAttribute('placeholder')).toEqual('Filter me');
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with placeholder prop', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        placeholder: 'Hold your places',
      },
    });
    expect(component.get().placeholder).toEqual('Hold your places');
    const select = target.querySelector('.select');
    expect(select.getAttribute('placeholder')).toEqual('Hold your places');
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with disabled prop', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        disabled: true,
      },
    });
    expect(component.get().disabled).toEqual(true);
    const select = target.querySelector('.select');
    expect(select.getAttribute('disabled')).not.toBeNull();
    expect(select.getAttribute('tabindex')).toEqual('-1');
    expect(target.querySelector('.select-disabled')).not.toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with readonly prop', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        readonly: true,
      },
    });
    expect(component.get().readonly).toEqual(true);
    const select = target.querySelector('.select');
    expect(select.getAttribute('readonly')).not.toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  // TODO: Write this test once we have custom validation for this component
  it.skip('renders with required prop', () => {});

  it('correct selected index is updated on value change', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        value: 'cn',
      },
    });
    expect(component.get()._selected).toEqual(1);
    component.set({ value: 'kr' });
    component._setIndex();
    expect(component.get()._selected).toEqual(3);
  });

  it('shows on click', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy = jest.spyOn(component, '_open');
    const select = target.querySelector('.select');
    expect(component.get()._isOpen).toEqual(false);
    select.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.get()._isOpen).toEqual(true);
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
    const spy = jest.spyOn(component, '_open');
    const select = target.querySelector('.select');
    expect(component.get()._isOpen).toEqual(false);
    select.click();
    expect(spy).not.toHaveBeenCalled(); // browsers shouldn't send MouseEvents for disabled inputs
    expect(component.get()._isOpen).toEqual(false);
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
    const spy1 = jest.spyOn(component, '_onKeyDown');
    const spy2 = jest.spyOn(component, '_open');
    expect(component.get()._isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get()._isOpen).toEqual(true);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('shows on spacebar key press', () => {
    expect.assertions(7);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, '_onKeyDown');
    const spy2 = jest.spyOn(component, '_open');
    expect(component.get()._isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event1 = new KeyboardEvent('keydown', { key: ' ' }); // Spacebar
    select.dispatchEvent(event1);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get()._isOpen).toEqual(true);
    const event2 = new KeyboardEvent('keydown', { keyCode: 32 });
    select.dispatchEvent(event2);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(1); // shouldn't open again
    expect(component.get()._isOpen).toEqual(true);
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
    const spy1 = jest.spyOn(component, '_onKeyDown');
    const spy2 = jest.spyOn(component, '_open');
    expect(component.get()._isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get()._isOpen).toEqual(true);
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
    const spy1 = jest.spyOn(component, '_onKeyDown');
    const spy2 = jest.spyOn(component, '_open');
    expect(component.get()._isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get()._isOpen).toEqual(true);
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
    const spy = jest.spyOn(component, '_open');
    expect(component.get()._isOpen).toEqual(false);
    const select = target.querySelector('.select');
    select.focus();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.get()._isOpen).toEqual(true);
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
    const spy = jest.spyOn(component, '_close');
    const select = target.querySelector('.select');
    select.focus();
    expect(component.get()._isOpen).toEqual(true);
    expect(document.activeElement).toBe(select);
    select.blur();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.get()._isOpen).toEqual(false);
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
        _isOpen: true,
      },
    });
    const spy1 = jest.spyOn(component, '_onKeyDown');
    const spy2 = jest.spyOn(component, '_close');
    expect(component.get()._isOpen).toEqual(true);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get()._isOpen).toEqual(false);
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
    const spy1 = jest.spyOn(component, '_onKeyDown');
    const spy2 = jest.spyOn(component, '_open');
    expect(component.get()._isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'xxx' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).not.toHaveBeenCalled();
    expect(component.get()._isOpen).toEqual(false);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('selects next item on down key press', () => {
    expect.assertions(8);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        _isOpen: true,
        _selected: 0,
      },
    });
    const spy1 = jest.spyOn(component, '_onKeyDown');
    const spy2 = jest.spyOn(component, '_down');
    expect(component.get()._isOpen).toEqual(true);
    expect(component.get()._selected).toEqual(0);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get()._selected).toEqual(1);
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(component.get()._selected).toEqual(2);
    expect(component.get()._isOpen).toEqual(true); // still open
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
        _isOpen: true,
        _selected: 2,
      },
    });
    const spy1 = jest.spyOn(component, '_onKeyDown');
    const spy2 = jest.spyOn(component, '_up');
    expect(component.get()._isOpen).toEqual(true);
    expect(component.get()._selected).toEqual(2);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get()._selected).toEqual(1);
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(component.get()._selected).toEqual(0);
    expect(component.get()._isOpen).toEqual(true); // still open
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
  });

  it('skips over disabled items on down key press', () => {
    expect.assertions(6);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        items: itemsDisabled,
        _isOpen: true,
        _selected: 1,
      },
    });
    const spy = jest.spyOn(component, '_down');
    expect(component.get()._selected).toEqual(1);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(3);
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(7);
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(7);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(component.get()._isOpen).toEqual(true); // still open
    spy.mockReset();
    spy.mockRestore();
  });

  it('skips over disabled items on up key press', () => {
    expect.assertions(6);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        items: itemsDisabled,
        _isOpen: true,
        _selected: 7,
      },
    });
    const spy = jest.spyOn(component, '_up');
    expect(component.get()._selected).toEqual(7);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(3);
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(1);
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(1);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(component.get()._isOpen).toEqual(true); // still open
    spy.mockReset();
    spy.mockRestore();
  });

  it('doesn\'t go past end of items on down key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        _isOpen: true,
        _selected: 3,
      },
    });
    const spy = jest.spyOn(component, '_down');
    expect(component.get()._selected).toEqual(3);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(4);
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(4);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.get()._isOpen).toEqual(true); // still open
    spy.mockReset();
    spy.mockRestore();
  });

  it('doesn\'t go past end of items on up key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        _isOpen: true,
        _selected: 1,
      },
    });
    const spy = jest.spyOn(component, '_up');
    expect(component.get()._selected).toEqual(1);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(0);
    select.dispatchEvent(event);
    expect(component.get()._selected).toEqual(0);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.get()._isOpen).toEqual(true); // still open
    spy.mockReset();
    spy.mockRestore();
  });

  it('selects an item on click', () => {
    expect.assertions(7);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        _isOpen: true,
      },
    });
    const spy1 = jest.spyOn(component, '_select');
    const spy2 = jest.spyOn(component, '_emitInput');
    expect(component.get()._isOpen).toEqual(true);
    expect(component.get()._selected).toEqual(0);
    const option = target.querySelector('.option[value="jp"]');
    const listbox = target.querySelector('.select-listbox');
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { value: option, enumerable: true });
    const spy3 = jest.spyOn(event, 'preventDefault'); // only present in mouse event part of _select()
    listbox.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(component.get()._selected).toEqual(2);
    expect(component.get()._isOpen).toEqual(false);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
    spy3.mockReset();
    spy3.mockRestore();
  });

  it('doesn\'t select an item on click when option disabled', () => {
    expect.assertions(7);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        items: [
          { id: 'one', text: 'Opt 1' },
          { id: 'two', text: 'Opt 2', disabled: true },
          { id: 'three', text: 'Opt 3' },
        ],
        _isOpen: true,
      },
    });
    const spy1 = jest.spyOn(component, '_select');
    const spy2 = jest.spyOn(component, '_emitInput');
    expect(component.get()._isOpen).toEqual(true);
    expect(component.get()._selected).toEqual(0);
    const option = target.querySelector('.option[value="two"]');
    const listbox = target.querySelector('.select-listbox');
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { value: option, enumerable: true });
    const spy3 = jest.spyOn(event, 'preventDefault');
    listbox.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(component.get()._selected).toEqual(0);
    expect(component.get()._isOpen).toEqual(true); // still open
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
    spy3.mockReset();
    spy3.mockRestore();
  });

  it('selects item on enter key press', () => {
    expect.assertions(8);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        _isOpen: true,
      },
    });
    const spy1 = jest.spyOn(component, '_select');
    const spy2 = jest.spyOn(component, '_emitInput');
    expect(component.get()._isOpen).toEqual(true);
    expect(component.get()._selected).toEqual(0);
    const select = target.querySelector('.select');
    const event1 = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event1);
    expect(component.get()._selected).toEqual(1);
    const event2 = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy3 = jest.spyOn(event2, 'preventDefault');
    select.dispatchEvent(event2);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(component.get()._selected).toEqual(1);
    expect(component.get()._isOpen).toEqual(false);
    spy1.mockReset();
    spy1.mockRestore();
    spy2.mockReset();
    spy2.mockRestore();
    spy3.mockReset();
    spy3.mockRestore();
  });

  it('typing in input filters the shown items', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        _isOpen: true,
      },
    });
    expect(component.get()._filteredItems).toHaveLength(5);
    component.set({ _inputText: 'o' });
    expect(component.get()._filteredItems).toHaveLength(2);
    expect(component.get()._filteredItems).toMatchSnapshot();
  });

  it('input is reset on ESC key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        ...selectOpts,
        value: 'au',
        _isOpen: true,
        _inputText: 'filter text',
      },
    });
    const spy = jest.spyOn(component, '_setInput');
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select.dispatchEvent(event);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.get()._inputText).toEqual('Australia');
    spy.mockReset();
    spy.mockRestore();
  });

  it('can dynamically add items', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: selectOpts,
    });
    expect(component.get().items).toHaveLength(5);
    component.set({ items: [...items, { id: 'new', text: 'New' }]});
    expect(component.get().items).toHaveLength(6);
    const listbox = target.querySelector('.select-listbox');
    expect(listbox.innerHTML).toMatch('value="new" role="option">New</div>');
  });
});
