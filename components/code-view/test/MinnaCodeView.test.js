'use strict';

const MinnaCodeView = require('../src/MinnaCodeView.html');

describe('MinnaCodeView component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new MinnaCodeView({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
