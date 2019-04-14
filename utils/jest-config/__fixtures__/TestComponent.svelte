<!--
  TEST COMPONENT

  A simple Svelte component for use in tests.

  NOTE:
    In the code, object properties starting with _ are safe to mangle; the name
    can be shortened at build time for smaller JavaScript bundles.
-->

<script>
  export let name = 'Elon Musk';

  // computed
  $: reversed = name.split('').reverse().join('');

  // refs
  let target;
  let nameReversed;
</script>

<style type="text/postcss">
  $body-margin: 0;

  /* stylelint-disable no-descending-specificity */
  :global(body) {
    @media screen and (min-width: 30em) {
      margin: $body-margin;
    }
  }

  .text {
    color: rgb(255, 0, 0); /* red */

    &:focus {
      background: rgb(0, 0, 0); /* black */
    }

    .wrapper > & {
      margin-top: 1rem;
    }
  }
</style>

<div class="wrapper">
  <div class="text" bind:this="{target}">
    test {name}
  </div>

  <div class="text" bind:this="{nameReversed}">
    test <span>{reversed}</span>
  </div>
</div>
