// TODO: Integration/UI tests using puppeteer
//  ↳ Responsive CSS

/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { tick } from 'svelte';
import Navbar from '../Navbar.svelte';
import UseSlot from './__fixtures__/UseSlot.svelte';

const items = [
  { text: 'Page One', url: 'page-one' },
  { text: 'Page Two', url: 'page-two' },
  { text: 'About Us', url: 'about' },
];

describe('Navbar component', () => {
  it('renders correctly with required props set', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        current: '/',
        items,
      },
      target,
    });
    expect(Array.isArray(component.items)).toBe(true);
    expect(component.items).not.toHaveLength(0);
    const navbar = target.querySelector('.navbar')!;
    expect(navbar.getAttribute('navbar-active')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it("doesn't log errors or warnings with required props", () => {
    expect.assertions(2);
    const spy1 = jest.spyOn(console, 'error');
    const spy2 = jest.spyOn(console, 'warn');
    const target = document.createElement('div');
    new Navbar({
      props: {
        current: '/',
        items,
      },
      target,
    });
    expect(spy1).not.toHaveBeenCalled();
    expect(spy2).not.toHaveBeenCalled();
    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('adds class if page is scrolled', async () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new Navbar({
      props: {
        current: '/',
        items,
      },
      target,
    });
    expect(target.querySelector('.navbar-active')).toBeNull();
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore - We know we're writing to a read only property
    window.pageYOffset = 50;
    const event = new UIEvent('scroll');
    window.dispatchEvent(event);
    await tick();
    expect(target.querySelector('.navbar-active')).not.toBeNull();
  });

  it('opens menu on button click', async () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new Navbar({
      props: {
        current: '/',
        items,
      },
      target,
    });
    const navbar1 = target.querySelector('.navbar-active');
    expect(navbar1).toBeNull();
    const button = target.querySelector<HTMLButtonElement>('.navbar-button')!;
    button.click();
    await tick();
    const navbar2 = target.querySelector('.navbar-active');
    expect(navbar2).not.toBeNull();
  });

  it('closes menu on document click', async () => {
    expect.assertions(2);
    jest.useFakeTimers();
    const target = document.createElement('div');
    new Navbar({
      props: {
        current: '/',
        items,
      },
      target,
    });
    const button = target.querySelector<HTMLButtonElement>('.navbar-button')!;
    button.click();
    await tick();
    jest.runAllTimers(); // For component setTimeout
    const navbar1 = target.querySelector('.navbar-active');
    expect(navbar1).not.toBeNull();
    const event = new MouseEvent('click');
    document.dispatchEvent(event);
    await tick();
    const navbar2 = target.querySelector('.navbar-active');
    expect(navbar2).toBeNull();
  });

  it('attaches event listener on menu open but not close', async () => {
    expect.assertions(3);
    jest.useFakeTimers();
    const target = document.createElement('div');
    new Navbar({
      props: {
        current: '/',
        items,
      },
      target,
    });
    const spy = jest.spyOn(document, 'addEventListener');
    const button = target.querySelector<HTMLButtonElement>('.navbar-button')!;
    button.click();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockReset();
    const event = new MouseEvent('click');
    document.dispatchEvent(event);
    await tick();
    jest.runAllTimers();
    const navbar = target.querySelector('.navbar-active');
    expect(navbar).toBeNull();
    expect(spy).not.toHaveBeenCalled();
    spy.mockClear();
    spy.mockRestore();
  });

  it("doesn't attach extra event listeners on multiple button clicks", async () => {
    expect.assertions(3);
    jest.useFakeTimers();
    const target = document.createElement('div');
    new Navbar({
      props: {
        current: '/',
        items,
      },
      target,
    });
    const spy = jest.spyOn(document, 'addEventListener');
    spy.mockClear();
    const active1 = target.querySelector('.navbar-active');
    expect(active1).toBeNull();
    const button = target.querySelector<HTMLButtonElement>('.navbar-button')!;
    button.click();
    await tick();
    jest.runAllTimers();
    button.click();
    await tick();
    jest.runAllTimers();
    const active2 = target.querySelector('.navbar-active');
    expect(active2).not.toBeNull();
    button.click();
    await tick();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('shows correct icon and class when toggled', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    new Navbar({
      props: {
        current: '/',
        items,
      },
      target,
    });
    const icon1 = target.querySelector<SVGUseElement>('.navbar-icon > use')!;
    const navbarLinks = target.querySelector('.navbar-links')!;
    expect(icon1.getAttribute('xlink:href')).toBe('#menu');
    expect(navbarLinks.classList.contains('df')).toBe(false);
    const button = target.querySelector<HTMLButtonElement>('.navbar-button')!;
    button.click();
    await tick();
    const icon2 = target.querySelector<SVGUseElement>('.navbar-icon > use')!;
    expect(icon2.getAttribute('xlink:href')).toBe('#x');
    expect(navbarLinks.classList.contains('df')).toBe(true);
  });

  it('adds aria-current attribute to active menu item', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new Navbar({
      props: {
        current: 'page-two',
        items,
      },
      target,
    });
    const linkPageTwo = target.querySelector('[href="page-two"]')!;
    const linkPageOne = target.querySelector('[href="page-one"]')!;
    expect(linkPageTwo.getAttribute('aria-current')).toBe('page');
    expect(linkPageOne.getAttribute('aria-current')).toBeNull();
  });

  it('can dynamically add menu items', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        current: '/',
        items,
      },
      target,
    });
    expect(component.items).toHaveLength(3);
    component.$set({
      items: [...items, { name: 'Page New', url: 'page-new' }],
    });
    expect(component.items).toHaveLength(4);
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('renders custom markup when slot content is used', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new UseSlot({
      props: {
        current: '/',
        items,
      },
      target,
    });
    const logo = target.querySelector('.navbar-logo-link')!;
    expect(logo.textContent).toBe('Custom Slot Content');
    expect(target.innerHTML).toMatchSnapshot();
  });
});
