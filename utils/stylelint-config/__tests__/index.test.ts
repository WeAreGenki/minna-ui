/** @jest-environment node */

import stylelint from 'stylelint';
import config from '../index';

const sourceCssValid = `body {
  margin: 0;
  color: rgb(37, 32, 64);
  font-family: 'Roboto Mono Regular', sans-serif;
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
    expect(result.errored).toBe(false);
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
    expect(result.errored).toBe(true);
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
    expect(result.errored).toBe(true);
    expect(result.results[0].warnings[0].rule).toBe('CssSyntaxError');
  });

  it('detects invalid CSS property order', async () => {
    expect.assertions(2);
    const result = await stylelint.lint({
      code: sourceOrderInvalid,
      config,
    });
    expect(result.errored).toBe(true);
    expect(result.results[0].warnings[0].rule).toBe('order/properties-order');
  });

  it('has no config parse errors', async () => {
    expect.assertions(2);
    const result = await stylelint.lint(stylelintOpts);
    // @ts-expect-error - FIXME: Submit PR to update @types/stylelint
    expect(result.results[0].parseErrors).toBeDefined();
    // @ts-expect-error - FIXME: Submit PR to update @types/stylelint
    expect(result.results[0].parseErrors).toHaveLength(0);
  });

  it('has no config deprecations', async () => {
    expect.assertions(1);
    const result = await stylelint.lint(stylelintOpts);
    expect(result.results[0].deprecations).toHaveLength(0);
  });

  it('has no invalid config options', async () => {
    expect.assertions(1);
    const result = await stylelint.lint(stylelintOpts);
    expect(result.results[0].invalidOptionWarnings).toHaveLength(0);
  });
});
