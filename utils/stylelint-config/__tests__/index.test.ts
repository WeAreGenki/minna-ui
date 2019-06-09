/** @jest-environment node */

import stylelint from 'stylelint';
import config from '../index';

const sourceCssValid = `body {
  margin: 0;
  font-family: 'Roboto Mono Regular', sans-serif;
  color: rgb(37, 32, 64);
  background-color: rgb(250, 250, 250);
}
`;
const sourceCssInvalid = `
body {
  /* comment */
  font-family: 'Roboto Mono Regular', sans-serif;
  color: rgb(38, 33, 65);
  background-color: rgb(250, 250, 250);
  margin: 0rem;
}


#target {
  padding: 1rem;
}

.empty {}`;
const sourceSyntaxInvalid = `body {
  // inline comment
  font-family: Roboto Mono Regular, sans-serif;
  color:
  background-colors: rgb(250, 250, 250);
  margin: 5pigs;
}`;
const sourceOrderInvalid = `body {
  margin: 0;
  padding: 1rem;
  display: block;
}
`;
const stylelintOpts = {
  code: sourceCssValid,
  config,
};

describe('Stylelint config', () => {
  it('lints valid CSS', async () => {
    expect.assertions(3);
    const output = stylelint.lint(stylelintOpts);
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.results[0].errored).toBeFalsy();
    expect(result.results[0].warnings).toHaveLength(0);
  });

  it('detects invalid CSS by lint rules', async () => {
    expect.assertions(3);
    const output = stylelint.lint({
      code: sourceCssInvalid,
      config,
    });
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.results[0].errored).toBeTruthy();
    expect(result.results[0].warnings).not.toHaveLength(0);
  });

  it('detects invalid CSS by bad syntax', async () => {
    expect.assertions(3);
    const output = stylelint.lint({
      code: sourceSyntaxInvalid,
      config,
    });
    await expect(output).resolves.toBeDefined();
    const result = await output;
    expect(result.results[0].errored).toBeTruthy();
    // @ts-ignore - FIXME: Submit PR to update @types/stylelint
    expect(result.results[0].warnings[0].rule).toEqual('CssSyntaxError');
  });

  it('detects invalid CSS property order', async () => {
    expect.assertions(3);
    const result = await stylelint.lint({
      code: sourceOrderInvalid,
      config,
    });
    expect(result.results[0].errored).toBeTruthy();
    // @ts-ignore - FIXME: Submit PR to update @types/stylelint
    expect(result.results[0].warnings[0].rule).toEqual('order/properties-order');
    // @ts-ignore - FIXME: Submit PR to update @types/stylelint
    expect(result.results[0].warnings[1].rule).toEqual('order/properties-order');
  });

  it('has no config parse errors', async () => {
    const result = await stylelint.lint(stylelintOpts);
    // @ts-ignore - FIXME: Submit PR to update @types/stylelint
    expect(result.results[0].parseErrors).toHaveLength(0);
  });

  it('has no config deprecations', async () => {
    const result = await stylelint.lint(stylelintOpts);
    expect(result.results[0].deprecations).toHaveLength(0);
  });

  it('has no invalid config options', async () => {
    const result = await stylelint.lint(stylelintOpts);
    expect(result.results[0].invalidOptionWarnings).toHaveLength(0);
  });
});
