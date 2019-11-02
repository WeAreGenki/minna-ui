/**
 * Minna UI Jest ESLint config add-on.
 *
 * @file This config is an add-on which should extend the base config preset.
 * Provides extra config for Jest unit tests.
 *
 * Because this file in `require()`'d in an override in the main config, it
 * should not use the `extends` option because it's not allowed in overrides.
 *
 * @see https://eslint.org/docs/user-guide/configuring
 *
 * @todo Keep up to date with upstream config, <https://git.io/fjp08>.
 */

/* eslint-disable sort-keys */

'use strict';

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
  plugins: ['jest'],
  env: {
    jest: true,
    'jest/globals': true,
  },
  rules: {
    '@typescript-eslint/no-magic-numbers': OFF, // Too verbose for tests
    'import/first': OFF, // OK to set up mocks before imports
    'import/no-extraneous-dependencies': [
      ERROR,
      {
        devDependencies: true,
        peerDependencies: true,
      },
    ],
    'jest/consistent-test-it': ERROR,
    'jest/expect-expect': ERROR,
    'jest/lowercase-name': [WARNING, { ignore: ['describe'] }],
    'jest/no-alias-methods': WARNING,
    'jest/no-commented-out-tests': WARNING,
    'jest/no-disabled-tests': WARNING,
    'jest/no-export': ERROR,
    'jest/no-focused-tests': ERROR,
    'jest/no-identical-title': ERROR,
    'jest/no-if': WARNING,
    'jest/no-jasmine-globals': WARNING,
    'jest/no-jest-import': ERROR,
    'jest/no-mocks-import': WARNING,
    'jest/no-standalone-expect': ERROR,
    'jest/no-test-callback': WARNING,
    'jest/no-test-prefixes': ERROR,
    'jest/no-test-return-statement': WARNING,
    'jest/no-truthy-falsy': ERROR,
    'jest/no-try-expect': ERROR,
    'jest/prefer-called-with': WARNING,
    'jest/prefer-expect-assertions': WARNING,
    'jest/prefer-spy-on': WARNING,
    'jest/prefer-strict-equal': WARNING,
    'jest/prefer-to-be-null': ERROR,
    'jest/prefer-to-be-undefined': ERROR,
    'jest/prefer-to-contain': ERROR,
    'jest/prefer-to-have-length': ERROR,
    'jest/prefer-todo': ERROR,
    'jest/valid-describe': ERROR,
    'jest/valid-expect-in-promise': ERROR,
    'jest/valid-expect': ERROR,
    'jest/valid-title': ERROR,
    'max-len': [
      ERROR,
      {
        code: 100, // Consistency with prettier override
        ignorePattern:
          'eslint-disable|eslint-enable|@ts-ignore|stylelint-disable|@typedef',
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
      },
    ],
    'no-new': OFF, // Allows testing constructors
    'no-tabs': OFF, // We can't always control whitespace generation
  },
};
