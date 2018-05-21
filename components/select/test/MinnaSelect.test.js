'use strict';

const MinnaSelect = require('../src/MinnaSelect.html');

const options = [
  { id: 'au', text: 'Australia' },
  { id: 'cn', text: 'China' },
  { id: 'jp', text: 'Japan' },
  { id: 'kr', text: 'Korea' },
  { id: 'other', text: 'Other / Unknown' },
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
    expect(Array.isArray(component.get().options)).toEqual(true);
    expect(component.get().options).not.toHaveLength(0);
    expect(component.refs.__target).toBeDefined();
    const select = target.querySelector('.select');
    expect(select.getAttribute('tabindex')).toEqual('0');
    expect(select.getAttribute('disabled')).toBeNull();
    expect(select.getAttribute('required')).toBeNull();
    expect(select.getAttribute('placeholder')).not.toBeFalsy();
    expect(document.querySelector('select-active')).toBeNull();
    expect(document.querySelector('select-disabled')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it.skip('renders with filterable prop', () => {});

  it.skip('renders with filterHelp prop', () => {});

  it.skip('renders with placeholder prop', () => {});

  it.skip('renders with id prop', () => {});

  it.skip('renders with disabled prop', () => {});

  it.skip('renders with readonly prop', () => {});

  it.skip('renders with required prop', () => {});

  it.skip('shows on click', () => {});

  it.skip('does not show on click when disabled', () => {});

  it.skip('hides on click outside the component', () => {});

  it.skip('selects an item on click', () => {});

  it.skip('shows on enter key press', () => {});

  it.skip('shows on spacebar key press', () => {});

  it.skip('shows on down key press', () => {});

  it.skip('shows automatically on focus', () => {});

  it.skip('does not show on key press when disabled', () => {});

  it.skip('hides on ESC key press', () => {});

  it.skip('does nothing on invalid key press', () => {});

  it.skip('selects item on enter key press', () => {});

  it.skip('selects next item on down key press', () => {});

  it.skip('selects previous item on up key press', () => {});

  it.skip('typing in input filters the shown options', () => {});

  it.skip('input is cleared on ESC key press', () => {});

  it.skip('can dynamically add options', () => {});
});

// const event = new KeyboardEvent('keydown', { key: 'Enter' });
// component.__onKeyDown(event);
// expect(component.get().value).toEqual(false);

// var event = new KeyboardEvent('keydown', { 'keyCode': 37 });
// document.dispatchEvent(event);

// console.log('!! HTML', target.innerHTML);
// console.log('!! COMPONENT', component);
