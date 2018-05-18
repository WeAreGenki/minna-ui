/** @jest-environment node */

'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const postcss = require('postcss');
const postcssConfig = require('../index.js');

const readFile = promisify(fs.readFile);
const jestConfigPath = require.resolve('@minna-ui/jest-config');
const fixturesPath = path.join(path.dirname(jestConfigPath), 'fixtures');
const sourceCssPath = path.join(fixturesPath, 'import.css');
const sourceCssMixinPath = path.join(fixturesPath, 'mixin.css');
const mixinsPath = path.join(fixturesPath, 'css-mixins');

const options = {
  from: sourceCssPath,
  map: {
    inline: false,
    annotation: path.basename(sourceCssPath),
  },
};

let sourceCss = '';
let sourceCssMixin = '';

beforeAll(async () => {
  [sourceCss, sourceCssMixin] = await Promise.all([
    readFile(sourceCssPath, 'utf8'),
    readFile(sourceCssMixinPath, 'utf8'),
  ]);
});

describe('PostCSS config', () => {
  it('compiles valid CSS', async () => {
    const result = await postcss(postcssConfig())
      .process(sourceCss, options);
    expect(result.processor.plugins).not.toHaveLength(0);
    expect(result.opts.from).toBeDefined();
    expect(result.map).toBeDefined();
    expect(result.css).toMatchSnapshot();
  });

  it('compiles CSS with custom mixin', async () => {
    const result = await postcss(postcssConfig({ mixinsPath }))
      .process(sourceCssMixin, { from: sourceCssMixinPath });
    expect(result.css).toMatch('.target::after');
    expect(result.css).toMatchSnapshot();
  });
});
