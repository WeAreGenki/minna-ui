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
  it('has default props set correctly', () => {
    expect.assertions(7);
    const target = document.createElement('div');
    const component = new Select({
      props: { items: [] },
      target,
    });
    expect(component.disabled).toBe(false);
    expect(component.filterable).toBe(true);
    expect(component.filterHelp).toBe('Filter...');
    expect(component.isOpen).toBe(false);
    expect(component.placeholder).toBe('Choose...');
    expect(component.id).toBeUndefined();
    expect(component.value).toBeUndefined();
  });

  it('renders correctly with required props set', () => {
    expect.assertions(8);
    const target = document.createElement('div');
    const component = new Select({
      props: selectOpts,
      target,
    });
    const select = target.querySelector('.select')!;
    expect(Array.isArray(component.items)).toBe(true);
    expect(component.items).not.toHaveLength(0);
    expect(select.getAttribute('tabindex')).toBe('0');
    expect(select.getAttribute('disabled')).toBeNull();
    expect(select.getAttribute('placeholder')).not.toBe(false);
    expect(document.querySelector('select-active')).toBeNull();
    expect(document.querySelector('select-disabled')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it("doesn't log errors or warnings with required props", () => {
    expect.assertions(2);
    const spy1 = jest.spyOn(console, 'error');
    const spy2 = jest.spyOn(console, 'warn');
    const target = document.createElement('div');
    new Select({
      props: selectOpts,
      target,
    });
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('renders with value prop set', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new Select({
      props: {
        ...selectOpts,
        value: 'jp',
      },
      target,
    });
    const active = target.querySelector('.option-active')!;
    expect(active.getAttribute('value')).toBe('jp');
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

  it('updates selected item on value change', async () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: 'cn',
      },
      target,
    });
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('cn');
    component.value = 'kr';
    const select = target.querySelector<HTMLSelectElement>('.select')!;
    select.click(); // To set correct selected index
    await tick();
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('kr');
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
    // @ts-expect-error - keyCode does actually exist!
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
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('au');
    const select = target.querySelector('.select')!;
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('au');
    select.dispatchEvent(event);
    const active3 = target.querySelector('.option-active')!;
    expect(active3.getAttribute('value')).toBe('au');
    expect(component.isOpen).toBe(true); // Still open
  });

  it('selects previous item on up key press', async () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: items[2].id,
      },
      target,
    });
    const select = target.querySelector<HTMLSelectElement>('.select')!;
    select.click(); // To set correct selected index
    expect(component.isOpen).toBe(true);
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('jp');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    await tick();
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('cn');
    select.dispatchEvent(event);
    await tick();
    const active3 = target.querySelector('.option-active')!;
    expect(active3.getAttribute('value')).toBe('au');
    expect(component.isOpen).toBe(true); // Still open
  });

  it('skips over disabled items on down key press', async () => {
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
    const select = target.querySelector<HTMLSelectElement>('.select')!;
    select.click(); // To set correct selected index
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('1');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    await tick();
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('3');
    select.dispatchEvent(event);
    await tick();
    const active3 = target.querySelector('.option-active')!;
    expect(active3.getAttribute('value')).toBe('7');
    select.dispatchEvent(event);
    await tick();
    const active4 = target.querySelector('.option-active')!;
    expect(active4.getAttribute('value')).toBe('7');
    expect(component.isOpen).toBe(true); // Still open
  });

  it('skips over disabled items on up key press', async () => {
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
    const select = target.querySelector<HTMLSelectElement>('.select')!;
    select.click(); // To set correct selected index
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('7');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    await tick();
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('3');
    select.dispatchEvent(event);
    await tick();
    const active3 = target.querySelector('.option-active')!;
    expect(active3.getAttribute('value')).toBe('1');
    select.dispatchEvent(event);
    await tick();
    const active4 = target.querySelector('.option-active')!;
    expect(active4.getAttribute('value')).toBe('1');
    expect(component.isOpen).toBe(true); // Still open
  });

  it("doesn't go past end of items on down key press", async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: items[3].id,
      },
      target,
    });
    const select = target.querySelector<HTMLSelectElement>('.select')!;
    select.click(); // To set correct selected index
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('kr');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    select.dispatchEvent(event);
    await tick();
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('other');
    select.dispatchEvent(event);
    await tick();
    const active3 = target.querySelector('.option-active')!;
    expect(active3.getAttribute('value')).toBe('other');
    expect(component.isOpen).toBe(true); // Still open
  });

  it("doesn't go past end of items on up key press", async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: items[1].id,
      },
      target,
    });
    const select = target.querySelector<HTMLSelectElement>('.select')!;
    select.click(); // To set correct selected index
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('cn');
    const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    select.dispatchEvent(event);
    await tick();
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('au');
    select.dispatchEvent(event);
    await tick();
    const active3 = target.querySelector('.option-active')!;
    expect(active3.getAttribute('value')).toBe('au');
    expect(component.isOpen).toBe(true); // Still open
  });

  it('selects an item on click', async () => {
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
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('au');
    const select = target.querySelector<HTMLSelectElement>('.select')!;
    const option = target.querySelector('.option[value="jp"]');
    const listbox = target.querySelector('.select-listbox')!;
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { enumerable: true, value: option });
    const spy1 = jest.spyOn(select, 'dispatchEvent');
    const spy2 = jest.spyOn(event, 'preventDefault'); // Only present in mouse event part of select()
    listbox.dispatchEvent(event);
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(component.isOpen).toBe(false);
    select.click(); // To set correct selected index
    await tick();
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('jp');
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
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('one');
    const select = target.querySelector('.select')!;
    const option = target.querySelector('.option[value="two"]');
    const listbox = target.querySelector('.select-listbox')!;
    const spy1 = jest.spyOn(select, 'dispatchEvent');
    const event = new MouseEvent('mousedown');
    Object.defineProperty(event, 'target', { enumerable: true, value: option });
    const spy2 = jest.spyOn(event, 'preventDefault');
    listbox.dispatchEvent(event);
    expect(spy1).not.toHaveBeenCalled(); // Doesn't emit an event
    expect(spy2).toHaveBeenCalledTimes(1);
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('one');
    expect(component.isOpen).toBe(true); // Still open
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('selects item on enter key press', async () => {
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
    const active1 = target.querySelector('.option-active')!;
    expect(active1.getAttribute('value')).toBe('au');
    const select = target.querySelector('.select')!;
    const event1 = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    const spy1 = jest.spyOn(event1, 'preventDefault');
    select.dispatchEvent(event1);
    await tick();
    const active2 = target.querySelector('.option-active')!;
    expect(active2.getAttribute('value')).toBe('cn');
    const event2 = new KeyboardEvent('keydown', { key: 'Enter' });
    const spy2 = jest.spyOn(event2, 'preventDefault');
    select.dispatchEvent(event2);
    await tick();
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    const active3 = target.querySelector('.option-active')!;
    expect(active3.getAttribute('value')).toBe('cn');
    expect(component.isOpen).toBe(false);
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('typing in input filters the shown items', async () => {
    expect.assertions(3);
    const target = document.createElement('div');
    new Select({
      props: {
        ...selectOpts,
        isOpen: true,
      },
      target,
    });
    const listbox1 = target.querySelector('.select-listbox')!;
    expect(listbox1.childNodes).toHaveLength(5);
    const select = target.querySelector<HTMLInputElement>('.select')!;
    select.value = 'o'; // simulate input + event
    const event = new Event('input');
    select.dispatchEvent(event);
    await tick();
    const listbox2 = target.querySelector('.select-listbox')!;
    expect(listbox2.childNodes).toHaveLength(2);
    expect(listbox2.innerHTML).toMatchSnapshot();
  });

  it('shows feedback message when filter has no match', async () => {
    expect.assertions(3);
    const target = document.createElement('div');
    new Select({
      props: {
        ...selectOpts,
        isOpen: true,
      },
      target,
    });
    const listbox1 = target.querySelector('.select-listbox')!;
    expect(listbox1.childNodes).toHaveLength(5);
    const select = target.querySelector<HTMLInputElement>('.select')!;
    select.value = 'xxxxx'; // Simulate input + event
    const event = new Event('input');
    select.dispatchEvent(event);
    await tick();
    const listbox2 = target.querySelector('.select-listbox')!;
    expect(listbox2.childNodes).toHaveLength(1);
    expect(listbox2.innerHTML).toMatchSnapshot();
  });

  it('input is reset on ESC key press', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Select({
      props: {
        ...selectOpts,
        value: 'au',
      },
      target,
    });
    const select1 = target.querySelector<HTMLInputElement>('.select')!;
    expect(select1.value).toBe('Australia');
    select1.click();
    await tick();
    const select2 = target.querySelector<HTMLInputElement>('.select')!;
    expect(select2.value).toBe('');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    select2.dispatchEvent(event);
    await tick();
    expect(component.isOpen).toBe(false);
    const select3 = target.querySelector<HTMLInputElement>('.select')!;
    expect(select3.value).toBe('Australia');
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
    expect(newItem).toBeDefined();
    expect(newItem.outerHTML).toMatchSnapshot();
  });
});
