'use strict';

const MinnaToasts = require('../src/MinnaToasts.html');

describe('MinnaToasts component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new MinnaToasts({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
