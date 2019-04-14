<!--
  DIALOG COMPONENT

  TODO: Write me.

  @format
-->

<!-- REF: https://v3.svelte.technology/repl?version=3.0.0-beta.25&example=modal -->
<!-- REF: https://github.com/edenspiekermann/a11y-dialog -->
<!-- REF: https://keithjgrant.com/posts/2018/01/meet-the-new-dialog-element/ -->
<!-- REF: https://kyusuf.com/post/a-brief-look-at-html-dialog/ -->
<!-- REF: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog -->

<script>
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  // props
  export let isOpen = false;

  // refs

  // reactive data

  // computed

  // non-reactive data

  function open() {
    isOpen = true;
    dispatch('open');
  }

  function close() {
    isOpen = false;
    dispatch('close');
  }
</script>

<style type="text/postcss">
  @import './_dialog.css';
  @import 'import.css';

  .dialog {}
</style>

<svelte:options tag="minna-dialog" />

<dialog class="dialog" open="{isOpen}">
  <slot></slot>
</dialog>
