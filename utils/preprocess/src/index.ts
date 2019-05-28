// FIXME: Replace once svelte is fixed
// import { PreprocessorGroup } from 'svelte/types/preprocess';
import { PreprocessorGroup } from './types';
import { markup } from './markup';
import { style } from './style';

export const preprocess: PreprocessorGroup = {
  markup: markup({
    enabled: process.env.NODE_ENV === 'production',
  }),
  style: style(),
};

export * from './markup';
export * from './style';
export * from './utils';
