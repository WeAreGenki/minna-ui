/** @jest-environment node */

// FIXME: Remove next line if we enable these tests again
/* eslint-disable max-len */

// FIXME: Create tests for CSS, mixins, etc.
// TODO: Create new dir + files for mixin tests
// TODO: Create new test files for each CSS file

describe('CSS mixins', () => {
  it('placeholder', () => {});
});

// const postcss = require('postcss');
// const postcssMixins = require('postcss-mixins');
// const drawTriangle = require('../src/mixins/draw-triangle.js');
// const fluidTextSize = require('../src/mixins/fluid-text-size.js');
// const makeFontFace = require('../src/mixins/make-font-face.js');

// /**
//  * Compile a CSS mixin;
//  * @param {Function} mixinFn
//  * @param {string} opts
//  * @returns {object}
//  */
// function compileMixin(mixinFn, opts) {
//   const plugin = [postcssMixins({ mixins: { mixinFn } })];
//   const css = `
//     div {
//       @mixin mixinFn ${opts};
//     }
//   `;
//   return postcss(plugin).process(css, { from: undefined });
// }

// describe('Global CSS', () => {
//   it.skip('should do something', () => {
//     expect.hasAssertions();
//     // TODO
//   });
// });

// describe('Draw triangle mixin', () => {
//   it('outputs top triangle', async () => {
//     const output = drawTriangle(null, 'top', '1rem', '#000');
//     expect(output).toHaveProperty('border-bottom');
//     expect(output).toMatchSnapshot();

//     const result = await compileMixin(drawTriangle, 'top, 1rem, #000');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('outputs right triangle', async () => {
//     const output = drawTriangle(null, 'right', '1rem', '#000');
//     expect(output).toHaveProperty('border-left');
//     expect(output).toMatchSnapshot();

//     const result = await compileMixin(drawTriangle, 'right, 1rem, #000');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('outputs bottom triangle', async () => {
//     const output = drawTriangle(null, 'bottom', '1rem', '#000');
//     expect(output).toHaveProperty('border-top');
//     expect(output).toMatchSnapshot();

//     const result = await compileMixin(drawTriangle, 'bottom, 1rem, #000');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('outputs left triangle', async () => {
//     const output = drawTriangle(null, 'left', '1rem', '#000');
//     expect(output).toHaveProperty('border-right');
//     expect(output).toMatchSnapshot();

//     const result = await compileMixin(drawTriangle, 'left, 1rem, #000');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('outputs triangle in pseudo element', async () => {
//     const output = drawTriangle(null, 'top', '1rem', '#000', true);
//     expect(output).toHaveProperty('&::before.border-bottom');
//     expect(output).toMatchSnapshot();

//     const result = await compileMixin(drawTriangle, 'top, 1rem, #000, true');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('throws error when invalid direction', () => {
//     expect(() => {
//       drawTriangle(null, 'under', '1rem', '#000');
//     }).toThrow();
//   });
// });

// describe('Fluid font size mixin', () => {
//   it('generates CSS rules', async () => {
//     const output = fluidTextSize(null, '16px', '32px', '30em', '100em');
//     expect(output).not.toHaveProperty('&.font-size');
//     expect(output).toMatchSnapshot();

//     const result = await compileMixin(fluidTextSize, '16px, 32px, 30em, 100em');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('generates CSS rules in px', async () => {
//     const output = fluidTextSize(null, '1rem', '2rem', '30em', '100em', true);
//     expect(output).not.toHaveProperty('&.font-size');
//     expect(output).toMatchSnapshot();

//     const result = await compileMixin(fluidTextSize, '1rem, 2rem, 30em, 100em, true');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('includes base font-size when minFontSize isn\'t browser default', async () => {
//     const output = fluidTextSize(null, '1.5rem', '2rem', '30em', '100em');
//     expect(output).toHaveProperty('&.font-size');

//     const result = await compileMixin(fluidTextSize, '1.5rem, 2rem, 30em, 100em');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('includes base font-size when minFontSize isn\'t browser default in px', async () => {
//     const output = fluidTextSize(null, '20px', '2rem', '30em', '100em');
//     expect(output).toHaveProperty('&.font-size');

//     const result = await compileMixin(fluidTextSize, '20px, 2rem, 30em, 100em');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('throws error when invalid size unit', () => {
//     expect(() => {
//       fluidTextSize(null, '16', '32pops', '30em', '100em');
//     }).toThrow('Only px, rem, and em units are supported');
//   });
// });

// describe('Make font face mixin', () => {
//   it('generates CSS rules', async () => {
//     const output = makeFontFace(null, 'Target', 'Target-Regular');
//     expect(output).toMatchSnapshot();

//     const result = await compileMixin(makeFontFace, 'Target, Target-Regular');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });

//   it('generates CSS rules with custom options', async () => {
//     const output = makeFontFace(null, 'Target', 'Target-Bold', 'normal', 'bold', '/static/fonts');
//     expect(output).toMatchSnapshot();

//     const result = await compileMixin(makeFontFace, 'Target, Target-Bold, normal, bold, /static/fonts');
//     expect(result.warnings).toHaveLength(0);
//     expect(result.css).toMatchSnapshot();
//   });
// });
