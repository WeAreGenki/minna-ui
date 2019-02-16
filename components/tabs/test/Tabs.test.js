'use strict';

const Tabs = require('../src/Tabs.svelte');

describe('Tabs component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new Tabs({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
