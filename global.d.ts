/* eslint-disable @typescript-eslint/no-explicit-any */

type ComponentProps = Record<string, any>;

/** @see https://svelte.dev/docs#Client-side_component_API */
interface ComponentOptions {
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
  props?: ComponentProps;
  /** A `HTMLElement` to render to. */
  target: HTMLElement;
}

declare module '*.svelte' {
  import { SvelteComponent } from 'svelte/types/runtime/internal';

  class Component extends SvelteComponent {
    public constructor(options?: ComponentOptions);

    // @ts-ignore - FIXME: Submit update upstream
    public $set(props: ComponentProps): void;
  }

  export = Component;
}
