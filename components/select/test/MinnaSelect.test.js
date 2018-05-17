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
  it('should render correctly', () => {
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
