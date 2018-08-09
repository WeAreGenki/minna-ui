'use strict';

const MinnaNavbarItem = require('../src/MinnaNavbarItem.html');

const menuItem = {
  item: { url: 'page-one', name: 'Page One' },
  segment: 'page-one',
};

const subMenu = {
  item: {
    name: 'Page Two',
    children: [
      { url: 'page-two/child-one', name: 'Child One - Page Two' },
      { url: 'page-two/child-two', name: 'Child Two - Page Two' },
    ],
  },
  segment: 'page-one',
};

describe('MinnaNavbarItem component', () => {
  it('throws error with no props', () => {
    expect.assertions(1);
    function wrapper() {
      const target = document.createElement('div');
      new MinnaNavbarItem({ target });
    }
    expect(wrapper).toThrow();
  });

  it('renders item correctly with required props set', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaNavbarItem({
      target,
      data: menuItem,
    });
    // expect(Array.isArray(component.get().menuItems)).toEqual(true);
    // expect(component.get().menuItems).not.toHaveLength(0);
    // expect(target
    //   .querySelector('.navbar')
    //   .getAttribute('navbar-active')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders submenu correctly with required props set', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaNavbarItem({
      target,
      data: subMenu,
    });
    // expect(Array.isArray(component.get().menuItems)).toEqual(true);
    // expect(component.get().menuItems).not.toHaveLength(0);
    // expect(target
    //   .querySelector('.navbar')
    //   .getAttribute('navbar-active')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });
});
