// FIXME: Remove this file after svelte is fixed

/* eslint-disable @typescript-eslint/indent */

import { SourceMap } from 'magic-string'; // eslint-disable-line

export interface PreprocessResults {
  code: string;
  map?: SourceMap | string;
  dependencies?: string[];
}

export type Preprocessor = (options: {
  content: string;
  attributes: Record<string, string | boolean>;
  filename?: string;
}) => PreprocessResults | undefined | Promise<PreprocessResults | undefined>;

export type MarkupPreprocessor = (options: {
  content: string;
  filename?: string;
}) => PreprocessResults | undefined | Promise<PreprocessResults | undefined>;

export interface PreprocessorGroup {
  markup?: MarkupPreprocessor;
  style?: Preprocessor;
  script?: Preprocessor;
}
