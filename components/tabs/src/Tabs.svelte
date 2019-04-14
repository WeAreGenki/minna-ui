<!--
  TABS

  @experimental Work in progress. Does not work. DO NOT USE IN PRODUCTION.
-->

<!--
  FIXME: This should be way easier once svelte rfc pr#12 lands:
  https://github.com/sveltejs/rfcs/blob/better-composition/text/0000-better-composition.md
-->

<!--
<script>
  // reactive data
  let active = 1;

  // FIXME: Prob don't need event
  function handleClick(event, index) {
    active = index;
  }
</script>
-->

<style type="text/postcss">
  @import './_tabs.css';
  @import 'import.css';

  /* .tabs-title {
    padding: 1em;
    border-bottom: 3px solid transparent;

    &:hover,
    &:focus {
      text-decoration: none;
      border-color: $gray5;
    }
  }

  .tabs-title-active {
    border-color: $intent-primary;
  } */
</style>

<svelte:options tag="minna-tabs" />

<div class="tabs">
  <!--
  <nav>
    <a href="#1" class="tabs-title {active === 1 ? 'tabs-title-active' : ''}" on:click|preventDefault="{event => handleClick(event, 1)}">1</a>
    <a href="#2" class="tabs-title {active === 2 ? 'tabs-title-active' : ''}" on:click|preventDefault="{event => handleClick(event, 2)}">2</a>
    <a href="#3" class="tabs-title {active === 3 ? 'tabs-title-active' : ''}" on:click|preventDefault="{event => handleClick(event, 3)}">3</a>
  </nav>
  <div class="tabs-content">
    {#if active === 1}<slot name="1"></slot>{/if}
    {#if active === 2}<slot name="2"></slot>{/if}
    {#if active === 3}<slot name="3"></slot>{/if}
  </div>
  -->
</div>
