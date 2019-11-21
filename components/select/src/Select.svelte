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

      <Select id="select-example" bind:value="{example}" items="{[
        { id: 'ex1', text: 'Example 1' },
        { id: 'ex2', text: 'Example 2' },
        { id: 'ex3', text: 'Example 3', disabled: true },
      ]}"/>

    You can also use a simple list of items (works best with short item names):

      <Select id="select-example" bind:value="{example}" items="{[
        'Example 1',
        'Example 2',
        'Example 3',
      ]}"/>

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
  import { onMount } from 'svelte';

  /**
   * @typedef {object} SelectItem
   * @property {string} id - Option item `id` attribute. This is set as the
   * component value when selection.
   * @property {string} text - The text to show users.
   * @property {boolean} disable - Disable to prevent selection and show in a
   * disabled state.
   */

  export let disabled = false;
  export let filterable = true;
  export let filterHelp = 'Filter...';
  export let isOpen = false;
  export let placeholder = 'Choose...';
  /** @type {string} */
  export let id;
  /** @type {SelectItem[]} */
  export let items;
  /** @type {string} */
  export let value;

  let inputText = '';
  /** Index of the current selected item. */
  let selected = 0;
  /**
   * Input element reference.
   *
   * @type {HTMLInputElement}
   */
  let input;
  /** @type {SelectItem[]} */
  let previousFilteredItems;
  let previousValue = value;

  function setIndex() {
    if (value) {
      // Save the current item's index for highlighting in the options
      selected = filteredItems.findIndex(option => option.id === value);
    }
  }

  function setInput() {
    inputText = value
      ? normalizedItems.find(option => option.id === value).text
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
    // Fire a synthetic "input" event (to trigger validation etc.)
    const event = new KeyboardEvent('input', { bubbles: true });
    input.dispatchEvent(event);
    close();
  }

  function select(event) {
    if (event) {
      // Option selected via mouse
      event.preventDefault(); // Don't trigger <input> blur event

      const { target } = event;

      if (!target.classList.contains('option-disabled')) {
        value = target.getAttribute('value');
        inputText = target.textContent;
        emitInput();
      }
    } else {
      // Option selected via keyboard
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

    // Skip over disabled items or if there's no items left
    while (filteredItems[selected - steps].disabled) {
      steps += 1;
      if (filteredItems[selected - steps] === undefined) return;
    }

    selected -= steps;
  }

  function down() {
    // Jump to last availiable item if index is out of bounds (e.g. after
    // filtering)
    if (selected >= filteredItems.length - 1) {
      selected = filteredItems.length - 1;
      return;
    }

    let steps = 1;

    // Skip over disabled items or if there's no items left
    while (filteredItems[selected + steps].disabled) {
      steps += 1;
      if (filteredItems[selected + steps] === undefined) return;
    }

    selected += steps;
  }

  function handleKeyDown(event) {
    // Choose key with graceful fallback for old browsers
    /* eslint-disable @typescript-eslint/no-magic-numbers */
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
        event.preventDefault(); // Don't submit form
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
        event.preventDefault(); // Don't scroll page or move cursor
        if (isOpen) {
          up();
        } else {
          open();
        }
        break;
      case 'ArrowDown':
      case 'Down':
      case 40:
        event.preventDefault(); // Don't scroll page or move cursor
        if (isOpen) {
          down();
        } else {
          open();
        }
        break;
      default:
        // No matching key
    }
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  }

  $: filteredItems = (!isOpen || !filterable || inputText === '')
    ? normalizedItems
    : normalizedItems.filter(
      option => option.text
        .toLowerCase()
        .indexOf(inputText.toLowerCase()) > -1,
    );

  $: normalizedItems = items.map((item) =>
    (item.id ? item : { id: item, text: item })
  );

  $: {
    if (filteredItems !== previousFilteredItems) {
      previousFilteredItems = filteredItems;
      setIndex();
    }
  }

  $: {
    if (value && (value !== previousValue)) {
      previousValue = value;
      setInput();
    }
  }

  onMount(setInput);
</script>

<style type="text/postcss">
  @import './_select.css';
  @import 'import.css';

  .hide {
    opacity: 0;
    pointer-events: none;
  }

  .select-wrapper {
    max-width: 100%;
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
    color: $input-text-color;
    font-size: $input-text-size;
    text-align: left;
    background-color: $input-background-color;
    box-shadow: $select-shadow;
    backface-visibility: hidden; /* promote to own layer to avoid repaints */
    /* prettier-ignore */
    transition:
      transform $select-animate-speed-out ease-out,
      opacity $select-animate-speed-out ease-out;

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

<div class="select-wrapper pos-r dib f-col {disabled ? 'select-disabled' : ''} {isOpen ? 'select-active' : ''}">
  <input
    id="{id}"
    bind:this="{input}"
    bind:value="{inputText}"
    class="select"
    type="text"
    tabindex="{disabled ? -1 : 0}"
    placeholder="{filterable && isOpen ? filterHelp : placeholder}"
    readonly="{!filterable || !isOpen}"
    disabled="{disabled}"
    autocomplete="off"
    aria-haspopup="listbox"
    on:click="{open}"
    on:focus="{open}"
    on:blur="{close}"
    on:keydown="{handleKeyDown}"
  />
  <div class="select-caret"></div>

  <div
    class="select-listbox {isOpen ? '' : 'hide'}"
    role="listbox"
    on:mousedown="{select}"
  >
    {#each filteredItems as item, index}
      <div
        class="option {item.disabled ? 'option-disabled' : ''} {index === selected ? 'option-active' : ''}"
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
