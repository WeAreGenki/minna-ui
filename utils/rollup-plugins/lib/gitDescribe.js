'use strict';

/* eslint-disable-next-line security/detect-child-process */
const { execSync } = require('child_process');

/**
 * Get the most recent git reference.
 * @see https://git-scm.com/docs/git-describe
 * @returns {string} A human readable git reference.
 */
/* eslint-disable-next-line consistent-return */
function gitDescribe() {
  let reference = '';

  try {
    reference = execSync('git describe --always --dirty="-dev"')
      .toString()
      .trim();
  } catch (error) {
    /* eslint-disable-next-line no-console */
    console.log(error);
  }

  return reference;
}

module.exports = gitDescribe;
