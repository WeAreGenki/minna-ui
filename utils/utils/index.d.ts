/** Generic error handler for nodejs callbacks. */
export declare function handleErr(err?: Error): void;

/**
 * Get the most recent git reference.
 *
 * @see https://git-scm.com/docs/git-describe
 *
 * @param {string} [args] - Additional arguments to pass to `git describe`.
 * @returns {string} A human readable git reference.
 */
export declare function gitDescribe(): string;
