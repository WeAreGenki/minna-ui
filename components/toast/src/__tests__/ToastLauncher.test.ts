import ToastLauncher from '../ToastLauncher.svelte';

describe('ToastLauncher component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new ToastLauncher({ target });
    expect(target.innerHTML).toMatchSnapshot();
  });
});
