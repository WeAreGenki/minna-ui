// eslint-disable-next-line security/detect-child-process
import { execSync } from 'child_process';

/**
 * Get the most recent git reference.
 *
 * @see https://git-scm.com/docs/git-describe
 *
 * @returns A human readable git reference.
 */
export function gitDescribe(): string {
  let reference = '';

  try {
    reference = execSync('git describe --always --dirty="-dev"')
      .toString()
      .trim();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(error);
  }

  return reference;
}
