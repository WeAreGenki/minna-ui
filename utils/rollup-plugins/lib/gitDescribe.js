'use strict';

const { execSync } = require('child_process');

/**
 * Get the most recent git reference.
 * @see https://git-scm.com/docs/git-describe
 * @returns {(string|void)} A human readable git reference.
 */
/* eslint-disable-next-line consistent-return */
function gitDescribe() {
  try {
    const reference = execSync(
      'git describe --always --dirty="-dev"',
    ).toString();
    return reference;
  } catch (error) {
    console.log(error);
  }
}

module.exports = gitDescribe;
