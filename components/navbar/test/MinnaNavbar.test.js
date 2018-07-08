// TODO: Integration or E2E tests in a real browser since these tests are less than ideal

// TODO: CSS unit tests for responsive functionality

// TODO: Test CSS output when using CSS variables (custom properties)

'use strict';

const MinnaNavbar = require('../src/MinnaNavbar.html');

const menuItems = [
  { url: '/page-one', name: 'Page One' },
  { url: '/page-two', name: 'Page Two' },
  { url: '/page-two/child-one', name: 'Child One - Page Two' },
  { url: '/page-two/child-two', name: 'Child Two - Page Two' },
  { url: '/about', name: 'About Us' },
];

describe('MinnaNavbar component', () => {
  it('throws error with no props', () => {
    expect.assertions(1);
    function wrapper() {
      const target = document.createElement('div');
      new MinnaNavbar({ target });
    }
    expect(wrapper).toThrow();
  });

  it('renders correctly with required props set', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/',
      },
    });
    expect(Array.isArray(component.get().items)).toEqual(true);
    expect(component.get().items).not.toHaveLength(0);
    expect(target
      .querySelector('.navbar')
      .getAttribute('navbar-active')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('adds class if page is scrolled', () => {
    expect.assertions(3);
    const spy = jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
    const target = document.createElement('div');
    const component = new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/',
      },
    });
    window.pageYOffset = 50;
    const event = new UIEvent('scroll');
    document.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
    expect(component.get().__hasScrolled).toEqual(true);
    expect(target.querySelector('.navbar-active')).not.toBeNull();
    spy.mockReset();
    spy.mockRestore();
  });

  it('open menu on button click', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/',
      },
    });
    const spy = jest.spyOn(component, '__openMenu');
    const button = target.querySelector('.navbar-button');
    button.click();
    expect(component.get().__isOpen).toBeTruthy();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  it('close menu on document click', () => {
    expect.assertions(2);
    jest.useFakeTimers();
    const target = document.createElement('div');
    const component = new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/',
      },
    });
    component.__openMenu();
    jest.runAllTimers(); // for component setTimeout
    expect(component.get().__isOpen).toBeTruthy();
    const event = new MouseEvent('click');
    document.dispatchEvent(event);
    expect(component.get().__isOpen).toBeFalsy();
  });

  it('attaches event listener on menu open but not close', () => {
    expect.assertions(3);
    jest.useFakeTimers();
    const target = document.createElement('div');
    const component = new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/',
      },
    });
    const spy = jest.spyOn(document, 'addEventListener');
    component.__openMenu();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    const event = new MouseEvent('click');
    document.dispatchEvent(event);
    expect(component.get().__isOpen).toBeFalsy();
    expect(spy).not.toHaveBeenCalled();
    spy.mockReset();
    spy.mockRestore();
  });

  it('doesn\'t attach extra event listeners on multiple button clicks', () => {
    expect.assertions(2);
    jest.useFakeTimers();
    const target = document.createElement('div');
    const component = new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/',
      },
    });
    const spy = jest.spyOn(document, 'addEventListener');
    const button = target.querySelector('.navbar-button');
    button.click();
    jest.runAllTimers();
    button.click();
    jest.runAllTimers();
    expect(component.get().__isOpen).toBeTruthy();
    button.click();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
    spy.mockRestore();
  });

  it('shows correct icon and class when toggled', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/',
      },
    });
    const icon = target.querySelector('.navbar-button > svg > use');
    const navbarLinks = target.querySelector('.navbar-links');
    expect(icon.getAttribute('xlink:href')).toEqual('#menu');
    expect(navbarLinks.classList.contains('df')).toBeFalsy();
    target.querySelector('.navbar-button').click();
    expect(icon.getAttribute('xlink:href')).toEqual('#x');
    expect(navbarLinks.classList.contains('df')).toBeTruthy();
  });

  it('adds class to active menu item', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/page-two',
      },
    });
    expect(target
      .querySelector('[href="/page-two"]')
      .classList.contains('navbar-link-active')).toBeTruthy();
    expect(target
      .querySelector('[href="/page-one"]')
      .classList.contains('navbar-link-active')).not.toBeTruthy();
  });

  it('adds class to active menu item in nested route', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/page-two/child-two',
      },
    });
    expect(target
      .querySelector('[href="/page-two"]')
      .classList.contains('navbar-link-active')).toBeTruthy();
    expect(target
      .querySelector('[href="/page-one"]')
      .classList.contains('navbar-link-active')).not.toBeTruthy();
  });

  it('can dynamically add menu items', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new MinnaNavbar({
      target,
      data: {
        items: menuItems,
        page: '/',
      },
    });
    component.set({
      items: [...menuItems, { url: 'page-new', name: 'Page New' }],
    });
    expect(component.get().items).toHaveLength(6);
    expect(target.innerHTML).toMatchSnapshot();
  });
});
