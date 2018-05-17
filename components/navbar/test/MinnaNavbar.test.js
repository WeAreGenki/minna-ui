'use strict';

const MinnaNavbar = require('../src/MinnaNavbar.html');

const menuItems = [
  { url: '/page-one', name: 'Page One' },
  { url: '/page-two', name: 'Page Two' },
  { url: '/about', name: 'About Us' },
];

describe('MinnaNavbar component', () => {
  it('should render correctly', () => {
    const target = document.createElement('div');
    new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/',
      },
    });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
