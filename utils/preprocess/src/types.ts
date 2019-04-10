// based on https://github.com/sveltejs/svelte/blob/master/src/preprocess/index.ts

/* eslint-disable @typescript-eslint/indent */ // broken upstream https://github.com/typescript-eslint/typescript-eslint/issues/121

interface PreprocessorReturn {
  code: string;
  dependencies?: string[];
  map?: string | { toString: () => string };
}

/**
 * @returns Returning `undefined` will cause the preprocessor not to run and
 * the original code to be used as is.
 */
export type Preprocessor = (options: {
  attributes: Record<string, string | boolean>;
  content: string;
  filename?: string;
}) => Promise<PreprocessorReturn | undefined> | PreprocessorReturn | undefined;

export type MarkupPreprocessor = (options: {
  content: string;
  filename?: string;
}) => PreprocessorReturn | undefined;

export interface PreprocessorGroup {
  markup?: MarkupPreprocessor;
  script?: Preprocessor;
  style?: Preprocessor;
}
