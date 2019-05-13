/**
 * Stylelint config preset for Minna UI projects.
 */

// TODO: Write tests for any particularly custom rules or rules with regexes

// https://stylelint.io/user-guide/configuration/

export = {
  extends: ['stylelint-config-standard', 'stylelint-config-css-modules'],
  plugins: [
    'stylelint-a11y',
    'stylelint-declaration-strict-value',
    'stylelint-high-performance-animation',
    'stylelint-order',
  ],
  reportNeedlessDisables: true,
  rules: {
    'a11y/content-property-no-static-value': [true, { severity: 'warning' }],
    'a11y/font-size-is-readable': [true, { severity: 'warning' }],
    'a11y/line-height-is-vertical-rhythmed': [true, { severity: 'warning' }],
    // autofix broken 👎
    // 'a11y/media-prefers-reduced-motion': [true, { severity: 'warning' }],
    'a11y/no-display-none': [true, { severity: 'warning' }],
    'a11y/no-obsolete-attribute': [true, { severity: 'warning' }],
    'a11y/no-obsolete-element': [true, { severity: 'warning' }],
    'a11y/no-outline-none': true,
    'a11y/no-spread-text': [true, { severity: 'warning' }],
    'a11y/no-text-align-justify': [true, { severity: 'warning' }],
    'a11y/selector-pseudo-class-focus': true,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'content',
          'each',
          'else',
          'for',
          'if',
          'include',
          'mixin',
          'use',
        ],
      },
    ],
    'at-rule-no-vendor-prefix': true,
    'at-rule-semicolon-space-before': 'never',
    'color-named': 'never',
    'color-no-hex': true, // only rgb() or rgba()
    'comment-empty-line-before': null, // not helpful for rapid development
    'declaration-block-semicolon-newline-before': 'never-multi-line',
    'declaration-block-semicolon-space-after': 'always-single-line',
    'declaration-no-important': true,
    'font-family-name-quotes': 'always-where-recommended',
    'font-weight-notation': 'numeric',
    'function-blacklist': ['hsl', 'hsla'], // only rgb() or rgba()
    'function-url-no-scheme-relative': true,
    'function-url-quotes': 'always',
    'max-line-length': [
      80,
      {
        ignorePattern: ['/https?:\\/\\/[0-9,a-z]*.*/i', '/stylelint-disable/'],
      },
    ],
    'media-feature-name-no-vendor-prefix': true,
    'media-feature-parentheses-space-inside': 'never',
    'media-feature-range-operator-space-after': 'always',
    'media-feature-range-operator-space-before': 'always',
    'no-descending-specificity': true,
    'no-duplicate-selectors': true,
    'plugin/no-low-performance-animation-properties': true,
    'property-no-unknown': true,
    'property-no-vendor-prefix': true,
    'rule-empty-line-before': [
      'always',
      {
        except: ['after-single-line-comment', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
    // enforce the use of variables or functions for common values
    'scale-unlimited/declaration-strict-value': [
      ['/color/', 'fill', 'font-size', 'stroke', 'z-index'],
      {
        ignoreKeywords: {
          '/color/': ['currentColor', 'inherit', 'unset'],
          fill: ['currentColor', 'inherit', 'none', 'unset'],
          'font-size': ['inherit', 'initial', 'unset'],
          stroke: ['currentColor', 'inherit', 'none', 'unset'],
          'z-index': [-1, 0, 1, 'auto', 'initial'],
        },
      },
    ],
    'selector-attribute-quotes': 'always',
    'selector-list-comma-newline-before': 'never-multi-line',
    'selector-list-comma-space-after': 'always-single-line',
    'selector-list-comma-space-before': 'never-single-line',
    'selector-max-attribute': 2,
    'selector-max-class': 4,
    'selector-max-combinators': 3,
    'selector-max-compound-selectors': 4,
    'selector-max-id': 0,
    'selector-max-type': 2,
    'selector-max-universal': 0,
    'selector-no-qualifying-type': [true, { ignore: ['attribute'] }],
    'selector-no-vendor-prefix': true,
    'string-quotes': 'single',
    'value-keyword-case': ['lower', { ignoreProperties: '/font/' }],
    'value-list-comma-newline-after': 'always-multi-line',
    'value-list-comma-newline-before': 'never-multi-line',
    'value-no-vendor-prefix': true,

    // eslint-disable-next-line sort-keys
    'order/order': [
      { name: 'import', type: 'at-rule' },
      'dollar-variables',
      'custom-properties',
      { hasBlock: false, type: 'at-rule' },
      'declarations',
      { name: 'if', type: 'at-rule' },
      'rules',
      { hasBlock: true, type: 'at-rule' },
    ],
    'order/properties-order': [
      {
        groupName: 'position',
        properties: ['position', 'top', 'right', 'bottom', 'left', 'z-index'],
      },
      {
        groupName: 'display and box model',
        properties: ['box-sizing', 'display'],
      },
      {
        groupName: 'flexbox layout',
        properties: [
          'flex',
          'flex-align',
          'flex-basis',
          'flex-direction',
          'flex-wrap',
          'flex-flow',
          'flex-grow',
          'flex-order',
          'flex-pack',
        ],
      },
      {
        groupName: 'grid layout',
        properties: [
          'grid',
          'grid-auto-flow',
          'grid-auto-rows',
          'grid-auto-columns',
          'grid-area',
          'grid-row',
          'grid-row-start',
          'grid-row-end',
          'grid-column',
          'grid-column-start',
          'grid-column-end',
          'grid-gap',
          'grid-row-gap',
          'grid-column-gap',
          'grid-template',
          'grid-template-areas',
          'grid-template-rows',
          'grid-template-columns',
        ],
      },
      {
        groupName: 'layout alignment (for both flexbox and css grid)',
        properties: [
          'justify-items',
          'justify-self',
          'grid-auto-flow',
          'align-items',
          'align-self',
          'justify-content',
          'order',
        ],
      },
      {
        groupName: 'whitespace, overflow, and layout',
        properties: [
          'float',
          'width',
          'min-width',
          'max-width',
          'height',
          'min-height',
          'max-height',
          'padding',
          'padding-top',
          'padding-right',
          'padding-bottom',
          'padding-left',
          'margin',
          'margin-top',
          'margin-right',
          'margin-bottom',
          'margin-left',
          'overflow',
          'overflow-x',
          'overflow-y',
          '-webkit-overflow-scrolling',
          '-ms-overflow-x',
          '-ms-overflow-y',
          '-ms-overflow-style',
          'clip',
          'clear',
        ],
      },
      {
        groupName: 'typography',
        properties: [
          'font',
          'font-family',
          'font-size',
          'font-style',
          'font-weight',
          'font-variant',
          'font-size-adjust',
          'font-stretch',
          'font-effect',
          'font-emphasize',
          'font-emphasize-position',
          'font-emphasize-style',
          'font-smooth',
          'hyphens',
          'line-height',
          'color',
          'text-align',
          'text-align-last',
          'text-emphasis',
          'text-emphasis-color',
          'text-emphasis-style',
          'text-emphasis-position',
          'text-decoration',
          'text-indent',
          'text-justify',
          'text-outline',
          '-ms-text-overflow',
          'text-overflow',
          'text-overflow-ellipsis',
          'text-overflow-mode',
          'text-shadow',
          'text-transform',
          'text-wrap',
          '-webkit-text-size-adjust',
          '-ms-text-size-adjust',
          'letter-spacing',
          '-ms-word-break',
          'word-break',
          'word-spacing',
          '-ms-word-wrap',
          'word-wrap',
          'overflow-wrap',
          'tab-size',
          'white-space',
          'vertical-align',
          'list-style',
          'list-style-position',
          'list-style-type',
          'list-style-image',
        ],
      },
      {
        groupName: 'accessibility and interactions',
        properties: [
          'pointer-events',
          '-ms-touch-action',
          'touch-action',
          'cursor',
          'visibility',
          'zoom',
          'table-layout',
          'empty-cells',
          'caption-side',
          'border-spacing',
          'border-collapse',
          'content',
          'quotes',
          'counter-reset',
          'counter-increment',
          'resize',
          'user-select',
          'nav-index',
          'nav-up',
          'nav-right',
          'nav-down',
          'nav-left',
        ],
      },
      {
        groupName: 'background and borders',
        properties: [
          'background',
          'background-color',
          'background-image',
          'filter',
          'background-repeat',
          'background-attachment',
          'background-position',
          'background-position-x',
          'background-position-y',
          'background-clip',
          'background-origin',
          'background-size',
          'border',
          'border-color',
          'border-style',
          'border-width',
          'border-top',
          'border-top-color',
          'border-top-style',
          'border-top-width',
          'border-right',
          'border-right-color',
          'border-right-style',
          'border-right-width',
          'border-bottom',
          'border-bottom-color',
          'border-bottom-style',
          'border-bottom-width',
          'border-left',
          'border-left-color',
          'border-left-style',
          'border-left-width',
          'border-radius',
          'border-top-left-radius',
          'border-top-right-radius',
          'border-bottom-right-radius',
          'border-bottom-left-radius',
          'border-image',
          'border-image-source',
          'border-image-slice',
          'border-image-width',
          'border-image-outset',
          'border-image-repeat',
          'outline',
          'outline-width',
          'outline-style',
          'outline-color',
          'outline-offset',
          'box-shadow',
          'opacity',
          '-ms-interpolation-mode',
        ],
      },
      {
        groupName: 'SVG presentation attributes',
        properties: [
          'alignment-baseline',
          'baseline-shift',
          'dominant-baseline',
          'text-anchor',
          'word-spacing',
          'writing-mode',
          'fill',
          'fill-opacity',
          'fill-rule',
          'stroke',
          'stroke-dasharray',
          'stroke-dashoffset',
          'stroke-linecap',
          'stroke-linejoin',
          'stroke-miterlimit',
          'stroke-opacity',
          'stroke-width',
          'color-interpolation',
          'color-interpolation-filters',
          'color-profile',
          'color-rendering',
          'flood-color',
          'flood-opacity',
          'image-rendering',
          'lighting-color',
          'marker-start',
          'marker-mid',
          'marker-end',
          'mask',
          'shape-rendering',
          'stop-color',
          'stop-opacity',
        ],
      },
      {
        groupName: 'animation',
        properties: [
          'transition',
          'transition-delay',
          'transition-timing-function',
          'transition-duration',
          'transition-property',
          'transform',
          'transform-origin',
          'animation',
          'animation-name',
          'animation-duration',
          'animation-play-state',
          'animation-timing-function',
          'animation-delay',
          'animation-iteration-count',
          'animation-direction',
        ],
      },
    ],
  },
};