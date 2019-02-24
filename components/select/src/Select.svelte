<!--
  INPUT SELECT COMPONENT

  A custom form input component similar to a native <select> element. Allows the
  user to select from a list of shown options.

  Features:
    - Automatically opens on focus for faster form input when using a keyboard
      for navigating.
    - User can filter through options with instant visual feedback.

  USAGE:
    HTML markup for typical use:

      <Select id="select-example" bind:value="example" items="[
        { id: 'ex1', text: 'Example 1' },
        { id: 'ex2', text: 'Example 2' },
        { id: 'ex3', text: 'Example 3', disabled: true },
      ]"/>

    See more available options/properties in the component data() below.

  REFERENCE:
    - https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/#Listbox
    - https://www.w3.org/TR/2017/NOTE-wai-aria-practices-1.1-20171214/examples/listbox/listbox-collapsible.html

  @format
-->

<!--
  TODO: Incorporate WAI-ARIA recommendations (once svelte can handle custom boolean attributes)
-->

<!--
  TODO: Explore moving the viewport when using keyboard navigation and the option is off-screen
-->

<script>
  import { beforeUpdate, onMount } from 'svelte';

  // props
  export let id = '';
  export let items = []; // `options` is already defined on Svelte instances
  export let filterable = true;
  export let filterHelp = 'Filter...';
  export let placeholder = 'Choose...';
  export let readonly;
  export let disabled;
  export let required; // FIXME: Add a way to do custom validation
  export let value;
  export let isOpen;

  // refs
  let input;

  // reactive data
  let inputText = '';
  let selected = 0; // index of the currently selected item

  // computed
  let filteredItems;
  $: filteredItems = (!isOpen || !filterable || inputText === '')
    ? items
    : items.filter(
      option => option.text
        .toLowerCase()
        .indexOf(inputText.toLowerCase()) > -1,
    );

  // non-reactive data
  let previousFilteredItems = filteredItems;
  let previousValue = value;

  function setIndex() {
    if (value) {
      // save the current item's index for highlighting in the options
      selected = filteredItems.findIndex(option => option.id === value);
    }
  }

  function setInput() {
    inputText = value
      ? items.find(option => option.id === value).text
      : '';
  }

  function open() {
    setIndex();

    if (filterable) {
      inputText = '';
    }
    isOpen = true;
  }

  function close() {
    isOpen = false;
    setInput();
  }

  function emitInput() {
    // fire a synthetic "input" event (useful to trigger validation)
    const event = new KeyboardEvent('input', { bubbles: true });
    input.dispatchEvent(event);
    close();
  }

  function select(event) {
    if (event) {
      // option selected via mouse
      event.preventDefault(); // don't trigger <input> blur event

      const { target } = event;

      if (!target.classList.contains('option-disabled')) {
        value = target.getAttribute('value');
        inputText = target.textContent;
        emitInput();
      }
    } else {
      // option selected via keyboard
      const option = filteredItems[selected]; // eslint-disable-line security/detect-object-injection

      if (!option.disabled) {
        value = option.id;
        inputText = option.text;
        emitInput();
      }
    }
  }

  function up() {
    if (selected <= 0) return;

    let steps = 1;

    // skip over disabled items or if there's no items left
    while (filteredItems[selected - steps].disabled) {
      steps += 1;
      if (filteredItems[selected - steps] === undefined) return;
    }

    selected -= steps;
  }

  function down() {
    // jump to last availiable item if index is out of bounds (e.g. after
    // filtering)
    if (selected >= filteredItems.length - 1) {
      selected = filteredItems.length - 1;
      return;
    }

    let steps = 1;

    // skip over disabled items or if there's no items left
    while (filteredItems[selected + steps].disabled) {
      steps += 1;
      if (filteredItems[selected + steps] === undefined) return;
    }

    selected += steps;
  }

  function handleKeyDown(event) {
    // choose key with graceful fallback for old browsers
    switch (event.key || event.keyCode) {
      case ' ':
      case 'Spacebar':
      case 32:
        if (!isOpen) {
          open();
        }
        break;
      case 'Enter':
      case 13:
        event.preventDefault(); // don't submit form
        if (isOpen) {
          select();
        } else {
          open();
        }
        break;
      case 'Escape':
      case 27:
        if (isOpen) {
          close();
        }
        break;
      case 'ArrowUp':
      case 'Up':
      case 38:
        event.preventDefault(); // don't scroll page or move cursor
        if (isOpen) {
          up();
        } else {
          open();
        }
        break;
      case 'ArrowDown':
      case 'Down':
      case 40:
        event.preventDefault(); // don't scroll page or move cursor
        if (isOpen) {
          down();
        } else {
          open();
        }
        break;
      default:
      // no matching key
    }
  }

  // FIXME: Remove if wrapper once svelte is fixed
  if (typeof document !== 'undefined') {
    beforeUpdate(() => {
      if (filteredItems !== previousFilteredItems) {
        previousFilteredItems = filteredItems;
        setIndex();
      }

      if (value && (value !== previousValue)) {
        previousValue = value;
        setInput();
      }
    });

    onMount(setInput);
  }
</script>

<div
  class="pos-r dif f-col{disabled ? ' select-disabled' : ''}{isOpen ? ' select-active' : ''}"
>
  <!--
    TODO: Could the input be replaced with a div+contentEditable? Would it have any extra value?
  -->
  <input
    id="{id}"
    bind:this="{input}"
    bind:value="{inputText}"
    class="select"
    tabindex="{disabled ? -1 : 0}"
    placeholder="{filterable && isOpen ? filterHelp : placeholder}"
    readonly="{!filterable || readonly || !isOpen}"
    disabled="{disabled}"
    aria-haspopup="listbox"
    on:click="{open}"
    on:focus="{open}"
    on:blur="{close}"
    on:keydown="{handleKeyDown}"
  />
  <div class="select-caret"></div>

  <div
    class="select-listbox{isOpen ? '' : ' hide'}"
    role="listbox"
    on:mousedown="{select}"
  >
    {#each filteredItems as item, index}
    <div
      class="option{item.disabled ? ' option-disabled' : ''}{index === selected ? ' option-active' : ''}"
      value="{item.id}"
      role="option"
    >
      {item.text}
    </div>
    {:else}
    <div class="pa3 gray">No matches</div>
    {/each}
  </div>
</div>

<style type="text/postcss">
  @import './_select.css';
  @import '@minna-ui/css/src/import.css';

  .hide {
    pointer-events: none;
    opacity: 0;
  }

  .select {
    .select-active > & {
      cursor: auto;
    }
  }

  .select-caret {
    @include triangle($select-caret-size, $select-caret-color);

    position: absolute;
    top: calc(50% - ($select-caret-size / 2));
    right: 0.75em;
    pointer-events: none;

    @if $select-optimize {
      will-change: transform;
    }

    .select-active > & {
      transform: scaleY(-1);
    }

    .select-disabled > & {
      border-top-color: $select-disabled-caret-color;
    }
  }

  .select-listbox {
    position: absolute;
    top: 100%;
    left: 0;
    z-index: $select-zindex;
    width: 100%;
    padding: $input-padding-y 0;
    font-size: $input-text-size;
    color: $input-text-color;
    text-align: left;
    background-color: $input-background-color;
    box-shadow: $select-shadow;
    /* prettier-ignore */
    transition:
      transform $select-animate-speed-out ease-out,
      opacity $select-animate-speed-out ease-out;
    backface-visibility: hidden; /* promote to own layer to avoid repaints */

    @if $select-optimize {
      will-change: transform, opacity;
    }

    &.hide {
      transition-duration: $select-animate-speed-in;
      transform: translateY(-1rem);
    }

    /* don't render when disabled for better performance */
    /* stylelint-disable-next-line a11y/no-display-none */
    .select-disabled > & {
      display: none;

      @if $select-optimize {
        will-change: auto;
      }
    }
  }

  .option {
    padding: $input-padding-y $input-padding-x;
  }

  .option-active,
  .option:hover,
  .option:focus {
    color: $select-selected-text-color;
    background-color: $select-selected-background-color;
  }

  .option-disabled,
  .option-disabled:hover,
  .option-disabled:focus {
    color: $select-disabled-text-color;
    background-color: unset;
  }
</style>
