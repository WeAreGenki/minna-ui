/** @jest-environment node */

import { readFileSync } from 'fs';
import { OutputAsset, rollup } from 'rollup';
import { emitCss } from '../index';

const plainCssCode = readFileSync(
  require.resolve('@minna-ui/jest-config/fixtures/plain.css'),
  'utf-8',
);

describe('Rollup emit CSS plugin', () => {
  it('runs without unexpected warnings or errors', async () => {
    expect.assertions(3);

    const spy1 = jest.spyOn(console, 'error');
    const spy2 = jest.spyOn(console, 'warn');

    const bundle = await rollup({
      input: require.resolve('@minna-ui/jest-config/fixtures/import-plain-css.mjs'),
      plugins: [emitCss()],
    });
    await bundle.generate({
      format: 'esm',
      name: 'emit-css-test',
    });

    expect(spy1).not.toHaveBeenCalled();
    // We expect one warning about an empty chunk (entry file is empty other than css import)
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledWith(expect.stringContaining('empty chunk'));

    spy1.mockRestore();
    spy2.mockRestore();
  });

  it('generates a CSS asset', async () => {
    expect.assertions(2);

    const bundle = await rollup({
      input: require.resolve('@minna-ui/jest-config/fixtures/import-plain-css.mjs'),
      plugins: [emitCss()],
    });
    const result = await bundle.generate({
      format: 'esm',
      name: 'emit-css-test',
    });

    const assets = result.output.filter((chunk) => chunk.type === 'asset');
    expect(assets).toHaveLength(1);
    expect(assets[0].fileName).toStrictEqual(expect.stringMatching(/.+\.css$/));
  });

  it('does not modify the CSS contents', async () => {
    expect.assertions(1);

    const bundle = await rollup({
      input: require.resolve('@minna-ui/jest-config/fixtures/import-plain-css.mjs'),
      plugins: [emitCss()],
    });
    const result = await bundle.generate({
      format: 'esm',
      name: 'emit-css-test',
    });

    const asset = result.output.filter((chunk) => chunk.type === 'asset')[0] as OutputAsset;
    expect(asset.source).toMatchInlineSnapshot(`\n"${plainCssCode}"\n`);
  });
});
