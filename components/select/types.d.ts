/* eslint-disable @typescript-eslint/no-explicit-any */

import { SvelteComponent } from 'svelte/types/runtime/internal';

/** @see https://svelte.dev/docs#Client-side_component_API */
interface SvelteComponentOptions {
  /**
   * A child of `target` to render the component immediately before. Cannot be
   * used with `hydrate: true`.
   */
  anchor?: HTMLElement;
  /**
   * Instructs Svelte to upgrade existing DOM (usually from server-side
   * rendering) rather than creating new elements. It will only work if the
   * component was compiled with the [`hydratable: true` option](https://svelte.dev/docs#svelte_compile).
   */
  hydrate?: boolean;
  /**
   * If `true`, will play transitions on initial render, rather than waiting
   * for subsequent state changes.
   */
  intro?: boolean;
  /** An object of properties to supply to the component. */
  props?: Record<string, any>;
  /** A `HTMLElement` to render to. */
  target: HTMLElement;
}

export default class Select extends SvelteComponent {
  public constructor(options: SvelteComponentOptions);
}
