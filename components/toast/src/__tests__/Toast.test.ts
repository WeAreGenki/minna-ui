import Toast from '../Toast.svelte';

describe('Toast component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new Toast({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
