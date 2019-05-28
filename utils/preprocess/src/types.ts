// FIXME: Remove this file after svelte is fixed

/* eslint-disable @typescript-eslint/indent */

import { SourceMap } from 'magic-string'; // eslint-disable-line

export type Preprocessor = (options: {
  content: string;
  attributes: Record<string, string | boolean>;
  filename?: string;
}) =>
  | { code: string; map?: SourceMap | string; dependencies?: string[] }
  | undefined;

export interface PreprocessorGroup {
  markup?: (options: {
    content: string;
    filename: string;
  }) =>
    | { code: string; map?: SourceMap | string; dependencies?: string[] }
    | undefined;
  style?: Preprocessor;
  script?: Preprocessor;
}
