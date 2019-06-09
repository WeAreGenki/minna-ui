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
    expect(Array.isArray(component.$$.ctx.items)).toBeTruthy();
    expect(component.$$.ctx.items).not.toHaveLength(0);
    expect(component.$$.ctx.input).toBeDefined();
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
      props: {
        ...selectOpts,
        value: 'jp',
      },
      target,
    });
    expect(component.$$.ctx.inputText).toEqual('Japan');
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
    expect(component.$$.ctx.filterable).toBeFalsy();
    const select = target.querySelector('.select')!;
    expect(select.getAttribute('placeholder')).toEqual('Choose...'); // not "Filer..."
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
    expect(component.$$.ctx.filterHelp).toEqual('Filter me');
    const select = target.querySelector('.select')!;
    expect(select.getAttribute('placeholder')).toEqual('Filter me');
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
    expect(component.$$.ctx.placeholder).toEqual('Hold your places');
    const select = target.querySelector('.select')!;
    expect(select.getAttribute('placeholder')).toEqual('Hold your places');
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
    expect(component.$$.ctx.disabled).toBeTruthy();
    const select = target.querySelector('.select')!;
    expect(select.getAttribute('disabled')).not.toBeNull();
    expect(select.getAttribute('tabindex')).toEqual('-1');
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
    expect(component.$$.ctx.readonly).toBeTruthy();
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
    expect(component.$$.ctx.selected).toEqual(1);
    component.$set({ value: 'kr' });
    component.$$.ctx.open();
    expect(component.$$.ctx.selected).toEqual(3);
  });

  it('shows on click', async () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    const select = target.querySelector<HTMLInputElement>('.select')!;
    expect(component.$$.ctx.isOpen).toBeFalsy();
    select.click();
    await tick();
    expect(component.$$.ctx.isOpen).toBeTruthy();
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
    expect(component.$$.ctx.isOpen).toBeFalsy();
    select.click();
    await tick();
    expect(component.$$.ctx.isOpen).toBeFalsy();
  });

  it('shows on enter key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.$$.ctx.isOpen).toBeFalsy();
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.isOpen).toBeTruthy();
  });

  it('shows on spacebar key press', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.$$.ctx.isOpen).toBeFalsy();
    const select = target.querySelector('.select')!;
    const event1 = new KeyboardEvent('keydown', { key: ' ' }); // spacebar
    select.dispatchEvent(event1);
    expect(component.$$.ctx.isOpen).toBeTruthy();
    // @ts-ignore - keyCode does actually exist!
    const event2 = new KeyboardEvent('keydown', { keyCode: 32 });
    select.dispatchEvent(event2);
    expect(component.$$.ctx.isOpen).toBeTruthy();
  });

  it('shows on down key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.$$.ctx.isOpen).toBeFalsy();
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.isOpen).toBeTruthy();
  });

  it('shows on up key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.$$.ctx.isOpen).toBeFalsy();
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.isOpen).toBeTruthy();
  });

  it('shows automatically on focus', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    document.body.appendChild(target);
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.$$.ctx.isOpen).toBeFalsy();
    const select = target.querySelector<HTMLInputElement>('.select')!;
    select.focus();
    expect(component.$$.ctx.isOpen).toBeTruthy();
    expect(document.activeElement).toBe(select);
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
    expect(component.$$.ctx.isOpen).toBeTruthy();
    expect(document.activeElement).toBe(select);
    select.blur();
    expect(component.$$.ctx.isOpen).toBeFalsy();
    expect(document.activeElement).toBe(document.body);
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
    expect(component.$$.ctx.isOpen).toBeTruthy();
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.isOpen).toBeFalsy();
  });

  it('does nothing on invalid key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.$$.ctx.isOpen).toBeFalsy();
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'xxx' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.isOpen).toBeFalsy();
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
    expect(component.$$.ctx.isOpen).toBeTruthy();
    expect(component.$$.ctx.selected).toEqual(0);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(1);
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(2);
    expect(component.$$.ctx.isOpen).toBeTruthy(); // still open
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
    component.$$.ctx.open(); // to set correct selected index
    expect(component.$$.ctx.isOpen).toBeTruthy();
    expect(component.$$.ctx.selected).toEqual(2);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(1);
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(0);
    expect(component.$$.ctx.isOpen).toBeTruthy(); // still open
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
    component.$$.ctx.open(); // to set correct selected index
    expect(component.$$.ctx.selected).toEqual(1);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(3);
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(7);
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(7);
    expect(component.$$.ctx.isOpen).toBeTruthy(); // still open
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
    component.$$.ctx.open(); // to set correct selected index
    expect(component.$$.ctx.selected).toEqual(7);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(3);
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(1);
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(1);
    expect(component.$$.ctx.isOpen).toBeTruthy(); // still open
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
    component.$$.ctx.open(); // to set correct selected index
    expect(component.$$.ctx.selected).toEqual(3);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(4);
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(4);
    expect(component.$$.ctx.isOpen).toBeTruthy(); // still open
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
    component.$$.ctx.open(); // to set correct selected index
    expect(component.$$.ctx.selected).toEqual(1);
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(0);
    select.dispatchEvent(event);
    expect(component.$$.ctx.selected).toEqual(0);
    expect(component.$$.ctx.isOpen).toBeTruthy(); // still open
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
    expect(component.$$.ctx.isOpen).toBeTruthy();
    expect(component.$$.ctx.selected).toEqual(0);
    const select = target.querySelector('.select')!;
    const option = target.querySelector('.option[value="jp"]');
    const listbox = target.querySelector('.select-listbox')!;
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { enumerable: true, value: option });
    const spy1 = jest.spyOn(select, 'dispatchEvent');
    const spy2 = jest.spyOn(event, 'preventDefault'); // only present in mouse event part of select()
    listbox.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalled();
    expect(component.$$.ctx.isOpen).toBeFalsy();
    component.$$.ctx.open(); // to set correct selected index
    expect(component.$$.ctx.selected).toEqual(2);
    expect(component.$$.ctx.isOpen).toBeTruthy();
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
    expect(component.$$.ctx.isOpen).toBeTruthy();
    expect(component.$$.ctx.selected).toEqual(0);
    const select = target.querySelector('.select')!;
    const option = target.querySelector('.option[value="two"]');
    const listbox = target.querySelector('.select-listbox')!;
    const spy1 = jest.spyOn(select, 'dispatchEvent');
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { enumerable: true, value: option });
    const spy2 = jest.spyOn(event, 'preventDefault');
    listbox.dispatchEvent(event);
    expect(spy1).not.toHaveBeenCalled(); // doesn't emit an event
    expect(spy2).toHaveBeenCalled();
    expect(component.$$.ctx.selected).toEqual(0);
    expect(component.$$.ctx.isOpen).toBeTruthy(); // still open
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
    expect(component.$$.ctx.isOpen).toBeTruthy();
    expect(component.$$.ctx.selected).toEqual(0);
    const select = target.querySelector('.select')!;
    const event1 = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const spy1 = jest.spyOn(event1, 'preventDefault');
    select.dispatchEvent(event1);
    expect(component.$$.ctx.selected).toEqual(1);
    const event2 = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy2 = jest.spyOn(event2, 'preventDefault');
    select.dispatchEvent(event2);
    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();
    expect(component.$$.ctx.selected).toEqual(1);
    expect(component.$$.ctx.isOpen).toBeFalsy();
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
    expect(component.$$.ctx.filteredItems).toHaveLength(5);
    const select = target.querySelector<HTMLInputElement>('.select')!;
    select.value = 'o'; // simulate input + event
    const event = new Event('input');
    select.dispatchEvent(event);
    await tick();
    expect(component.$$.ctx.filteredItems).toHaveLength(2);
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
    expect(component.$$.ctx.filteredItems).toHaveLength(5);
    const select = target.querySelector<HTMLInputElement>('.select')!;
    select.value = 'xxxxx'; // simulate input + event
    const event = new Event('input');
    select.dispatchEvent(event);
    await tick();
    expect(component.$$.ctx.filteredItems).toHaveLength(0);
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
    expect(component.$$.ctx.inputText).toEqual('Australia');
    component.$$.ctx.open();
    expect(component.$$.ctx.inputText).toEqual('');
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select.dispatchEvent(event);
    expect(component.$$.ctx.isOpen).toBeFalsy();
    expect(component.$$.ctx.inputText).toEqual('Australia');
  });

  it('can dynamically add items', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    expect(component.$$.ctx.items).toHaveLength(5);
    component.$set({ items: [...items, { id: 'new', text: 'New' }] });
    await tick();
    expect(component.$$.ctx.items).toHaveLength(6);
    const newItem = target.querySelector('[value="new"]')!;
    expect(newItem).toBeTruthy();
    expect(newItem.outerHTML).toMatchSnapshot();
  });
});
