/**
 * ESLint types
 *
 * @fileoverview The `@types/eslint` package is missing types so we need to
 * manually add them here.
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/eslint/index.d.ts
 */

import { Linter } from 'eslint';

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
