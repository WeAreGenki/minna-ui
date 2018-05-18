/*
  FLUID FONT SIZE

  Generates a responsive set of font sizes which automatically adapt to the
  screen viewport width.

  USAGE:
    html {
      @mixin fluid-font-size
        <min-font-size>,
        <max-font-size>,
        <from-screen-width>,
        <until-screen-width>,
        [use-px];
    }

    <min-font-size>      = font size below from-screen-width
    <max-font-size>      = font size above until-screen-width
    <from-screen-width>  = start growing font size from this width
    <until-screen-width> = stop growing font size at this width
    [use-px]             = if true, output px value not default rem (optional)

  NOTE:
    When using this together with `@minna-ui/postcss-config` or `postcss-calc`
    with warnings enabled, it's normal and completely OK to get a warning like:
      "Could not reduce expression: ..."

  REFERENCE:
    - https://www.smashingmagazine.com/2016/05/fluid-typography/

*/

'use strict';

/**
 * Get the size unit from a CSS value.
 * @param {string} value A CSS value to check.
 * @returns {string|null} The size unit or null if unknown.
 */
function getUnit(value) {
  const match = value.match(/px|rem|em$/);

  return match ? match.toString() : null;
}

/**
 * Convert a CSS size value into rem or px.
 * @param {string} size A CSS size value to convert.
 * @param {Boolean} [outputPx] Pass true to output px instead of default rem.
 * @returns {string} The converted CSS size value.
 */
function convertSize(size, outputPx = false) {
  const baseSize = 16; // 16px is the normal browser default font size
  const unit = getUnit(size);

  if (unit === null) throw new Error('Only px, rem, and em units are supported');

  if (outputPx && (unit === 'rem' || unit === 'em')) {
    // convert rem or em into px
    return `${parseFloat(size) * baseSize}px`;
  } else if (!outputPx && unit === 'px') {
    // convert px into rem
    return `${parseFloat(size) / baseSize}rem`;
  } else if (!outputPx && unit === 'em') {
    // change unit from em to rem
    return `${parseFloat(size)}rem`;
  }
  // doesn't need converting so return as is
  return size;
}

/**
 * PostCSS mixin to generate a set of fluid font sizes.
 * @param {any} mixin
 * @param {string} minFontSize
 * @param {string} maxFontSize
 * @param {string} fromScreenWidth
 * @param {string} untilScreenWidth
 * @param {Boolean} [usePxUnit]
 * @returns {object}
 */
module.exports = (
  mixin,
  minFontSize,
  maxFontSize,
  fromScreenWidth,
  untilScreenWidth,
  usePxUnit = false,
) => {
  const minFont = convertSize(minFontSize, usePxUnit);
  const maxFont = convertSize(maxFontSize, usePxUnit);
  const minMedia = convertSize(fromScreenWidth, usePxUnit);
  const maxMedia = convertSize(untilScreenWidth, usePxUnit);
  const fontRange = parseFloat(maxFont) - parseFloat(minFont);
  const mediaRange = parseFloat(maxMedia) - parseFloat(minMedia);
  const sizeCalc = `calc(${minFont} + ${fontRange} * (100vw - ${minMedia}) / ${mediaRange});`;

  return {
    '&': {
      // only set a base font size if different from browser default
      ...(convertSize(minFont) === '1rem' ? {} : {
        'font-size': minFont,
      }),

      [`@media screen and (min-width: ${fromScreenWidth}) and (max-width: ${untilScreenWidth})`]: {
        'font-size': sizeCalc,
      },

      [`@media screen and (min-width: ${untilScreenWidth})`]: {
        'font-size': maxFont,
      },
    },
  };
};
