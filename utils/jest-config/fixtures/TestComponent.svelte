<!--
  TEST COMPONENT

  A simple Svelte component for use in tests.

  NOTE:
    In the code, object properties starting with _ are safe to mangle; the name
    can be shortened at build time for smaller JavaScript bundles.
-->

<script>
  export let name = 'Elon Musk';

  $: reversed = name.split('').reverse().join('');
</script>

<style type="text/postcss">
  :global(body) {
    @media screen and (min-width: 30em) {
      margin: 0;
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

<svelte:options immutable="{true}" />

<div class="wrapper">
  <div id="name" class="text" tabindex="-1">
    Name: {name}
  </div>

  <div id="nameReversed" class="text">
    Name: <span>{reversed}</span>
  </div>
</div>
