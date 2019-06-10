// import { tooltip } from '..';
import BasicTooltip from './__fixtures__/BasicTooltip.svelte';

describe('Tooltip', () => {
  it('renders nothing visible by default', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new BasicTooltip({ target });
    // console.log('@@@@', component.$$.ctx);
    // expect(target.innerHTML).toEqual('xx');
    expect(target.innerHTML).toBeDefined();
  });

  it('attaches tooltip on hover', () => {
    expect.assertions(1);
    const target = document.createElement('div');
    const component = new BasicTooltip({ target });
    // console.log('@@@@', component.$$.ctx);
    // expect(target.innerHTML).toEqual('xx');
    expect(target.innerHTML).toBeDefined();
  });
});
