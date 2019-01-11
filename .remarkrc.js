// https://github.com/remarkjs/remark-lint/blob/master/doc/rules.md

'use strict';

module.exports = {
  plugins: [
    '@minna-ui/remarklint-config',

    // rules
    ['lint-no-file-name-irregular-characters', '\\.a-zA-Z0-9-_'], // need underscore for docs
  ],
};
