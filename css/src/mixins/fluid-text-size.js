/*
  FLUID TEXT SIZE

  Generates a responsive set of text sizes which automatically adapt to the
  screen viewport width.

  USAGE:
    html {
      @mixin fluid-text-size
        <min-text-size>,
        <max-text-size>,
        <from-screen-width>,
        <until-screen-width>,
        [use-px];
    }

    <min-text-size>      = text size below from-screen-width
    <max-text-size>      = text size above until-screen-width
    <from-screen-width>  = start growing text size from this width
    <until-screen-width> = stop growing text size at this width
    [use-px]             = if true output px value instead of em (optional)

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
 * Convert a CSS size value into em or px.
 * @param {string} size A CSS size value to convert.
 * @param {Boolean} [outputPx] Pass true to output px instead of em.
 * @returns {string} The converted CSS size value.
 */
function convertSize(size, outputPx = false) {
  const baseSize = 16; // 16px is the normal browser default text size
  const unit = getUnit(size);

  if (!unit) throw new Error('Only px, rem, and em units are supported');

  if (outputPx && (unit === 'rem' || unit === 'em')) {
    // convert rem or em into px
    return `${parseFloat(size) * baseSize}px`;
  }

  if (!outputPx && unit === 'px') {
    // convert px into em
    return `${parseFloat(size) / baseSize}em`;
  }

  if (!outputPx && unit === 'rem') {
    // change unit from rem to em
    return `${parseFloat(size)}em`;
  }

  // doesn't need converting so return as is
  return size;
}

/**
 * PostCSS mixin to generate a set of fluid text sizes.
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
  const minSize = convertSize(minFontSize, usePxUnit);
  const maxSize = convertSize(maxFontSize, usePxUnit);
  const minMedia = convertSize(fromScreenWidth, usePxUnit);
  const maxMedia = convertSize(untilScreenWidth, usePxUnit);
  const sizeRange = parseFloat(maxSize) - parseFloat(minSize);
  const mediaRange = parseFloat(maxMedia) - parseFloat(minMedia);
  const sizeCalc = `calc(${minSize} + ${sizeRange} * (100vw - ${minMedia}) / ${mediaRange});`;

  return {
    '&': {
      // only set a base text size if different from browser default
      ...(convertSize(minSize) === '1em' ? {} : {
        'font-size': minSize,
      }),

      [`@media screen and (min-width: ${fromScreenWidth}) and (max-width: ${untilScreenWidth})`]: {
        'font-size': sizeCalc,
      },

      [`@media screen and (min-width: ${untilScreenWidth})`]: {
        'font-size': maxSize,
      },
    },
  };
};
