'use strict';

const CodeView = require('../src/CodeView.html');

describe('CodeView component', () => {
  it('renders correctly with defaults', () => {
    const target = document.createElement('div');
    new CodeView({ target }); // tslint:disable-line no-unused-expression
    expect(target.innerHTML).toMatchSnapshot();
  });
});
