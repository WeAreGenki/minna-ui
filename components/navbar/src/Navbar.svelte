<!--
  NAVBAR COMPONENT

  A simple fixed top navigation bar with a floating effect upon scrolling. It
  will collapse into a hamburger menu when the screen width is small.

  USAGE:
    The "items" property should be an array of objects which look like this:

      <Navbar {segment} items="{[
        { url: '/page-one', text: 'Page One' },
        { url: '/page-two', text: 'Page Two' },
        { url: '/about', text: 'About Us' },
      ]}"/>

    The menu hamburger, menu close, and logo images are referenced using the
    inline SVG sprite with <symbol> + <use> elements technique. Because these
    images are critical to page rendering, we use this technique as it's the
    faster way to load UI critical SVGs. This component doesn't come with any
    SVG images so you need to provide your own. For example, you could include
    something structured like this after the opening <body> tag in your page:

      <svg class="dn" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <symbol id="logo" viewBox="0 0 67.2 25.6">
            YOUR LOGO SVG CONTENTS
          </symbol>
          <symbol id="menu" class="icon" viewBox="0 0 24 24">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </symbol>
          <symbol id="x" class="icon" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </symbol>
        </defs>
      </svg>

    Also add this to your CSS:

      .icon {
        fill: none;
        stroke: currentColor;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-width: 2;
      }

    You may need to adjust size and whitespace to suite your logo. See the CSS
    variables below.

    Alternatively, you may replace the SVG logo with your own markup by passing
    the markup via a slot, that is, by adding it in between Navbar tags:

      <Navbar items="{[...]}">
        <span slot="logo" class="navbar-logo">YOUR LOGO</span>
      </Navbar>

  @format
-->

<script>
  import { onMount } from 'svelte';

  // props
  export let items = [];
  export let segment; // current URL path; in sapper, pass in "segment"

  // reactive data
  let isOpen;
  let hasScrolled;

  let wait;
  let lastHasScrolled;

  function update() {
    const scrolled = window.pageYOffset !== 0;

    // don't set component state if nothing has changed
    /* istanbul ignore else */
    if (scrolled !== lastHasScrolled) {
      lastHasScrolled = scrolled;
      hasScrolled = scrolled;
    }

    wait = false;
  }

  // debounce scroll event using rAF
  function scrollHandler() {
    /* istanbul ignore if */
    if (wait) return;
    wait = true;
    requestAnimationFrame(update);
  }

  function clickHandler() {
    isOpen = false;
    document.removeEventListener('click', clickHandler);
  }

  function openMenu() {
    if (!isOpen) {
      isOpen = true;

      // re-queue at end of execution queue to avoid race condition
      setTimeout(() => {
        // close when user clicks anywhere
        document.addEventListener('click', clickHandler);
      }, 0);
    }
  }

  // FIXME: Remove if wrapper once svelte is fixed
  if (typeof document !== 'undefined') {
    onMount(() => {
      document.addEventListener('scroll', scrollHandler, false);
    });
  }
</script>

<header class="navbar {(hasScrolled || isOpen) ? 'navbar-active' : ''}">
  <nav class="dfc fww con" role="navigation">
    <button
      type="button"
      class="navbar-button l-dn button-clear"
      aria-label="menu toggle"
      aria-expanded="{!!isOpen}"
      on:click="{openMenu}"
    >
      <svg class="navbar-icon">
        <use xlink:href="{isOpen ? '#x' : '#menu'}" />
      </svg>
    </button>

    <a href="/" class="navbar-logo-link" title="Home">
      <slot name="logo">
        <svg class="navbar-logo"><use xlink:href="#logo" /></svg>
      </slot>
    </a>

    <div class="navbar-links {isOpen ? 'df' : 'dn'}">
      <a
        href="/"
        class="navbar-link l-dn {segment === undefined ? 'navbar-link-active' : ''}"
      >
        Home
      </a>

      {#each items as item}
      <a
        href="{item.url}"
        class="navbar-link {segment === item.url ? 'navbar-link-active' : ''}"
        rel="{item.rel || ''}"
      >
        {item.text}
      </a>
      {/each}
    </div>
  </nav>
</header>

<style type="text/postcss">
  @import './_navbar.css';
  @import 'import.css';

  /* offset page content so it's not covered by the fixed navbar */
  :global(body) {
    margin-top: $navbar-body-offset;
  }

  .navbar {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: $navbar-zindex;
    background-color: $navbar-background-color;

    &::after {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      pointer-events: none;
      content: '';
      box-shadow: $navbar-shadow;
      opacity: 0;
      transition: opacity $navbar-animate-speed-out ease-in-out;
      backface-visibility: hidden; /* promote to own layer to avoid repaints */

      @if $navbar-optimize {
        will-change: opacity;
      }
    }
  }

  .navbar-active::after {
    opacity: 1;
    transition-duration: $navbar-animate-speed-in;
  }

  .navbar-button {
    padding: 0;
    margin-right: 1.2em;
    line-height: 0;
  }

  .navbar-icon {
    width: $navbar-icon-size;
    height: $navbar-icon-size;
    padding: $navbar-icon-padding;
    color: $navbar-icon-color;
  }

  .navbar-logo-link {
    line-height: 0;
  }

  .navbar-logo {
    width: $navbar-logo-size-x;
    height: $navbar-logo-size-y;
  }

  .navbar-links {
    flex-basis: 100%;
    flex-direction: column;
    flex-grow: 1;
    padding: $navbar-links-padding;
    margin: 0 -1rem;

    &.df {
      border-top: 1px solid $navbar-border-color;
    }

    @media $l {
      display: flex;
      flex-basis: auto;
      flex-direction: row;
      flex-grow: 0;
      padding: 0;
      margin: 0 -1rem 0 auto;
    }
  }

  .navbar-link {
    padding: $navbar-link-padding;
    margin: 0;
    color: $navbar-link-color;
  }

  .navbar-link-active {
    font-weight: $text-weight-heavy;
  }

  /**
  * This is a workaround when clicking on a link with a internal target location
  * (a link to another place within the same page). Since the target element is
  * moved to the top of the page it becomes covered by the fixed navbar. We get
  * around this using an invisible pseudo element with an offset position which
  * is attached to any heading with an id.
  *
  * Only add an id property to a heading when truly necessary to avoid the small
  * CSS rendering performance hit.
  */
  /* stylelint-disable-next-line order/order */
  @if $navbar-hash-link-fix {
    :global(h1),
    :global(h2),
    :global(h3),
    :global(h4),
    :global(h5),
    :global(h6) {
      &[id]::before {
        display: block;
        height: $navbar-hash-link-offset;
        margin-top: calc(-1 * $navbar-hash-link-offset);
        visibility: hidden;
        content: '';
      }
    }
  }
</style>
