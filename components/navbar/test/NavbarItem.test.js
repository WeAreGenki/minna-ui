'use strict';

const NavbarItem = require('../src/NavbarItem.html');

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

describe('NavbarItem component', () => {
  it('throws error with no props', () => {
    expect.assertions(1);
    function wrapper() {
      const target = document.createElement('div');
      new NavbarItem({ target });
    }
    expect(wrapper).toThrow();
  });

  it.skip('renders item correctly with required props set', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    // const component = new NavbarItem({
    new NavbarItem({
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

  it.skip('renders submenu correctly with required props set', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    // const component = new NavbarItem({
    new NavbarItem({
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

  it.skip('adds rel attribute when present', () => {});

  it.skip('does not add rel attribute when not present', () => {});
});
