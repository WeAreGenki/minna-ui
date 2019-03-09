'use strict';

const NavbarItem = require('../src/NavbarItem.svelte');

const menuItem = {
  item: { name: 'Page One', url: 'page-one' },
  segment: 'page-one',
};

const subMenu = {
  item: {
    children: [
      { name: 'Child One - Page Two', url: 'page-two/child-one' },
      { name: 'Child Two - Page Two', url: 'page-two/child-two' },
    ],
    name: 'Page Two',
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
      data: menuItem,
      target,
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
      data: subMenu,
      target,
    });
    // expect(Array.isArray(component.get().menuItems)).toEqual(true);
    // expect(component.get().menuItems).not.toHaveLength(0);
    // expect(target
    //   .querySelector('.navbar')
    //   .getAttribute('navbar-active')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it.todo('adds rel attribute when present');

  it.todo('does not add rel attribute when not present');
});
