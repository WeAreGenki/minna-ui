'use strict';

const MinnaToggle = require('../src/MinnaToggle.html');

describe('MinnaToggle component', () => {
  it('should render correctly', () => {
    const target = document.createElement('div');
    new MinnaToggle({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
