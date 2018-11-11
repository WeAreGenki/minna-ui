'use strict';

const Select = require('../src/Select.html');

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

describe('Select component', () => {
  it('throws error with no props', () => {
    expect.assertions(1);
    function wrapper() {
      const target = document.createElement('div');
      new Select({ target });
    }
    expect(wrapper).toThrow();
  });

  it('renders correctly with required props set', () => {
    expect.assertions(10);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: selectOpts,
    });
    const select = target.querySelector('.select');
    expect(Array.isArray(component.get().items)).toEqual(true);
    expect(component.get().items).not.toHaveLength(0);
    expect(component.refs.input).toBeDefined();
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
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        value: 'jp',
      },
    });
    expect(component.get().inputText).toEqual('Japan');
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with filterable prop set to false', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        filterable: false,
        isOpen: true,
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
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        filterHelp: 'Filter me',
        isOpen: true,
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
    const component = new Select({
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

  // FIXME: Add disabled back once SSR works correctly
  it.skip('renders with disabled prop', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Select({
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
    const component = new Select({
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
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        value: 'cn',
      },
    });
    expect(component.get().selected).toEqual(1);
    component.set({ value: 'kr' });
    component.setIndex();
    expect(component.get().selected).toEqual(3);
  });

  it('shows on click', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: selectOpts,
    });
    const spy = jest.spyOn(component, 'open');
    const select = target.querySelector('.select');
    expect(component.get().isOpen).toEqual(false);
    select.click();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.get().isOpen).toEqual(true);
    spy.mockRestore();
  });

  // FIXME: Add disabled back once SSR works correctly
  it.skip('does not show on click when disabled', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        disabled: true,
      },
    });
    const spy = jest.spyOn(component, 'open');
    const select = target.querySelector('.select');
    expect(component.get().isOpen).toEqual(false);
    select.click();
    expect(spy).not.toHaveBeenCalled(); // browsers shouldn't send MouseEvents for disabled inputs
    expect(component.get().isOpen).toEqual(false);
    spy.mockRestore();
  });

  it('shows on enter key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, 'handleKeyDown');
    const spy2 = jest.spyOn(component, 'open');
    expect(component.get().isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get().isOpen).toEqual(true);
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('shows on spacebar key press', () => {
    expect.assertions(7);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, 'handleKeyDown');
    const spy2 = jest.spyOn(component, 'open');
    expect(component.get().isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event1 = new KeyboardEvent('keydown', { key: ' ' }); // Spacebar
    select.dispatchEvent(event1);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get().isOpen).toEqual(true);
    const event2 = new KeyboardEvent('keydown', { keyCode: 32 });
    select.dispatchEvent(event2);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(1); // shouldn't open again
    expect(component.get().isOpen).toEqual(true);
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('shows on down key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, 'handleKeyDown');
    const spy2 = jest.spyOn(component, 'open');
    expect(component.get().isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get().isOpen).toEqual(true);
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('shows on up key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, 'handleKeyDown');
    const spy2 = jest.spyOn(component, 'open');
    expect(component.get().isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get().isOpen).toEqual(true);
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('shows automatically on focus', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    document.body.appendChild(target);
    const component = new Select({
      target,
      data: selectOpts,
    });
    const spy = jest.spyOn(component, 'open');
    expect(component.get().isOpen).toEqual(false);
    const select = target.querySelector('.select');
    select.focus();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.get().isOpen).toEqual(true);
    expect(document.activeElement).toBe(select);
    spy.mockRestore();
  });

  it('hides on click outside the component', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    document.body.appendChild(target);
    const component = new Select({
      target,
      data: selectOpts,
    });
    const spy = jest.spyOn(component, 'close');
    const select = target.querySelector('.select');
    select.focus();
    expect(component.get().isOpen).toEqual(true);
    expect(document.activeElement).toBe(select);
    select.blur();
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.get().isOpen).toEqual(false);
    expect(document.activeElement).toBe(document.body);
    spy.mockRestore();
  });

  it('hides on ESC key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        isOpen: true,
      },
    });
    const spy1 = jest.spyOn(component, 'handleKeyDown');
    const spy2 = jest.spyOn(component, 'close');
    expect(component.get().isOpen).toEqual(true);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get().isOpen).toEqual(false);
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('does nothing on invalid key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: selectOpts,
    });
    const spy1 = jest.spyOn(component, 'handleKeyDown');
    const spy2 = jest.spyOn(component, 'open');
    expect(component.get().isOpen).toEqual(false);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'xxx' });
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).not.toHaveBeenCalled();
    expect(component.get().isOpen).toEqual(false);
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('selects next item on down key press', () => {
    expect.assertions(8);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        isOpen: true,
        selected: 0,
      },
    });
    const spy1 = jest.spyOn(component, 'handleKeyDown');
    const spy2 = jest.spyOn(component, 'down');
    expect(component.get().isOpen).toEqual(true);
    expect(component.get().selected).toEqual(0);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get().selected).toEqual(1);
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(component.get().selected).toEqual(2);
    expect(component.get().isOpen).toEqual(true); // still open
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('selects previous item on up key press', () => {
    expect.assertions(8);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        isOpen: true,
        selected: 2,
      },
    });
    const spy1 = jest.spyOn(component, 'handleKeyDown');
    const spy2 = jest.spyOn(component, 'up');
    expect(component.get().isOpen).toEqual(true);
    expect(component.get().selected).toEqual(2);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.get().selected).toEqual(1);
    select.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(2);
    expect(spy2).toHaveBeenCalledTimes(2);
    expect(component.get().selected).toEqual(0);
    expect(component.get().isOpen).toEqual(true); // still open
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('skips over disabled items on down key press', () => {
    expect.assertions(6);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        items: itemsDisabled,
        isOpen: true,
        selected: 1,
      },
    });
    const spy = jest.spyOn(component, 'down');
    expect(component.get().selected).toEqual(1);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(3);
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(7);
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(7);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(component.get().isOpen).toEqual(true); // still open
    spy.mockRestore();
  });

  it('skips over disabled items on up key press', () => {
    expect.assertions(6);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        items: itemsDisabled,
        isOpen: true,
        selected: 7,
      },
    });
    const spy = jest.spyOn(component, 'up');
    expect(component.get().selected).toEqual(7);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(3);
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(1);
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(1);
    expect(spy).toHaveBeenCalledTimes(3);
    expect(component.get().isOpen).toEqual(true); // still open
    spy.mockRestore();
  });

  it('doesn\'t go past end of items on down key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        isOpen: true,
        selected: 3,
      },
    });
    const spy = jest.spyOn(component, 'down');
    expect(component.get().selected).toEqual(3);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(4);
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(4);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.get().isOpen).toEqual(true); // still open
    spy.mockRestore();
  });

  it('doesn\'t go past end of items on up key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        isOpen: true,
        selected: 1,
      },
    });
    const spy = jest.spyOn(component, 'up');
    expect(component.get().selected).toEqual(1);
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(0);
    select.dispatchEvent(event);
    expect(component.get().selected).toEqual(0);
    expect(spy).toHaveBeenCalledTimes(2);
    expect(component.get().isOpen).toEqual(true); // still open
    spy.mockRestore();
  });

  it('selects an item on click', () => {
    expect.assertions(7);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        isOpen: true,
      },
    });
    const spy1 = jest.spyOn(component, 'select');
    const spy2 = jest.spyOn(component, 'emitInput');
    expect(component.get().isOpen).toEqual(true);
    expect(component.get().selected).toEqual(0);
    const option = target.querySelector('.option[value="jp"]');
    const listbox = target.querySelector('.select-listbox');
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { value: option, enumerable: true });
    const spy3 = jest.spyOn(event, 'preventDefault'); // only present in mouse event part of select()
    listbox.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
    expect(component.get().selected).toEqual(2);
    expect(component.get().isOpen).toEqual(false);
    spy1.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
  });

  it('doesn\'t select an item on click when option disabled', () => {
    expect.assertions(7);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        items: [
          { id: 'one', text: 'Opt 1' },
          { id: 'two', text: 'Opt 2', disabled: true },
          { id: 'three', text: 'Opt 3' },
        ],
        isOpen: true,
      },
    });
    const spy1 = jest.spyOn(component, 'select');
    const spy2 = jest.spyOn(component, 'emitInput');
    expect(component.get().isOpen).toEqual(true);
    expect(component.get().selected).toEqual(0);
    const option = target.querySelector('.option[value="two"]');
    const listbox = target.querySelector('.select-listbox');
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { value: option, enumerable: true });
    const spy3 = jest.spyOn(event, 'preventDefault');
    listbox.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).not.toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(component.get().selected).toEqual(0);
    expect(component.get().isOpen).toEqual(true); // still open
    spy1.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
  });

  it('selects item on enter key press', () => {
    expect.assertions(8);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        isOpen: true,
      },
    });
    const spy1 = jest.spyOn(component, 'select');
    const spy2 = jest.spyOn(component, 'emitInput');
    expect(component.get().isOpen).toEqual(true);
    expect(component.get().selected).toEqual(0);
    const select = target.querySelector('.select');
    const event1 = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event1);
    expect(component.get().selected).toEqual(1);
    const event2 = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy3 = jest.spyOn(event2, 'preventDefault');
    select.dispatchEvent(event2);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(component.get().selected).toEqual(1);
    expect(component.get().isOpen).toEqual(false);
    spy1.mockRestore();
    spy2.mockRestore();
    spy3.mockRestore();
  });

  it('typing in input filters the shown items', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        isOpen: true,
      },
    });
    expect(component.get().filteredItems).toHaveLength(5);
    component.set({ inputText: 'o' });
    expect(component.get().filteredItems).toHaveLength(2);
    expect(target.querySelector('.select-listbox').outerHTML).toMatchSnapshot();
  });

  it('shows feedback message when filter has no match', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        isOpen: true,
      },
    });
    expect(component.get().filteredItems).toHaveLength(5);
    component.set({ inputText: 'no match' });
    expect(component.get().filteredItems).toHaveLength(0);
    expect(target.querySelector('.select-listbox').outerHTML).toMatchSnapshot();
  });

  it('input is reset on ESC key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: {
        ...selectOpts,
        value: 'au',
        isOpen: true,
        inputText: 'filter text',
      },
    });
    const spy = jest.spyOn(component, 'setInput');
    const select = target.querySelector('.select');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select.dispatchEvent(event);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(component.get().inputText).toEqual('Australia');
    spy.mockRestore();
  });

  it('can dynamically add items', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      target,
      data: selectOpts,
    });
    expect(component.get().items).toHaveLength(5);
    component.set({ items: [...items, { id: 'new', text: 'New' }] });
    expect(component.get().items).toHaveLength(6);
    const newListItem = target.querySelector('[value="new"]');
    expect(newListItem).toBeTruthy();
    expect(newListItem.outerHTML).toMatchSnapshot();
  });
});
