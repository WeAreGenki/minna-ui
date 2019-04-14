/**
 * TODO: Remove this file once Svelte components can be generated with
 * TypeScript natively.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = Record<string, any>;

/** @see https://v3.svelte.technology/docs#client-side-component-api */
interface ComponentOptions {
  accessors?: boolean;
  anchor?: HTMLElement;
  hydrate?: boolean;
  intro?: boolean;
  props?: Props;
  target: HTMLElement;
}

interface Component {
  $$: any;
  $destroy(): void;
  $on(event: Event, callback: () => void): void;
  $set(props: Props): void;
}

export default function Tabs(opts: ComponentOptions): Component;
