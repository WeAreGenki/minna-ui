<!--
  COLLAPSE COMPONENT

  TODO: Write basic info.

  USAGE:
    Example:

      <MinnaCollapse>
        <p>Your content.</p>
      </MinnaCollapse>

  @format
-->

<script>
  export let textOpen = 'Expand ▾';
  export let textClose = 'Collapse ▴';
  export let isOpen;

  function handleClick() {
    isOpen = !isOpen;
  }
</script>

<style>
  /* stylelint-disable a11y/no-display-none */
  .collapse-hide {
    display: none;
  }
</style>

<svelte:options tag="minna-collapse" />

<button class="button button-collapse" on:click="{handleClick}">
  {isOpen ? textClose : textOpen}
</button>

<div class="collapse {isOpen ? '' : 'collapse-hide'}">
  <slot></slot>
</div>
