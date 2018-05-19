'use strict';

const MinnaSelect = require('../src/MinnaSelect.html');

const selectOpts = [
  { id: 'au', text: 'Australia' },
  { id: 'cn', text: 'China' },
  { id: 'jp', text: 'Japan' },
  { id: 'kr', text: 'Korea' },
  { id: 'other', text: 'Other / Unknown' },
];

describe('MinnaSelect component', () => {
  it('throws error with no props', () => {
    expect.assertions(1);
    function wrapper() {
      const target = document.createElement('div');
      new MinnaSelect({ target });
    }
    expect(wrapper).toThrow();
  });

  it('renders correctly with props set', () => {
    const target = document.createElement('div');
    const component = new MinnaSelect({
      target,
      data: {
        options: selectOpts,
      },
    });
    expect(Array.isArray(component.get().options)).toEqual(true);
    expect(component.get().options).not.toHaveLength(0);
    expect(target.innerHTML).toMatchSnapshot();
  });

  it.skip('can dynamically add options', () => {});
});

// const event = new KeyboardEvent('keydown', { key: 'Enter' });
// component.__onKeyDown(event);
// expect(component.get().value).toEqual(false);

// var event = new KeyboardEvent('keydown', { 'keyCode': 37 });
// document.dispatchEvent(event);

// console.log('!! HTML', target.innerHTML);
// console.log('!! COMPONENT', component);
