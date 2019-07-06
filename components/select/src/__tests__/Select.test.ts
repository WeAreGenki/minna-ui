// TODO: Add integration/UI tests
//  ↳ Responsive CSS
//  ↳ Disabled state works as expected

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { tick } from 'svelte';
import Select from '../Select.svelte';

const items = [
  { id: 'au', text: 'Australia' },
  { id: 'cn', text: 'China' },
  { id: 'jp', text: 'Japan' },
  { id: 'kr', text: 'Korea' },
  { id: 'other', text: 'Other / Unknown' },
];
/* eslint-disable sort-keys */
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
/* eslint-enable sort-keys */
const selectOpts = {
  id: 'test-select',
  items,
  value: '',
};

describe('Select component', () => {
  it('renders correctly with required props set', () => {
    expect.assertions(10);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    const select = target.querySelector('.select')!;
    expect(Array.isArray(component.items)).toBe(true);
    expect(component.items).not.toHaveLength(0);
    expect(component.input).toBeDefined();
    expect(select.getAttribute('tabindex')).toBe('0');
    expect(select.getAttribute('disabled')).toBeNull();
    expect(select.getAttribute('required')).toBeNull();
    expect(select.getAttribute('placeholder')).not.toBe(false);
    expect(document.querySelector('select-active')).toBeNull();
    expect(document.querySelector('select-disabled')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with value set', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: 'jp',
      },
      target,
    });
    expect(component.inputText).toBe('Japan');
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with filterable prop set to false', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        filterable: false,
        isOpen: true,
      },
      target,
    });
    expect(component.filterable).toBe(false);
    const select = target.querySelector('.select')!;
    expect(select.getAttribute('placeholder')).toBe('Choose...'); // not "Filer..."
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with filterHelp prop', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        filterHelp: 'Filter me',
        isOpen: true,
      },
      target,
    });
    expect(component.filterHelp).toBe('Filter me');
    const select = target.querySelector('.select')!;
    expect(select.getAttribute('placeholder')).toBe('Filter me');
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with placeholder prop', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        placeholder: 'Hold your places',
      },
      target,
    });
    expect(component.placeholder).toBe('Hold your places');
    const select = target.querySelector('.select')!;
    expect(select.getAttribute('placeholder')).toBe('Hold your places');
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with disabled prop', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        disabled: true,
      },
      target,
    });
    expect(component.disabled).toBe(true);
    const select = target.querySelector('.select')!;
    expect(select.getAttribute('disabled')).not.toBeNull();
    expect(select.getAttribute('tabindex')).toBe('-1');
    expect(target.querySelector('.select-disabled')).not.toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders with readonly prop', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        readonly: true,
      },
      target,
    });
    expect(component.readonly).toBe(true);
    const select = target.querySelector('.select')!;
    expect(select.getAttribute('readonly')).not.toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  // TODO: Write tests once we have custom validation in the component
  it.todo('renders with required prop');

  it('updates selected index on value change', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: 'cn',
      },
      target,
    });
    expect(component.selected).toBe(1);
    component.$set({ value: 'kr' });
    component.open();
    expect(component.selected).toBe(3);
  });

  it('shows on click', async () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    const select = target.querySelector<HTMLInputElement>('.select')!;
    expect(component.isOpen).toBe(false);
    select.click();
    await tick();
    expect(component.isOpen).toBe(true);
  });

  it('does not show on click when disabled', async () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        disabled: true,
      },
      target,
    });
    const select = target.querySelector<HTMLInputElement>('.select')!;
    expect(component.isOpen).toBe(false);
    select.click();
    await tick();
    expect(component.isOpen).toBe(false);
  });

  it('shows on enter key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.isOpen).toBe(false);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    select.dispatchEvent(event);
    expect(component.isOpen).toBe(true);
  });

  it('shows on spacebar key press', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.isOpen).toBe(false);
    const select = target.querySelector('.select')!;
    const event1 = new KeyboardEvent('keydown', { key: ' ' }); // spacebar
    select.dispatchEvent(event1);
    expect(component.isOpen).toBe(true);
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore - keyCode does actually exist!
    const event2 = new KeyboardEvent('keydown', { keyCode: 32 });
    select.dispatchEvent(event2);
    expect(component.isOpen).toBe(true);
  });

  it('shows on down key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.isOpen).toBe(false);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.isOpen).toBe(true);
  });

  it('shows on up key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.isOpen).toBe(false);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.isOpen).toBe(true);
  });

  it('shows automatically on focus', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    document.body.appendChild(target);
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.isOpen).toBe(false);
    const select = target.querySelector<HTMLInputElement>('.select')!;
    select.focus();
    expect(component.isOpen).toBe(true);
    expect(document.activeElement).toStrictEqual(select);
  });

  it('hides on click outside the component', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    document.body.appendChild(target);
    const component = new Select({
      props: selectOpts,
      target,
    });
    const select = target.querySelector<HTMLInputElement>('.select')!;
    select.focus();
    expect(component.isOpen).toBe(true);
    expect(document.activeElement).toStrictEqual(select);
    select.blur();
    expect(component.isOpen).toBe(false);
    expect(document.activeElement).toStrictEqual(document.body);
  });

  it('hides on ESC key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        isOpen: true,
      },
      target,
    });
    expect(component.isOpen).toBe(true);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select.dispatchEvent(event);
    expect(component.isOpen).toBe(false);
  });

  it('does nothing on invalid key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.isOpen).toBe(false);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'xxx' });
    select.dispatchEvent(event);
    expect(component.isOpen).toBe(false);
  });

  it('selects next item on down key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        isOpen: true,
        selected: 0,
      },
      target,
    });
    expect(component.isOpen).toBe(true);
    expect(component.selected).toBe(0);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.selected).toBe(1);
    select.dispatchEvent(event);
    expect(component.selected).toBe(2);
    expect(component.isOpen).toBe(true); // still open
  });

  it('selects previous item on up key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: items[2].id,
      },
      target,
    });
    component.open(); // to set correct selected index
    expect(component.isOpen).toBe(true);
    expect(component.selected).toBe(2);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.selected).toBe(1);
    select.dispatchEvent(event);
    expect(component.selected).toBe(0);
    expect(component.isOpen).toBe(true); // still open
  });

  it('skips over disabled items on down key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        items: itemsDisabled,
        value: itemsDisabled[1].id,
      },
      target,
    });
    component.open(); // to set correct selected index
    expect(component.selected).toBe(1);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.selected).toBe(3);
    select.dispatchEvent(event);
    expect(component.selected).toBe(7);
    select.dispatchEvent(event);
    expect(component.selected).toBe(7);
    expect(component.isOpen).toBe(true); // still open
  });

  it('skips over disabled items on up key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        items: itemsDisabled,
        value: itemsDisabled[7].id,
      },
      target,
    });
    component.open(); // to set correct selected index
    expect(component.selected).toBe(7);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.selected).toBe(3);
    select.dispatchEvent(event);
    expect(component.selected).toBe(1);
    select.dispatchEvent(event);
    expect(component.selected).toBe(1);
    expect(component.isOpen).toBe(true); // still open
  });

  it("doesn't go past end of items on down key press", () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: items[3].id,
      },
      target,
    });
    component.open(); // to set correct selected index
    expect(component.selected).toBe(3);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.selected).toBe(4);
    select.dispatchEvent(event);
    expect(component.selected).toBe(4);
    expect(component.isOpen).toBe(true); // still open
  });

  it("doesn't go past end of items on up key press", () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: items[1].id,
      },
      target,
    });
    component.open(); // to set correct selected index
    expect(component.selected).toBe(1);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.selected).toBe(0);
    select.dispatchEvent(event);
    expect(component.selected).toBe(0);
    expect(component.isOpen).toBe(true); // still open
  });

  it('selects an item on click', () => {
    expect.assertions(7);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        isOpen: true,
      },
      target,
    });
    expect(component.isOpen).toBe(true);
    expect(component.selected).toBe(0);
    const select = target.querySelector('.select')!;
    const option = target.querySelector('.option[value="jp"]');
    const listbox = target.querySelector('.select-listbox')!;
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { enumerable: true, value: option });
    const spy1 = jest.spyOn(select, 'dispatchEvent');
    const spy2 = jest.spyOn(event, 'preventDefault'); // only present in mouse event part of select()
    listbox.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(event);
    expect(component.isOpen).toBe(false);
    component.open(); // to set correct selected index
    expect(component.selected).toBe(2);
    expect(component.isOpen).toBe(true);
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it("doesn't select an item on click when option disabled", () => {
    expect.assertions(6);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        isOpen: true,
        items: [
          { id: 'one', text: 'Opt 1' },
          // eslint-disable-next-line sort-keys
          { id: 'two', text: 'Opt 2', disabled: true },
          { id: 'three', text: 'Opt 3' },
        ],
      },
      target,
    });
    expect(component.isOpen).toBe(true);
    expect(component.selected).toBe(0);
    const select = target.querySelector('.select')!;
    const option = target.querySelector('.option[value="two"]');
    const listbox = target.querySelector('.select-listbox')!;
    const spy1 = jest.spyOn(select, 'dispatchEvent');
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { enumerable: true, value: option });
    const spy2 = jest.spyOn(event, 'preventDefault');
    listbox.dispatchEvent(event);
    expect(spy1).not.toHaveBeenCalled(); // doesn't emit an event
    expect(spy2).toHaveBeenCalledWith(event);
    expect(component.selected).toBe(0);
    expect(component.isOpen).toBe(true); // still open
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('selects item on enter key press', () => {
    expect.assertions(7);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        isOpen: true,
      },
      target,
    });
    expect(component.isOpen).toBe(true);
    expect(component.selected).toBe(0);
    const select = target.querySelector('.select')!;
    const event1 = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const spy1 = jest.spyOn(event1, 'preventDefault');
    select.dispatchEvent(event1);
    expect(component.selected).toBe(1);
    const event2 = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy2 = jest.spyOn(event2, 'preventDefault');
    select.dispatchEvent(event2);
    expect(spy1).toHaveBeenCalledWith(event1);
    expect(spy2).toHaveBeenCalledWith(event2);
    expect(component.selected).toBe(1);
    expect(component.isOpen).toBe(false);
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('typing in input filters the shown items', async () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        isOpen: true,
      },
      target,
    });
    expect(component.filteredItems).toHaveLength(5);
    const select = target.querySelector<HTMLInputElement>('.select')!;
    select.value = 'o'; // simulate input + event
    const event = new Event('input');
    select.dispatchEvent(event);
    await tick();
    expect(component.filteredItems).toHaveLength(2);
    const listbox = target.querySelector('.select-listbox')!;
    expect(listbox.outerHTML).toMatchSnapshot();
  });

  it('shows feedback message when filter has no match', async () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        isOpen: true,
      },
      target,
    });
    expect(component.filteredItems).toHaveLength(5);
    const select = target.querySelector<HTMLInputElement>('.select')!;
    select.value = 'xxxxx'; // simulate input + event
    const event = new Event('input');
    select.dispatchEvent(event);
    await tick();
    expect(component.filteredItems).toHaveLength(0);
    const listbox = target.querySelector('.select-listbox')!;
    expect(listbox.outerHTML).toMatchSnapshot();
  });

  it('input is reset on ESC key press', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: 'au',
      },
      target,
    });
    expect(component.inputText).toBe('Australia');
    component.open();
    expect(component.inputText).toBe('');
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select.dispatchEvent(event);
    expect(component.isOpen).toBe(false);
    expect(component.inputText).toBe('Australia');
  });

  it('can dynamically add items', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.items).toHaveLength(5);
    component.$set({ items: [...items, { id: 'new', text: 'New' }] });
    await tick();
    expect(component.items).toHaveLength(6);
    const newItem = target.querySelector('[value="new"]')!;
    expect(newItem).toBe(true);
    expect(newItem.outerHTML).toMatchSnapshot();
  });
});
