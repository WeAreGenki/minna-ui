'use strict';

const MinnaTabs = require('../src/MinnaTabs.html');

describe('MinnaTabs component', () => {
  it('should render correctly', () => {
    const target = document.createElement('div');
    new MinnaTabs({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
