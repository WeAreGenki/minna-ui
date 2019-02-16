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
  export let isOpen = false;
  export let textOpen = 'Expand ▾';
  export let textClose = 'Collapse ▴';

  function handleClick() {
    isOpen = !isOpen;
  }
</script>

<button class="button button-collapse" on:click="{handleClick}">
  {isOpen ? textClose : textOpen}
</button>

<div class="collapse {isOpen ? '' : 'collapse-hide'}">
  <slot></slot>
</div>

<style>
  /* stylelint-disable a11y/no-display-none */
  .collapse-hide {
    display: none;
  }
</style>
