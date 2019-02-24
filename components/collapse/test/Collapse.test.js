const Collapse = require('../src/Collapse.svelte').default;

describe('Collapse component', () => {
  it('renders correctly with no props', () => {
    expect.assertions(3);
    function wrapper() {
      const target = document.createElement('div');
      new Collapse({ target });
      expect(target.querySelector('.collapse-hide')).not.toBeNull();
      expect(target.innerHTML).toMatchSnapshot();
    }
    expect(wrapper).not.toThrow();
  });

  it('collapsed content shows and hides on click', () => {
    expect.assertions(4);
    const target = document.createElement('div');
    const component = new Collapse({ target });
    expect(component.$$.ctx.isOpen).toBeFalsy();
    const button = target.querySelector('button');
    button.click();
    expect(component.$$.ctx.isOpen).toBeTruthy();
    button.click();
    expect(component.$$.ctx.isOpen).toBeFalsy();
    expect(document.querySelector('collapse-hide')).toBeNull();
  });
});
