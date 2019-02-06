// https://stylelint.io/user-guide/configuration/

'use strict';

module.exports = {
  extends: '@minna-ui/stylelint-config',
  rules: {
    // workaround because we have a lot of single line rules
    'rule-empty-line-before': [
      'always-multi-line',
      {
        except: ['after-single-line-comment', 'first-nested'],
        ignore: ['after-comment'],
      },
    ],
  },
};
