// TODO: Integration or E2E tests in a real browser since these tests are less than ideal

// TODO: CSS unit tests for responsive functionality

// TODO: Test CSS output when using CSS variables (custom properties)

// FIXME:
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Navbar from '../Navbar.svelte';

const items = [
  { text: 'Page One', url: 'page-one' },
  { text: 'Page Two', url: 'page-two' },
  {
    children: [
      { text: 'Child One - More', url: 'more/child-one' },
      { text: 'Child Two - More', url: 'more/child-two' },
    ],
    text: 'More ▾',
  },
  { text: 'About Us', url: 'about' },
];

describe('Navbar component', () => {
  it.skip('throws error with no props', () => {
    expect.assertions(1);
    function wrapper(): void {
      const target = document.createElement('div');
      new Navbar({ target });
    }
    expect(wrapper).toThrow();
  });

  it('renders correctly with required props set', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    expect(Array.isArray(component.$$.ctx.items)).toEqual(true);
    expect(component.$$.ctx.items).not.toHaveLength(0);
    expect(target.querySelector('.navbar').getAttribute('navbar-active')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('adds class if page is scrolled', () => {
    expect.assertions(3);
    const spy = jest.spyOn(window, 'requestAnimationFrame');
    spy.mockImplementation((cb) => cb());
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    window.pageYOffset = 50;
    const event = new UIEvent('scroll');
    document.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
    expect(component.$$.ctx.hasScrolled).toEqual(true);
    expect(target.querySelector('.navbar-active')).not.toBeNull();
    spy.mockRestore();
  });

  it('open menu on button click', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    const spy = jest.spyOn(component.$$.ctx, 'openMenu', 'get');
    const button = target.querySelector('.navbar-button');
    button.click();
    expect(component.$$.ctx.isOpen).toBeTruthy();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('close menu on document click', () => {
    expect.assertions(2);
    jest.useFakeTimers();
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    component.openMenu();
    jest.runAllTimers(); // for component setTimeout
    expect(component.$$.ctx.isOpen).toBeTruthy();
    const event = new MouseEvent('click');
    document.dispatchEvent(event);
    expect(component.$$.ctx.isOpen).toBeFalsy();
  });

  it('attaches event listener on menu open but not close', () => {
    expect.assertions(3);
    jest.useFakeTimers();
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    const spy = jest.spyOn(document, 'addEventListener');
    component.openMenu();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalled();
    spy.mockReset();
    const event = new MouseEvent('click');
    document.dispatchEvent(event);
    expect(component.$$.ctx.isOpen).toBeFalsy();
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it("doesn't attach extra event listeners on multiple button clicks", () => {
    expect.assertions(2);
    jest.useFakeTimers();
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    const spy = jest.spyOn(document, 'addEventListener');
    const button = target.querySelector('.navbar-button');
    button.click();
    jest.runAllTimers();
    button.click();
    jest.runAllTimers();
    expect(component.$$.ctx.isOpen).toBeTruthy();
    button.click();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('shows correct icon and class when toggled', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
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
    new Navbar({
      props: {
        items,
        segment: 'page-two',
      },
      target,
    });
    expect(
      target.querySelector('[href="page-two"]').classList.contains('navbar-link-active'),
    ).toBeTruthy();
    expect(
      target.querySelector('[href="page-one"]').classList.contains('navbar-link-active'),
    ).not.toBeTruthy();
  });

  // FIXME: Work out how nested menus should work
  it.skip('adds class to active menu item in nested route', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new Navbar({
      props: {
        items,
        // FIXME: Bring this up to date with how things work in Sapper 0.15.x
        // segment: 'page-two/child-two',
        segment: 'page-two',
      },
      target,
    });
    // console.log('@@ 22 target', target.innerHTML);
    // console.log('@@ 33', target.querySelector('.navbar-links').innerHTML);
    expect(
      target.querySelector('[href="page-two"]').classList.contains('navbar-link-active'),
    ).toBeTruthy();
    expect(
      target.querySelector('[href="page-one"]').classList.contains('navbar-link-active'),
    ).not.toBeTruthy();
  });

  it.skip('can dynamically add menu items', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    component.set({
      items: [...items, { name: 'Page New', url: 'page-new' }],
    });
    expect(component.$$.ctx.items).toHaveLength(6);
    expect(target.innerHTML).toMatchSnapshot();
  });

  it.skip('renders custom markup when slot content is used', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    // const component = new Navbar({
    new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    // component.set({
    //   items: [...items, { name: 'Page New', url: 'page-new' }],
    // });
    // expect(component.$$.ctx.items).toHaveLength(6);
    expect(target.innerHTML).toMatchSnapshot();
  });
});
