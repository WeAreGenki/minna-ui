/*
  CSS TRIANGLE MAKER

  Generates a triangle using the border technique. By default it will output
  styles for use inline inside a rule targeting an existing element.

  Alternatively it can output styles for a pseudo element for easy use without
  interfering with the document flow.

  USAGE:
    @mixin draw-triangle <side>, <size>, <colour>, [isPseudo];

    <side>     = one of: top, right, bottom, left
    <size>     = any CSS size with unit, e.g. 0.5rem or 8px
    <colour>   = any CSS colour, e.g. red, #f00, rgba(255, 0, 0, 0.5)
    [isPseudo] = if true will output as a pseudo element (optional)

*/

'use strict';

/**
 * PostCSS mixin to draw a triangle.
 * @param {any} mixin
 * @param {string} side
 * @param {string} size
 * @param {string} colour
 * @param {Boolean} [isPseudo]
 * @returns {object}
 */
module.exports = (mixin, side, size, colour, isPseudo) => {
  if (
    side !== 'top' &&
    side !== 'right' &&
    side !== 'bottom' &&
    side !== 'left'
  ) {
    throw new Error(`Side is "${side}" but expected one of: top, right, bottom, left`);
  }

  const offset = side === 'left' || side === 'right'
    ? 'top'
    : 'left';

  const position = {
    top: {
      'border-right': `${size} solid transparent`,
      'border-bottom': `${size} solid ${colour}`,
      'border-left': `${size} solid transparent`,
    },
    right: {
      'border-top': `${size} solid transparent`,
      'border-bottom': `${size} solid transparent`,
      'border-left': `${size} solid ${colour}`,
    },
    bottom: {
      'border-top': `${size} solid ${colour}`,
      'border-right': `${size} solid transparent`,
      'border-left': `${size} solid transparent`,
    },
    left: {
      'border-top': `${size} solid transparent`,
      'border-right': `${size} solid ${colour}`,
      'border-bottom': `${size} solid transparent`,
    },
  };

  const pseudoElement = {
    '&::before': {
      position: 'absolute',
      content: '""',
      display: 'block',
      [offset]: `calc(50% - ${size})`,
      [side]: `calc(-1 * ${size})`,
      width: 0,
      height: 0,
      ...position[side],
    },
  };

  const inline = {
    width: 0,
    height: 0,
    ...position[side],
  };

  return isPseudo ? pseudoElement : inline;
};
