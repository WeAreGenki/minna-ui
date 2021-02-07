import { PreprocessorGroup } from 'svelte/types/compiler/preprocess/types';
import { markup } from './markup';
import { style } from './style';
import { html } from './utils';

/** Minna UI Svelte preprocessor preset. */
const preprocess: PreprocessorGroup = {
  style: style(),
};

if (process.env.NODE_ENV === 'production') {
  preprocess.markup = markup();
}

export { html, markup, preprocess, style };
