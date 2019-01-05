<!-- markdownlint-disable no-duplicate-header no-inline-html -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Rename component variables CSS file from `_variables.css` to `_component-name.css` making it more explicit which file is being imported.

## [0.19.1] - 2018-12-24

### Fixed

- Output broken in the `makeCss` plugin in `@minna-ui/rollup-plugins` when running a production build and `optimize` is `true`.
- 404 requests are logged as `NaN undefined` size in the `devserver` plugin in `@minna-ui/rollup-plugins`.
- Tries to start a duplicate server instance causing a crash in the `devserver` plugin in `@minna-ui/rollup-plugins`.

## [0.19.0] - 2018-12-24

### Added

- New rollup plugins `makeCss` and `devserver` in `@minna-ui/rollup-plugins`.

### Changed

- Renamed existing `makeCss` rollup plugin from `makeCss` to `postcss` in `@minna-ui/rollup-plugins`. The _new_ `makeCss` plugin better matches `makeHtml` which writes files to disk, while the previous plugin (now called `postcss`) only processed files but did not write them to disk.
- Reduce `$text-size-large` CSS variable to be equivalent to `20px` instead of `21px`. In narrow text it's actually easier to read. If you want larger text for accessibility reasons you'll need to set `$text-size-large: 1.3125em; /* 21px */` in your CSS variables.
- Updated package dependencies.

### Fixed

- CSS `button` mixin does not provide a way to set animation speed.

## [0.18.2] - 2018-12-21

### Added

- New `gitDescribe` helper function in `@minna-ui/rollup-plugins`.

### Changed

- Updated package dependencies.

## [0.18.1] - 2018-12-19

### Added

- File dependencies are now tracked in `@minna-ui/pre-style` Svelte preprocessor when using `rollup-plugin-svelte`. While rollup is in watch mode if any dependant file changes it will trigger a rebuild.

### Removed

- Unnecessary rules in `@minna-ui/tslint-config`.

### Changed

- Move `@minna-ui/jest-config` TypeScript preset into a separate file.
- Updated package dependencies.

### Fixed

- ESLint preset incorrectly assumes `preact.config.js` module style. It's not commonJS (the default), the file actually uses ES modules.

## [0.18.0] - 2018-12-01

### Added

- New package `@minna-ui/prettier-config`.
- New package `@minna-ui/ts-config`.
- New package `@minna-ui/tslint-config`.
- Prettier support in linting packages.
- Run prettier on internal files.
- TSLint linting internally.
- Add check to make sure users install with `yarn` and not `npm`.

### Removed

- Node 8 from <abbr title="continuous intergration">CI</abbr>.

### Changed

- Change internal colour values from RGB to HSL.
- Updated internal tool configs.
- Updated package dependencies.

### Fixed

- Internal packages not linking together correctly.

## [0.17.1] - 2018-11-11

### Fixed

- Missing files in some packages.

## [0.17.0] - 2018-11-11

### Added

- New package `@minna-ui/rollup-plugins`.
- CSS class `.spinner` for a loading state spinner. We intend to add more loading state styles in future.
- Utility styles for dealing with mouse events.
- CSS mixin to create custom buttons.

### Removed

- Removed CSS variables `$angle1` and `$angle2`.
- Remove text-align justify styles as they're bad for accessibility.
- No more auto `:global()` selector injection (was style tag global attribute). This greatly simplifies `@minna-ui/pre-style`.

### Changed

- Renamed package names:
  - `@minna-ui/toasts` to `@minna-ui/toast`
  - `@minna-ui/svelte-preprocess-markup` to `@minna-ui/pre-markup`
  - `@minna-ui/svelte-preprocess-style` to `@minna-ui/pre-style`
- Renamed CSS mixin `draw-triangle` to `triangle`.
- Renamed CSS variable `$angle3` to `$angle`.
- Installing the `minna-ui` meta package is now the recommended way to use Minna UI.
- Colour style tweaks.
- Updated package dependencies.

### Fixed

- StyleLint config a11y rules too strict.
- Package resolution in `@minna-ui/postcss-config` broken.

## [0.16.0] - 2018-10-21

### Added

- New docs. Still a work in progress but we're closer to having something useful.
- New CSS bundle `@minna-ui/css/dist/native.css`; same as the standard CSS bundle but also styles more native HTML elements without adding a class.
- Reintroduced the `@extend` at rule for CSS to help build the "native" CSS bundle.
- New preset for node code in `@minna-ui/eslint-config`.

### Removed

- CSS animations are no longer enabled for `s` (small) breakpoint sizes. We found they were too janky when used on low-end mobile devices.

### Changed

- New project tagline. Now with more 😸!
- Use `box-sizing: border box` on inputs by default.
- Various tweaks to `@minna-ui/eslint-config`.
- Update `@minna-ui/jest-config` to better suit the latest `sapper` changes.
- Refactor our internal `build-css` package to accommodate building from multiple entry points and to make the docs CSS.
- Rework our internal dev tooling configs to use our config presets and other internal tooling improvements.
- Updated package dependencies.

### Fixed

- Custom options not being applied properly in `@minna-ui/eslint-config`, `@minna-ui/postcss-config`, and `@minna-ui/svelte-preprocess-markup` when they contain nested options.
- Some colour variables broken.

## [0.15.3] - 2018-10-14

### Fixed

- `@minna-ui/collapse` missing from `minna-ui` meta package.

## [0.15.2] - 2018-10-14

### Fixed

- `@minna-ui/collapse` component stopped working.

## [0.15.1] - 2018-10-14

### Added

- Add `!default` to CSS variables to allow easy override

## [0.15.0] - 2018-10-14

### Added

- Ability to add CSS class and rel attribute to menu items in `@minna-ui/navbar`.
- Fire `'change'` event in `@minna-ui/switch` component when state changes.
- New text util CSS classes.

### Removed

- `fluid-text-size` CSS mixin as we generally don't recommend using this technique anymore.
- Temporarily disable many failing tests until we have the time to do a big test improvement pass.

### Changed

- Complete refactor of building CSS and our PostCSS preset. This is not something we took lightly as it significantly changes how we work with styles in the framework.
  - _Build time_ CSS variables are now "SCSS-like"; they use the `$var_name` style. You no longer need to use `:root{}` to declare variables and should instead set them at a global level or local inside a selector block.
  - You are still able to use `var()` but now it will not be removed, resulting in a clear distinction between build-time variables and run-time variables.
  - Now, under the covers, variables and at rules are combined into the same PostCSS plugin resulting in greater efficiency and easier handling of variables between rules. This also fixes long standing bugs with using CSS variables in @ rules.
  - CSS mixins work differently now.
- `@media` properties are now just simple CSS variables instead of custom media:
  - `--not-small` renamed to `$ns`
  - `--medium` renamed to `$m`
  - `--large` renamed to `$l`
- Renamed CSS variables... too many to list, please see the source code.
- Refactor `@minna-ui/svelte-preprocess-markup` with new options. Now takes a `level` option from `0` to `4`.
- Tweak default `@minna-ui/navbar` sizes.
- Change how flipping elements in implemented in CSS for better performance.
- Add/remove valid @ rules from `@minna-ui/stylelint-config`.

### Fixed

- Temporarily remove "disabled" prop from select to fix <abbr title="server side rendering">SSR</abbr>.
- Alignment of icons and menu items in `@minna-ui/navbar` not vertically centred.
- Internal `build-css` package crashes on error. Now prints error correctly for faster debugging.

## [0.14.0] - 2018-09-22

### Added

- New optional menu item property `rel` in `@minna-ui/navbar`. This is mostly intended for use with Sapper apps for `rel=prefetch`.
- 2 CSS classes to adjust white-space wrap.

### Changed

- In `@minna-ui/css`, remove screen condition and rename custom media variables:
  - `--screen-not-small` rename to `--not-small`
  - `--screen-medium` rename to `--medium`
  - `--screen-large` rename to `--large`
- Tweak `@minna-ui/navbar` size CSS variables and set logo line height to 0.
- Replace `rotate(180deg)` with `scale(-1)` to flip elements in CSS. This should result in slightly better CSS performance a saves a few bytes.
- Updated package dependencies.

### Removed

- Temporarily removed `disabled` prop on `@minna-ui/select` because it's currently broken in <abbr title="server side rendering">SSR</abbr>.
- Custom setting for `customEventAttributes` in `@minna-ui/svelte-preprocess-markup` because it was invalid.

## [0.13.0] - 2018-09-08

### Added

- New `importFilter` option to `@minna-ui/postcss-config`.
- New `id-length` rule in `@minna-ui/eslint-config` to encourage descriptive variable names.

### Changed

- Rename some component props:
  - `segment` to `current` in `@minna-ui/navbar`
  - `menuItems` signature changed; `name` is now `text` in `@minna-ui/navbar`
  - `options` to `items` in `@minna-ui/select` (conflicted with Svelte internals)
  - `__*` to `_*` in all private internal names
- Minor improvements to some components.
- Updated package dependencies.

### Removed

- Preset value for `coverageReporters` in `@minna-ui/jest-config`. Now uses Jest defaults again.

## [0.12.1] - 2018-09-01

### Fixed

- Update CSS classes in `@minna-ui/navbar` component.

## [0.12.0] - 2018-09-01

### Changed

- Rename all CSS classes so the responsive modifier is at the front instead of the end, e.g. before `.mt4-l`, now `.l-mt4`. This is an experiment and may be reverted in the next few releases. The intent is it should make it easier to read when quickly looking at markup.
- Components are now minified using Closure Compiler for smaller, faster bundles.
- Default setting for `coverageReporters` in `@minna-ui/jest-config`; add `json` and remove `lcov`.
- Use next-gen jest test runner `jest-circus` in `@minna-ui/jest-config`. Note: it's necessary to set the `JEST_CIRCUS=1` env variable to actually use it.
- Updated package dependencies.

## [0.11.1] - 2018-08-26

### Added

- Default setting for `coverageReporters` in `@minna-ui/jest-config`.

### Changed

- Change default test coverage directory from `/test/unit/coverage` to `/test/coverage` since most of the time we only do unit tests.
- Switch from Travis to Circle CI for faster and better continuous integration.
- Updated package dependencies.

## [0.11.0] - 2018-08-23

### Added

- Experimental support for submenus in `@minna-ui/navbar`.
- Add a slot in `@minna-ui/navbar` to make it easy to use custom logo markup.
- Advanced CSS optimisation in `@minna-ui/postcss-config` using `cssnano`. Some quick tests revealed cssnano yielded better results (after brotli compression) than using `clean-css` and/or `csso` during [Sapper](https://sapper.svelte.technology) export.
- New options to `@minna-ui/postcss-config`, `optimize` and `optimizeSafe`.
- Show more info with `debug` option in `@minna-ui/postcss-config`.

### Removed

- Support for `@extend` in `@minna-ui/postcss-config`. If you need this functionality you can use `@use postcss-extend-rule();` instead.

### Changed

- Optimisations in `@minna-ui/postcss-config` will now only occur in production builds for faster iterations for development.
- CSS variable `--navbar-hash-link-fix` is now `true` by default in `@minna-ui/navbar`.
- Move component CSS variables into separate files for easy reuse in multiple components.
- Improved regex in `@minna-ui/svelte-preprocess-markup`.
- Updated package dependencies.

### Fixed

- Default `importPaths` option in `@minna-ui/postcss-config` does not follow a logical order.
- CSS variables not injected for at rules in `@minna-ui/postcss-config`.
- Not able to utilise `@use` at rule in `@minna-ui/postcss-config`.

## [0.10.0] - 2018-08-01

### Changed

- Rename `@minna-ui/navbar` props:
  - `items` to `menuItems`
  - `page` to `segment`
- Updated package dependencies.

### Fixed

- `@minna-ui/svelte-preprocess-markup` breaks sapper builds.
- Whitespace collapse too aggressive in `@minna-ui/svelte-preprocess-markup` resulting in no space between text and links. Now it will always leave a single space between tags unless, new option `unsafeWhitespace` is true.
- Add active class to `@minna-ui/navbar` component home link.
- Update `@minna-ui/navbar` to work with Sapper `0.15.x`.
- Security error in `@minna-ui/jest-config` due to updated jsdom package (see <https://git.io/fNwN0>).

## [0.9.1] - 2018-07-16

### Fixed

- Fix Jest es6 modules transform when testing Svelte store.

## [0.9.0] - 2018-07-16

### Changed

- Updated package dependencies.

### Fixed

- Refactor shadows to use `box-shadow` instead of `filter: drop-shadow()`. This greatly increases scroll and rendering performance, especially on low-powered mobile devices. There were also a number of CSS variables which have changed because of this.
- Don't move navbar on scroll and `.card-hover` on hover because it can be hard to read at and hurts performance.
- Refactor navbar scroll logic to avoid excessive processing.

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

- `box-sizing: border-box` is now only set by default on styles which require it (styles with width and padding or border, such as `.con`). You now need to manually add `.bb` when required or add your own global box-sizing style.
- Remove `.link` class; always just use plain `<a>` tags.
- Overly opinionated text styles and their CSS variables:
  - `--text-rendering`
  - `--text-variant`
- Broken `.quote` blockquote styles.
- Unnecessary default grid row and column size and CSS variables:
  - `--rows`
  - `--cols`

### Changed

- New responsive breakpoints and max container widths.
- Rename CSS variables:
  - `--font-family*` to `--font-stack*`
  - `--text-size-min` to `--text-size`
  - `--text-size-max` to `--text-size-large`
  - `--navbar-link-fragment-*` to `--navbar-hash-link-*`
- Font size defaults.
- Styles are now opt-in for tables, radio and checkbox inputs, and code blocks; a class is now required.
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

- Rename `@minna-ui/toggle` component to `@minna-ui/switch`.
- Rename `--toggle-*` CSS variables to `--switch-*`.
- Convert more CSS size units to `em`.
- Simplify SVG image used to create diagonal sections.

### Fixed

- Don't style default form elements; require classes for custom form element styles.
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

- Delete `_variables-md-colour.css`.
- Removed CSS variables:
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
- Removed CSS classes:
  - `.btn-cta`
  - `.btn-dark`
  - `.btn-main`
  - `h* > small`

### Changed

- Switch to American English spelling (not British English) for CSS and component APIs to better match developer expectations.
- Rename files:
  - `_colour.css` to `_color.css`
  - `_label.css` to `_tag.css`
- Renamed CSS variables:
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
- Renamed CSS classes:
  - `.*btn*` to `.*button*`
  - `.*grey*` to `.*gray*`
  - `.card-touch` to `.card-hover`
  - `.rad` to `.rounded`
  - `.rad2` to `.rounded-large`
  - `.rad0*` to `.not-rounded*`
- All colour classes in `_color.css` have been changed.
- CSS mixin `fluid-font-size` to `fluid-text-size`.
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
- Change some white space to suit new font sizes.
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

[unreleased]: https://github.com/WeAreGenki/ui/compare/v0.19.1...HEAD
[0.19.1]: https://github.com/WeAreGenki/minna-ui/compare/v0.19.0...v0.19.1
[0.19.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.18.2...v0.19.0
[0.18.2]: https://github.com/WeAreGenki/minna-ui/compare/v0.18.1...v0.18.2
[0.18.1]: https://github.com/WeAreGenki/minna-ui/compare/v0.18.0...v0.18.1
[0.18.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.17.1...v0.18.0
[0.17.1]: https://github.com/WeAreGenki/minna-ui/compare/v0.17.0...v0.17.1
[0.17.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.16.0...v0.17.0
[0.16.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.15.3...v0.16.0
[0.15.3]: https://github.com/WeAreGenki/minna-ui/compare/v0.15.2...v0.15.3
[0.15.2]: https://github.com/WeAreGenki/minna-ui/compare/v0.15.1...v0.15.2
[0.15.1]: https://github.com/WeAreGenki/minna-ui/compare/v0.15.0...v0.15.1
[0.15.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.14.0...v0.15.0
[0.14.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.13.0...v0.14.0
[0.13.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.12.1...v0.13.0
[0.12.1]: https://github.com/WeAreGenki/minna-ui/compare/v0.12.0...v0.12.1
[0.12.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.11.1...v0.12.0
[0.11.1]: https://github.com/WeAreGenki/minna-ui/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.9.1...v0.10.0
[0.9.1]: https://github.com/WeAreGenki/minna-ui/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/WeAreGenki/minna-ui/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.4.1...v0.5.0
[0.4.1]: https://github.com/WeAreGenki/minna-ui/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/WeAreGenki/minna-ui/compare/v0.0.0...v0.1.0
