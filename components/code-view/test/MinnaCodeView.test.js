'use strict';

const MinnaCodeView = require('../src/MinnaCodeView.html');

describe('MinnaCodeView component', () => {
  it('should render correctly', () => {
    const target = document.createElement('div');
    new MinnaCodeView({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
