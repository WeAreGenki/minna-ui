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
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new MinnaSelect({
      target,
      data: {
        options: selectOpts,
      },
    });
    expect(target.innerHTML).toMatchSnapshot();
  });
});

// const event = new KeyboardEvent('keydown', { key: 'Enter' });
// component.__onKeyDown(event);
// expect(component.get().value).toEqual(false);

// var event = new KeyboardEvent('keydown', { 'keyCode': 37 });
// document.dispatchEvent(event);

// console.log('!! HTML', target.innerHTML);
// console.log('!! COMPONENT', component);
