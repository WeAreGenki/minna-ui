import Switch from '../src/Switch.svelte';

describe('Switch component', () => {
  it('renders correctly with no props', () => {
    expect.assertions(7);
    function wrapper(): void {
      const target = document.createElement('div');
      new Switch({ target });
      const el = target.querySelector('.switch');
      expect(el.getAttribute('tabindex')).toEqual('0');
      expect(el.getAttribute('disabled')).toBeNull();
      expect(el.getAttribute('required')).toBeNull();
      expect(document.querySelector('switch-checked')).toBeNull();
      expect(document.querySelector('switch-disabled')).toBeNull();
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
  });

  it('renders with value true', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    expect(component.$$.ctx.value).toEqual(true);
    expect(target.querySelector('.switch-checked')).not.toBeNull();
  });

  it('renders with value false', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: false,
      },
      target,
    });
    expect(component.$$.ctx.value).toEqual(false);
    expect(target.querySelector('.switch-checked')).toBeNull();
  });

  it('renders with textOn/textOff props', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        textOff: 'NO',
        textOn: 'YES',
      },
      target,
    });
    expect(component.$$.ctx.textOn).toEqual('YES');
    expect(component.$$.ctx.textOff).toEqual('NO');
    expect(target.querySelector('.switch-on').innerHTML).toEqual('YES');
    expect(target.querySelector('.switch-off').innerHTML).toEqual('NO');
  });

  it('renders with mini prop', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        mini: true,
      },
      target,
    });
    expect(component.$$.ctx.mini).toBeTruthy();
    expect(target.querySelector('.switch-mini')).not.toBeNull();
  });

  it('renders with disabled prop', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        disabled: true,
      },
      target,
    });
    expect(component.$$.ctx.disabled).toBeTruthy();
    expect(target.querySelector('.switch-disabled')).not.toBeNull();
    expect(target.querySelector('.switch').getAttribute('tabindex')).toEqual('-1');
  });

  it('toggles class when value changes', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: false,
      },
      target,
    });
    expect(component.$$.ctx.value).toEqual(false);
    expect(target.querySelector('.switch-checked')).toBeNull();
    component.value = true;
    expect(target.querySelector('.switch-checked')).not.toBeNull();
    component.value = false;
    expect(target.querySelector('.switch-checked')).toBeNull();
  });

  // FIXME: Use a spy to validate the function was called
  it('toggles value on click', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    // const spy = jest.spyOn(component.$$.ctx, 'toggle');
    expect(component.$$.ctx.value).toEqual(true);
    target.querySelector('.switch').click();
    // expect(spy).toHaveBeenCalled();
    expect(component.$$.ctx.value).toEqual(false);
    // spy.mockRestore();
  });

  // FIXME: Use a spy to validate the function was called
  it('does not toggle value on click when disabled', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        disabled: true,
        value: true,
      },
      target,
    });
    // const spy = jest.spyOn(component.$$.ctx, 'toggle');
    expect(component.$$.ctx.value).toEqual(true);
    target.querySelector('.switch').click();
    // expect(spy).toHaveBeenCalled();
    expect(component.$$.ctx.value).toEqual(true);
    // spy.mockRestore();
  });

  it('toggles on enter key press', () => {
    expect.assertions(2);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    const event1 = new KeyboardEvent('keydown', { key: 'Enter' });
    component.$$.ctx.handleKeyDown(event1);
    expect(component.$$.ctx.value).toEqual(false);
    const event2 = new KeyboardEvent('keydown', { keyCode: 13 });
    component.$$.ctx.handleKeyDown(event2);
    expect(component.$$.ctx.value).toEqual(true);
  });

  it('toggles on spacebar key press', () => {
    expect.assertions(3);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    const event1 = new KeyboardEvent('keydown', { key: ' ' });
    component.$$.ctx.handleKeyDown(event1);
    expect(component.$$.ctx.value).toEqual(false);
    const event2 = new KeyboardEvent('keydown', { key: 'Spacebar' });
    component.$$.ctx.handleKeyDown(event2);
    expect(component.$$.ctx.value).toEqual(true);
    const event3 = new KeyboardEvent('keydown', { keyCode: 32 });
    component.$$.ctx.handleKeyDown(event3);
    expect(component.$$.ctx.value).toEqual(false);
  });

  it('does not toggle on key press when disabled', () => {
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        disabled: true,
        value: true,
      },
      target,
    });
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.$$.ctx.handleKeyDown(event);
    expect(component.$$.ctx.value).toEqual(true);
  });

  it('does not toggle on invalid key press', () => {
    expect.assertions(5);
    const target = document.createElement('div');
    const component = new Switch({
      props: {
        value: true,
      },
      target,
    });
    const spy = jest.spyOn(component.$$.ctx, 'toggle');
    const event1 = new KeyboardEvent('keydown', { key: 'Escape' });
    component.$$.ctx.handleKeyDown(event1);
    expect(component.$$.ctx.value).toEqual(true);
    const event2 = new KeyboardEvent('keydown', { keyCode: 0 });
    component.$$.ctx.handleKeyDown(event2);
    expect(component.$$.ctx.value).toEqual(true);
    const event3 = new KeyboardEvent('keydown', { key: '' });
    component.$$.ctx.handleKeyDown(event3);
    expect(component.$$.ctx.value).toEqual(true);
    const event4 = new KeyboardEvent('keydown');
    component.$$.ctx.handleKeyDown(event4);
    expect(component.$$.ctx.value).toEqual(true);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
