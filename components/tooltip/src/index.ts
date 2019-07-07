import { listen } from 'svelte/internal';

// TODO: Remove this type once svelte ships with official types
// TODO: Move this to a central place
type SvelteAction = (
  node: HTMLElement,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  parameters?: any,
) => {
  destroy?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update?: (parameters: any) => void;
};

/**
 * Tooltip Svelte action.
 */
export const tooltip: SvelteAction = (node: HTMLElement, text: string) => {
  const el = document.createElement('div');
  el.className = 'tooltip';
  el.textContent = text;

  function position(): void {
    const { top, right, bottom } = node.getBoundingClientRect();
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    el.style.top = `${(top + bottom) / 2}px`;
    el.style.left = `${right}px`;
  }

  function append(): void {
    document.body.appendChild(el);
    el.style.opacity = '0';
    setTimeout(() => (el.style.opacity = '1'));
    position();
  }

  function remove(): void {
    el.remove();
  }

  const cancelMouseenter = listen(node, 'mouseenter', append);
  const cancelMouseleave = listen(node, 'mouseleave', remove);

  return {
    destroy() {
      remove();
      cancelMouseenter();
      cancelMouseleave();
    },

    update(newText: string) {
      el.textContent = newText;
    },
  };
};
