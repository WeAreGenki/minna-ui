// https://facebook.github.io/jest/docs/en/configuration.html

'use strict';

module.exports = {
  preset: '@minna-ui/jest-config',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
};
