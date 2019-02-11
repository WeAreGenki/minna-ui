'use strict';

const Toast = require('../src/Toast.html');

describe('Toast component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new Toast({ target }); // tslint:disable-line no-unused-expression
    expect(target.innerHTML).toMatchSnapshot();
  });
});
