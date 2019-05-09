<script>
  import { shout, whisper } from './importable.js';

  export let name = 'Elon Musk';

  // computed
  $: loud = shout(name);
  $: quiet = whisper(name);
</script>

{name} {loud} {quiet}
