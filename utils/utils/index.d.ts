/** Generic error handler for nodejs callbacks. */
export declare function handleErr(err?: Error): void;

/**
 * Get the most recent git reference.
 *
 * @see https://git-scm.com/docs/git-describe
 *
 * @param [args] - Additional arguments to pass to `git describe`.
 * @returns A human readable git reference.
 */
export declare function gitDescribe(args: string): string;
