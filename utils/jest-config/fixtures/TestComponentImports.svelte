{name} {loud} {quiet}

<script>
  import { shout, whisper } from './importable.js';

  const name = 'Elon Musk';

  // computed
  let loud;
  let quiet;
  $: loud = shout(name);
  $: quiet = whisper(name);
</script>
