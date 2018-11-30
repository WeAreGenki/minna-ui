'use strict';

const Tabs = require('../src/Tabs.html');

describe('Tabs component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new Tabs({ target }); // tslint:disable-line no-unused-expression
    expect(target.innerHTML).toMatchSnapshot();
  });
});
