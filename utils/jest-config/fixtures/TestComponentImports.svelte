<script>
  import { shout, whisper } from './importable.js';

  export let name = 'Elon Musk';

  $: loud = shout(name);
  $: quiet = whisper(name);
</script>

<svelte:options tag="test-component-imports" immutable={true} />

{name} {loud} {quiet}
