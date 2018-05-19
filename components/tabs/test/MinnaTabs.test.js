'use strict';

const MinnaTabs = require('../src/MinnaTabs.html');

describe('MinnaTabs component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new MinnaTabs({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
