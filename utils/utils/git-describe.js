'use strict';

// eslint-disable-next-line security/detect-child-process
const { execSync } = require('child_process');

/**
 * Get the most recent git reference.
 *
 * @see https://git-scm.com/docs/git-describe
 *
 * @param {string} [args] - Additional arguments to pass to `git describe`.
 * @returns {string} A human readable git reference.
 */
function gitDescribe(args = '--dirty="-dev"') {
  let reference = '';

  try {
    reference = execSync(`git describe --always ${args}`)
      .toString()
      .trim();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }

  return reference;
}

exports.gitDescribe = gitDescribe;
