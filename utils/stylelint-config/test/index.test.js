/** @jest-environment node */

'use strict';

const stylelint = require('stylelint');
const config = require('../index.js');

const sourceCssValid = `
body {
  margin: 0;
  font-family: "Roboto Mono Regular", sans-serif;
  color: hsl(249, 33%, 19%);
  background-color: hsl(0, 0%, 98%);
}
`;

const sourceCssInvalid = `
body {
  /* comment */
  font-family: "Roboto Mono Regular", sans-serif;
  color: rgb(38, 33, 65);
  background-color: hsl(0, 0%, 98%);
  margin: 0rem;
}


#target {
  padding: 1rem;
}

.empty {}`;

const sourceSyntaxInvalid = `
body {
  // inline comment
  font-family: Roboto Mono Regular, sans-serif;
  color:
  background-colours: hsl(0, 0%, 98%);
  margin: 5pigs;
}`;

const sourceOrderInvalid = `
body {
  margin: 0;
  padding: 1rem;
  display: block;
}
`;

const stylelintOpts = {
  config,
  code: sourceCssValid,
};

describe('Stylelint config', () => {
  it('lints valid CSS', async () => {
    const output = await stylelint.lint(stylelintOpts);
    expect(output.results[0].errored).toBeFalsy();
    expect(output.results[0].warnings).toHaveLength(0);
  });

  it('detects invalid CSS by lint rules', async () => {
    const output = await stylelint.lint({
      config,
      code: sourceCssInvalid,
    });
    expect(output.results[0].errored).toBeTruthy();
    expect(output.results[0].warnings).not.toHaveLength(0);
  });

  it('detects invalid CSS by bad syntax', async () => {
    const output = await stylelint.lint({
      config,
      code: sourceSyntaxInvalid,
    });
    expect(output.results[0].errored).toBeTruthy();
    expect(output.results[0].warnings[0].rule).toEqual('CssSyntaxError');
  });

  it('detects invalid CSS property order', async () => {
    const output = await stylelint.lint({
      config,
      code: sourceOrderInvalid,
    });
    expect(output.results[0].errored).toBeTruthy();
    expect(output.results[0].warnings[0].rule).toEqual('order/properties-order');
    expect(output.results[0].warnings[1].rule).toEqual('order/properties-order');
  });

  it('has no config parse errors', async () => {
    const output = await stylelint.lint(stylelintOpts);
    expect(output.results[0].parseErrors).toHaveLength(0);
  });

  it('has no config deprecations', async () => {
    const output = await stylelint.lint(stylelintOpts);
    expect(output.results[0].deprecations).toHaveLength(0);
  });

  it('has no invalid config options', async () => {
    const output = await stylelint.lint(stylelintOpts);
    expect(output.results[0].invalidOptionWarnings).toHaveLength(0);
  });
});
