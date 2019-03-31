import { markup } from './markup';
import { style } from './style';
import { PreprocessorGroup } from './types';

export const preprocess: PreprocessorGroup = {
  markup: markup({
    enabled: process.env.NODE_ENV === 'production',
  }),
  style: style(),
};

export * from './markup';
export * from './style';
export * from './utils';
