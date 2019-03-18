/**
 * Generic error handler for nodejs callbacks.
 * @param err Error from node method callback.
 */
export function catchErr(err?: Error): void {
  if (err) throw err;
}
