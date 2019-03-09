'use strict';

/**
 * Generic error handler for nodejs callbacks.
 * @param {Error} err Node error from callback.
 */
function catchErr(err) {
  if (err) throw err;
}

module.exports = catchErr;
