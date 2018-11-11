'use strict';

/**
 * Generic error handler for nodejs callbacks.
 * @param {Error} err
 */
function catchErr(err) {
  if (err) throw err;
}

module.exports = catchErr;
