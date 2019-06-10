import { markup } from './markup';
import { style } from './style';
import { html } from './utils';

/** Minna UI Svelte preprocessor preset. */
export const preprocess = {
  markup: markup({
    enabled: process.env.NODE_ENV === 'production',
  }),
  style: style(),
};

export { html, markup, style };
