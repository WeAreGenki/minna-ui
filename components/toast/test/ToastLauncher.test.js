'use strict';

const ToastLauncher = require('../src/ToastLauncher.html');

describe('ToastLauncher component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new ToastLauncher({ target }); // tslint:disable-line no-unused-expression
    expect(target.innerHTML).toMatchSnapshot();
  });
});
