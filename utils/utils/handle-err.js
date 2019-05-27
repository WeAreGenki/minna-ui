'use strict';

/**
 * Generic error handler for nodejs callbacks.
 *
 * @param {Error} [err] - Error from node method callback.
 */
function handleErr(err) {
  if (err) throw err;
}

exports.handleErr = handleErr;
