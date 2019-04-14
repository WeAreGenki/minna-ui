import CodeView from '../CodeView.svelte';

describe('CodeView component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new CodeView({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
