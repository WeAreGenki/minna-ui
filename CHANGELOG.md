<!-- markdownlint-disable no-duplicate-header no-inline-html -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.0] - 2018-07-02

This is a large release centred around refactoring colours and simplifying and cleaning up the styles. There were many breaking changes especially in CSS variables so please be mindful when upgrading.

### Added

- New at rule `@use` in `@minna-ui/postcss-config` for developer flexibility.
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
- BREAKING CHANGE: Unnecessary CSS variables:
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
- BREAKING CHANGE: CSS classes:
  - `.btn-cta`
  - `.btn-dark`
  - `.btn-main`
  - `h* > small`

### Changed

- BREAKING CHANGE: Switch to American English spelling (not British English) for CSS and component APIs to better match developer expectations.
- BREAKING CHANGE: Rename files:
  - `_colour.css` renamed to `_color.css`
  - `_label.css` renamed to `_tag.css`
- BREAKING CHANGE: Renamed CSS variables:
  - `*-colour*` renamed to `*-color*`
  - `*-bg-*` renamed to `*-background-*`
  - `*font-*` renamed to `*text-*` (but not `--font-family*`)
  - `btn-*` renamed to `button-*`
  - `--radius-1` renamed to `--radius`
  - `--radius-2` renamed to `--radius-large`
  - `--angle-*` renamed to `--angle*`
  - `--gutter-col-l` renamed to `--gutter-col-large`
  - `--gutter-row-l` renamed to `--gutter-row-large`
  - `--shadow-colour` renamed to `--shadow-color`
  - `--shadow-light-1` renamed to `--shadow-light`
  - `--shadow-light-2` renamed to `--shadow-light-edge`
  - `--body-font-colour` renamed to `--text-color`
  - `--body-bg-colour` renamed to `--app-background-color`
  - `--link-font-colour` renamed to `XXXXX`
  - `--link-hover-font-colour` renamed to `XXXXX`
  - `--label-*` renamed to `--tag-*`
  - `--card-touch-*` renamed to `--card-hover-*`
- BREAKING CHANGE: Renamed CSS classes:
  - `.*btn*` renamed to `.*button*`
  - `.*grey*` renamed to `.*gray*`
  - `.card-touch` renamed to `.card-hover`
  - `.rad` renamed to `.rounded`
  - `.rad2` renamed to `.rounded-large`
  - `.rad0*` renamed to `.not-rounded*`
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

[Unreleased]: https://github.com/WeAreGenki/ui/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/MaxMilton/new-tab/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/MaxMilton/new-tab/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/MaxMilton/new-tab/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/MaxMilton/new-tab/compare/v0.0.0...v0.1.0
