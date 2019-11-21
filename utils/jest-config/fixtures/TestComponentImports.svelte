<script>
  import { shout, whisper } from './importable.mjs';

  export let name = 'Elon Musk';

  $: loud = shout(name);
  $: quiet = whisper(name);
</script>

<svelte:options immutable="{true}" />

<div id="name">{name}</div>
<div id="loud">{loud}</div>
<div id="quiet">{quiet}</div>
