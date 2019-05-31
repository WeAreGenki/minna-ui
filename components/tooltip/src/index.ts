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
export const Tooltip: SvelteAction = (node: HTMLElement, text: string) => {
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.textContent = text;

  function position(): void {
    const { top, right, bottom } = node.getBoundingClientRect();
    tooltip.style.top = `${(top + bottom) / 2}px`;
    tooltip.style.left = `${right}px`;
  }

  function append(): void {
    document.body.appendChild(tooltip);
    tooltip.style.opacity = '0';
    setTimeout(() => (tooltip.style.opacity = '1'));
    position();
  }

  function remove(): void {
    tooltip.remove();
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
      tooltip.textContent = newText;
    },
  };
};
