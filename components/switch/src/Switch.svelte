<!--
  INPUT SWITCH COMPONENT

  This component is intended to be an alternative to checkbox inputs in forms
  when there's a need to toggle something with an on and off state. From a UX
  perspective, it should be clearly understood that something is being turned on
  or off.

  An example of this is a switch to turn on or off sound in an interactive web
  app. On the other hand, you should use a checkbox when users are accustomed to
  seeing a checkbox such as an input to accept terms and conditions in a
  transaction flow. That said, most of the time this is a great option.

  USAGE:
    Simply import this component into your vue file and use it in your template
    as if it was a normal input; bind it to a vue model. Example:

      <Switch bind:value="switch"/>

    The default switch is the same size as buttons. If this is too big, you can
    add a "mini" property for a compact version. Example:

      <Switch bind:value="switch" mini/>

    It's possible to change the text from "ON"/"OFF" by passing the props textOn
    and textOff. If you change this you may need to modify the width too, which
    can be done via the --switch-width CSS variable. Example:

      <Switch bind:value="switch" textOn="YES" textOff="NO"/>

  TIPS:
    - It's a good idea to add a title attribute so desktop users can understand
      the elements purpose more clearly.
    - If following accessibility guidelines it's recommended to label the
      purpose of the switch by adding an `aria-label` or `aria-labelledby`
      attribute.
    - If used in a form this component won't send any data by default. If you
      wish to use it as a form input you'll need to bind the v-model to a
      hidden input.
    - The `disabled` attribute is not valid on <div> so we use a class.

  @format
-->

<!--
  TODO: Ability to drag the switch using mouse/touch in a high performance way.
-->

<script>
  import { afterUpdate, createEventDispatcher } from 'svelte';

  export let textOn = 'ON';
  export let textOff = 'OFF';
  export let mini = false;
  export let disabled = false;
  export let value;

  const dispatch = createEventDispatcher();

  let previousValue = value;

  function toggle() {
    if (!disabled) {
      value = !value;
    }
  }

  function handleKeyDown(event) {
    // Choose key with graceful fallback for old browsers
    /* eslint-disable @typescript-eslint/no-magic-numbers */
    switch (event.key || event.keyCode) {
      case 'Enter':
      case 13: // Enter
      case ' ':
      case 'Spacebar':
      case 32:
        event.preventDefault(); // Don't submit form (enter) or scroll page (space)
        toggle();
        break;
      default:
        // No matching key
    }
    /* eslint-enable @typescript-eslint/no-magic-numbers */
  }

  afterUpdate(() => {
    if (value !== previousValue) {
      previousValue = value;
      dispatch('change', value);
    }
  });
</script>

<style type="text/postcss">
  @import '%%/import.css';
  @import './_switch.css';

  /* This purposely looks like .button and uses many .button variables */
  .switch {
    position: relative;
    display: inline-flex;
    width: $switch-width;
    padding: $switch-padding;
    color: $switch-off-text-color;
    text-align: center;
    vertical-align: middle;
    background-color: $switch-off-background-color;
    border-radius: $switch-radius;
    box-shadow: $switch-inner-shadow, $switch-shadow;
    backface-visibility: hidden; /* Promote to own layer to avoid repaints */
    cursor: pointer;
    /* stylelint-disable-next-line plugin/no-low-performance-animation-properties */
    transition: background-color $switch-animate-out-speed ease-out;
    transition-delay: 0s;
    user-select: none;

    @if $switch-optimize {
      will-change: background-color;
    }

    &.switch-mini {
      width: $switch-mini-width;
      padding: $switch-mini-padding;
    }

    &:hover {
      /* FIXME: Add hover style */
    }

    &:focus {
      /* FIXME: Add focus style */
    }
  }

  .switch-checked {
    background-color: $switch-on-background-color;
    transition-delay: $switch-animate-in-speed;
    transition-duration: $switch-animate-in-speed;
  }

  .switch-on,
  .switch-off {
    flex-basis: calc($switch-width / 2);
  }

  .switch-on {
    color: $switch-on-text-color;

    .switch-disabled > & {
      color: $switch-disabled-text-color;
    }
  }

  .switch-slider {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 50%;
    background: $switch-slider-background-color;
    border: $switch-slider-border;
    border-radius: $button-radius;
    box-shadow: $switch-slider-inner-shadow;
    transition: transform $switch-animate-in-speed ease-out;

    @if $switch-optimize {
      will-change: transform;
    }

    .switch-checked > & {
      transform: translateX(100%);
    }

    .switch-mini > & {
      box-shadow: $switch-mini-slider-inner-shadow;
    }

    .switch:hover > &,
    .switch:focus > & {
      background: $switch-hover-slider-background-color;
    }

    /* stylelint-disable-next-line no-descending-specificity */
    .switch-disabled > & {
      box-shadow: none; /* inner shadow */
      transition: none;

      @if $switch-optimize {
        will-change: auto;
      }
    }

    /* stylelint-disable-next-line no-descending-specificity */
    .switch-disabled > &,
    .switch-disabled:hover > &,
    .switch-disabled:focus > & {
      background: $switch-disabled-slider-background-color;
    }
  }

  .switch-disabled {
    color: $button-disabled-text-color;
    background-color: $button-background-color;
    border: $switch-disabled-border;
    box-shadow: none; /* inner shadow */
    cursor: not-allowed;
    transition: none;

    @if $switch-optimize {
      will-change: auto;
    }

    /* stylelint-disable a11y/no-outline-none */
    &:hover,
    &:focus {
      outline: none;
    }
    /* stylelint-enable */
  }
</style>

<svelte:options immutable="{true}" />

<div
  class="switch {mini ? 'switch-mini' : ''} {disabled ? 'switch-disabled' : ''} {value ? 'switch-checked' : ''}"
  role="switch"
  tabindex="{disabled ? -1 : 0}"
  aria-checked="{!!value}"
  on:click="{toggle}"
  on:keydown="{handleKeyDown}"
>
  <div class="switch-slider"></div>
  <div class="switch-on">{textOn}</div>
  <div class="switch-off">{textOff}</div>
</div>
