// FIXME:
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import Collapse from '../Collapse.svelte';

describe('Collapse component', () => {
  it('renders correctly with no props', () => {
    expect.assertions(3);
    function wrapper(): void {
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
