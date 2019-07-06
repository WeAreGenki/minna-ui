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
        items,
        segment: undefined,
      },
      target,
    });
    expect(Array.isArray(component.items)).toBe(true);
    expect(component.items).not.toHaveLength(0);
    const navbar = target.querySelector('.navbar')!;
    expect(navbar.getAttribute('navbar-active')).toBeNull();
    expect(target.innerHTML).toMatchSnapshot();
  });

  it('adds class if page is scrolled', async () => {
    expect.assertions(2);
    const target = document.createElement('div');
    new Navbar({
      props: {
        items,
        segment: undefined,
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

  it('opens menu on button click', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    expect(component.isOpen).toBe(false);
    const button = target.querySelector<HTMLButtonElement>('button.navbar-button')!;
    button.click();
    expect(component.isOpen).toBe(true);
  });

  it('closes menu on document click', () => {
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
    expect(component.isOpen).toBe(true);
    const event = new MouseEvent('click');
    document.dispatchEvent(event);
    expect(component.isOpen).toBe(false);
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
    expect(spy).toHaveBeenCalledWith('');
    spy.mockReset();
    const event = new MouseEvent('click');
    document.dispatchEvent(event);
    expect(component.isOpen).toBe(false);
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
    const button = target.querySelector<HTMLButtonElement>('button.navbar-button')!;
    button.click();
    jest.runAllTimers();
    button.click();
    jest.runAllTimers();
    expect(component.isOpen).toBe(true);
    button.click();
    jest.runAllTimers();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('shows correct icon and class when toggled', async () => {
    expect.assertions(4);
    const target = document.createElement('div');
    new Navbar({
      props: {
        items,
        segment: undefined,
      },
      target,
    });
    const icon1 = target.querySelector<SVGUseElement>('.navbar-icon > use')!;
    const navbarLinks = target.querySelector('.navbar-links')!;
    expect(icon1.getAttribute('xlink:href')).toBe('#menu');
    expect(navbarLinks.classList.contains('df')).toBe(false);
    const button = target.querySelector<HTMLButtonElement>('button.navbar-button')!;
    button.click();
    await tick();
    const icon2 = target.querySelector<SVGUseElement>('.navbar-icon > use')!;
    expect(icon2.getAttribute('xlink:href')).toBe('#x');
    expect(navbarLinks.classList.contains('df')).toBe(true);
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
    const linkPageTwo = target.querySelector('[href="page-two"]')!;
    const linkPageOne = target.querySelector('[href="page-one"]')!;
    expect(linkPageTwo.classList.contains('navbar-link-active')).toBe(true);
    expect(linkPageOne.classList.contains('navbar-link-active')).not.toBe(true);
  });

  it('can dynamically add menu items', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Navbar({
      props: {
        items,
        segment: undefined,
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
        items,
        segment: undefined,
      },
      target,
    });
    const logo = target.querySelector('.navbar-logo-link')!;
    expect(logo.textContent).toBe('Custom Slot Content');
    expect(target.innerHTML).toMatchSnapshot();
  });
});
