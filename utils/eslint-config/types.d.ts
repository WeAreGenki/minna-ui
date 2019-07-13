/**
 * ESLint types.
 *
 * @file The `@types/eslint` package is missing types so we need to manually
 * add them here.
 *
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/eslint/index.d.ts
 */

import { Linter } from 'eslint';
import { SyncOpts } from 'resolve';

interface Override extends Linter.Config {
  files: string[] | string;
  excludedFiles: string[] | string;
}

export type ESLintConfig = Linter.Config & {
  extends?: string[];
  plugins?: string[];
  overrides?: Override[];
};

/** Svelte style or script tag block. */
export interface BlockAttributes {
  type: string;
}

interface ImportAlias {
  [regex: string]: string;
}

export interface ResolverOptions extends SyncOpts {
  alias: ImportAlias;
}

export interface ResolverResult {
  found: boolean;
  path?: string | null;
}
