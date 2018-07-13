<!-- markdownlint-disable no-duplicate-header no-inline-html -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.8.0] - 2018-07-14

### Added

- New global `border-box` box model styles, but disable by default. Set `--use-global-border-box: true;` to enable.

### Removed

- Unused CSS class `.disabled`.
- CLI binary script tests because they were unnecessary; the functionality is already covered by other tests, plus they were slow and cumbersome to maintain.

### Changed

- Updated package dependencies.

### Fixed

- Allow resizing `<textarea>` blocks.
- `<svg>` tag `fill` will inherit text `color` when no fill colour is set.
- Use a more universal shebang for CLI binary scripts and remove workaround from Travis config.

## [0.7.1] - 2018-07-10

### Added

- More `@minna-ui/postcss-config` tests for full code coverage.

### Fixed

- Add `@extend` to list of allowed at-rules in `@minna-ui/stylelint-config`.
- `@minna-ui/navbar` SVG icon colour.

## [0.7.0] - 2018-07-10

### Added

- New `@extend` at-rule in `@minna-ui/postcss-config` for easy CSS customisation without directly overriding existing selectors.
- New debug option in `@minna-ui/postcss-config`.

### Removed

- BREAKING CHANGE: `box-sizing: border-box` is now only set by default on styles which require it (styles with width and padding or border, such as `.con`). You now need to manually add `.bb` when required or add your own global box-sizing style.
- BREAKING CHANGE: Remove `.link` class; always just use plain `<a>` tags.
- Overly opinionated text styles and their CSS variables:
  - `--text-rendering`
  - `--text-variant`
- Broken `.quote` blockquote styles.
- Unnecessary default grid row and column size and CSS variables:
  - `--rows`
  - `--cols`

### Changed

- BREAKING CHANGE: New responsive breakpoints and max container widths.
- BREAKING CHANGE: Rename CSS variables:
  - `--font-family*` to `--font-stack*`
  - `--text-size-min` to `--text-size`
  - `--text-size-max` to `--text-size-large`
  - `--navbar-link-fragment-*` to `--navbar-hash-link-*`
- BREAKING CHANGE: Font size defaults.
- BREAKING CHANGE: Styles are now opt-in for tables, radio and checkbox inputs, and code blocks; a class is now required.
- Text size is no longer fluid by default.
- Link hover no longer changes text colour.
- Link text colour.
- Simplify form input disabled styles.
- Simplify grid styles for output CSS.
- Convert more CSS size units to `em`.

### Fixed

- Incorrect alignment when `.button` class is applied to links.
- `@minna-ui/switch` component width.
- `undefined [undefined]` warning when compiling CSS with `@minna-ui/postcss-config`.

## [0.6.0] - 2018-07-08

### Changed

- BREAKING CHANGE: Rename `@minna-ui/toggle` component to `@minna-ui/switch`.
- BREAKING CHANGE: Rename `--toggle-*` CSS variables to `--switch-*`.
- Convert more CSS size units to `em`.
- Simplify SVG image used to create diagonal sections.

### Fixed

- BREAKING CHANGE: Don't style default form elements; require classes for custom form element styles.
- NPM publish script now correctly lints, tests, and builds packages before publishing.

## [0.5.0] - 2018-07-08

### Added

- New `@minna-ui/collapse` component.
- Add support for overriding CSS variables (custom properties) via JavaScript.

### Changed

- Refactor section styles to use a more cross-browser compatible technique to draw diagonal lines and better hero styles.
- Refactor button shadow and hover state.
- `@minna-ui/navbar` link fragment fix disabled by default + minor optimisations.
- Updated package dependencies.

### Fixed

- `@minna-ui/navbar` hamburger menu does not close if user clicks when open.

## [0.4.1] - 2018-07-02

### Fixed

- Remove conflicting `.h*` CSS classes. Now these classes only refer to grid height (the number of rows).
- `@minna-ui/navbar` link fragment fix is now optional.
- `@minna-ui/navbar` menu border shown at the wrong time.

## [0.4.0] - 2018-07-02

This is a large release centred around refactoring colours and simplifying and cleaning up the styles. There were many breaking changes especially in CSS variables so please be mindful when upgrading.

### Added

- New CSS at-rule, `@use`, in `@minna-ui/postcss-config` for better flexibility.
- New colour variables in `_variables-color.css`.
- New CSS variables:
  - `--gutter-compact`
  - `--label-margin`
  - `--label-text-color`
  - `--input-disabled-background-color`
  - `--card-body-margin`
  - `--alert-border-size`
  - `--navbar-border-color`
  - `--navbar-link-padding`
  - `--toggle-shadow`
  - `--toggle-disabled-text-color`
  - `--toggle-disabled-border`

### Removed

- BREAKING CHANGE: Delete `_variables-md-colour.css`.
- BREAKING CHANGE: Removed CSS variables:
  - `--gradient-*` - we no longer have predefined gradients by default
  - `--primary`
  - `--secondary`
  - `--dark`
  - `--light`
  - `--neutral`
  - `--subtle`
  - `--body-font-colour`
  - `--body-bg-colour`
  - `--alt-bg-colour`
  - `--shadow-colour-subtle`
  - `--shadow-base`
  - `--shadow-subtle`
  - `--heading-small-font-colour`
  - `--btn-arrow-animate-speed`
  - `--btn-cta-*`
  - `--btn-dark-*`
  - `--btn-main-*`
  - `--input-border-width`
  - `--card-padding-*`
  - `--alert-*-bg-colour`
  - `--navbar-shadow-before`
- BREAKING CHANGE: Removed CSS classes:
  - `.btn-cta`
  - `.btn-dark`
  - `.btn-main`
  - `h* > small`

### Changed

- BREAKING CHANGE: Switch to American English spelling (not British English) for CSS and component APIs to better match developer expectations.
- BREAKING CHANGE: Rename files:
  - `_colour.css` to `_color.css`
  - `_label.css` to `_tag.css`
- BREAKING CHANGE: Renamed CSS variables:
  - `*-colour*` to `*-color*`
  - `*-bg-*` to `*-background-*`
  - `*font-*` to `*text-*` (but not `--font-family*`)
  - `--btn-*` to `--button-*`
  - `--radius-1` to `--radius`
  - `--radius-2` to `--radius-large`
  - `--angle-*` to `--angle*`
  - `--gutter-col-l` to `--gutter-col-large`
  - `--gutter-row-l` to `--gutter-row-large`
  - `--shadow-colour` to `--shadow-color`
  - `--shadow-light-1` to `--shadow-light`
  - `--shadow-light-2` to `--shadow-light-edge`
  - `--body-font-colour` to `--text-color`
  - `--body-bg-colour` to `--app-background-color`
  - `--link-font-colour` to `XXXXX`
  - `--link-hover-font-colour` to `XXXXX`
  - `--label-*` to `--tag-*`
  - `--card-touch-*` to `--card-hover-*`
- BREAKING CHANGE: Renamed CSS classes:
  - `.*btn*` to `.*button*`
  - `.*grey*` to `.*gray*`
  - `.card-touch` to `.card-hover`
  - `.rad` to `.rounded`
  - `.rad2` to `.rounded-large`
  - `.rad0*` to `.not-rounded*`
- BREAKING CHANGE: All colour classes in `_color.css` have been changed.
- BREAKING CHANGE: CSS mixin `fluid-font-size` to `fluid-text-size`.
- Colours now must be defined using `rgb()` or `rgba()` only.
- Some more CSS sizes were converted from `rem` to `em`.
- Updated package dependencies.

### Fixed

- Bracket parsing doesn't match in `@minna-ui/svelte-preprocess-markup`. This is only a partial fix and so you need to quote any `{}` tags that contain `{` or `}` characters.

## [0.3.0] - 2018-06-27

### Added

- Simple table styles.

### Changed

- Refactor font sizes.
- Use `em` instead of `rem` in places where it makes sense.
- Change some whitespace to suit new font sizes.
- Better font family system stack, now more inclusive of all common operating systems.
- Use bold font weight to show active nav items.
- Better SVG image alignment in `@minna-ui/navbar`.
- Adjust `@minna-ui/navbar` body offset for better compatibility with system fonts.
- Updated package dependencies.

### Fixed

- Headers causing the page to overflow (but be mindful about where words may be split when overflowing).
- `.mono` class should not look like `.code`.

## [0.2.0] - 2018-06-14

### Added

- New file size badge in README of the [`@minna-ui/css`](https://github.com/WeAreGenki/minna-ui/tree/master/css) and each component package. Please keep in mind, for components, it shows the file size of the JavaScript bundle but not the CSS bundle due to a limitation in the service.
- New neutral font colour.
- Unit tests for CLI scripts.

### Removed

- Default margin between button. This should be up to the developer to decide based on their specific usage scenario.

### Changed

- Improved accessibility for form inputs and the toggle component. More noticeable visual focus indicator.
- Simplified side nav styles.
- Labels are now less prominent.
- Refine CSS animations for `.card-touch`.
- Update jest to v23.0.0 and rewrite preset to use the newly supported `jest-preset.js` (instead of `jest-preset.json`).
- Updated package dependencies.

## [0.1.0] - 2018-05-23

### Added

- Unit tests for all packages. Coverage now at 100% 🎉
- Wrote a simple readme for some packages but these are still a work in progress.

### Changed

- Component builds are now powered by rollup, replacing our custom build script. Builds are much more flexible and reliable now.
- New standalone option for `@minna-ui/postcss-config` to be used when `@minna-ui/css` is not installed.
- Simplify jest svelte transform.
- Updated package dependencies.

### Fixed

- Tweaked `@minna-ui/eslint-config` and `@minna-ui/jest-config` to work better with unit tests.
- Some edge cases in CSS mixins which were discovered via new unit tests.

## 0.0.0 - 2018-05-18

### Added

- Initial public release 🎊

[Unreleased]: https://github.com/WeAreGenki/ui/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/MaxMilton/new-tab/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/MaxMilton/new-tab/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/MaxMilton/new-tab/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/MaxMilton/new-tab/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/MaxMilton/new-tab/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/MaxMilton/new-tab/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/MaxMilton/new-tab/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/MaxMilton/new-tab/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/MaxMilton/new-tab/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/MaxMilton/new-tab/compare/v0.0.0...v0.1.0
