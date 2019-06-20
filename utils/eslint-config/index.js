/**
 * ESLint config preset for Minna UI projects.
 *
 * @see http://eslint.org/docs/user-guide/configuring.html
 */

/* eslint-disable sort-keys */

'use strict';

const isProd = process.env.NODE_ENV === 'production';

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

/** @type {import('./types').ESLintConfig} */
module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:jsdoc/recommended',
    'plugin:@typescript-eslint/recommended', // FIXME: Breaks tests
    'plugin:security/recommended',
  ],
  plugins: [
    'import',
    'html',
    'markdown',
    'jsdoc',
    '@typescript-eslint',
    'security',
  ],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    'html/indent': '+2',
    'html/report-bad-indent': ERROR,
    'html/xml-extensions': ['.svg', '.xhtml', 'xml'],
    'import/extensions': [
      '.mjs',
      '.js',
      '.ts',
      '.svelte',
      '.jsx',
      '.tsx',
      '.d.ts',
    ],
    'import/ignore': ['.css', '.svelte'],
    'import/resolver': {
      node: {
        extensions: [
          '.mjs',
          '.js',
          '.ts',
          '.svelte',
          '.jsx',
          '.tsx',
          '.json',
          '.css',
          '.node',
          '.d.ts',
        ],
      },
    },
    jsdoc: {
      matchingFileName: 'example.md',
    },
  },
  rules: {
    /* eslint-enable sort-keys */
    '@typescript-eslint/ban-types': [
      ERROR,
      {
        types: {
          Array: 'Use [] instead',
          Object: 'Use object or {} instead',
          String: {
            fixWith: 'string',
            message: 'Use string instead',
          },
        },
      },
    ],
    '@typescript-eslint/explicit-function-return-type': [
      ERROR,
      {
        allowExpressions: true,
        allowHigherOrderFunctions: true,
        allowTypedFunctionExpressions: true,
      },
    ],
    '@typescript-eslint/indent': [
      ERROR,
      2,
      {
        // ESTree spec node types: https://github.com/estree/estree
        // TS types: https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/typescript-estree/src/ts-estree/ast-node-types.ts
        ignoredNodes: ['ConditionalExpression *'], // incompatible with prettier :'(
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/member-ordering': ERROR,
    '@typescript-eslint/no-empty-interface': [
      ERROR,
      { allowSingleExtends: true },
    ],
    '@typescript-eslint/no-extraneous-class': ERROR,
    '@typescript-eslint/no-this-alias': ERROR,
    '@typescript-eslint/no-unused-vars': [
      WARNING,
      {
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-useless-constructor': ERROR,
    '@typescript-eslint/prefer-function-type': WARNING,
    '@typescript-eslint/unified-signatures': ERROR,
    'comma-dangle': [
      ERROR,
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline', // on multiline function params OK 👌
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'id-length': [ERROR, { exceptions: ['_'], min: 2 }], // encourage descriptive names
    'import/extensions': [
      ERROR,
      'ignorePackages', // do use file extensions
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-deprecated': WARNING,
    'import/prefer-default-export': OFF,
    'jsdoc/check-examples': WARNING,
    'jsdoc/check-indentation': WARNING,
    'jsdoc/require-description-complete-sentence': WARNING,
    'jsdoc/require-hyphen-before-param-description': WARNING,
    'jsdoc/require-jsdoc': OFF, // too annoying
    'jsdoc/require-returns': [WARNING, { forceReturnsWithAsync: true }],
    'max-len': [
      ERROR,
      {
        code: 80, // consistency with prettier
        ignorePattern: 'eslint-disable|@ts-ignore|stylelint-disable|@typedef',
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
      },
    ],
    'no-console': isProd ? ERROR : WARNING,
    'no-debugger': isProd ? ERROR : WARNING,
    'no-empty': [ERROR, { allowEmptyCatch: true }],
    'no-return-assign': [ERROR, 'except-parens'],
    'no-useless-constructor': OFF, // handled via `@typescript-eslint/no-useless-constructor`
    'object-curly-newline': [ERROR, { consistent: true }],
    'sort-keys': [ERROR, 'asc', { caseSensitive: false, natural: true }],
    /* eslint-disable sort-keys */

    // rules incompatible with prettier :'(
    'arrow-parens': OFF,
    'function-paren-newline': OFF,
    'implicit-arrow-linebreak': OFF,
    'operator-linebreak': OFF,
  },

  overrides: [
    // TypeScript
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'jsdoc/require-param-type': OFF,
        'jsdoc/require-param': OFF,
        'jsdoc/require-returns-type': OFF,
        'jsdoc/require-returns': OFF,
      },
    },

    // TypeScript declaration files
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-extraneous-class': OFF,
        'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
        'no-useless-constructor': OFF, // crashes node process
        'no-var': OFF,
        'vars-on-top': OFF,
      },
    },

    // config files
    {
      files: ['*.config.js', '*rc.js'],
      excludedFiles: ['preact.config.js', 'rollup.config.js'], // use ES modules
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        // should be node CommonJS format
        commonjs: true,
        node: true,
      },
      rules: {
        // can use any installed dependency
        'import/no-extraneous-dependencies': [
          ERROR,
          {
            devDependencies: true,
            peerDependencies: true,
          },
        ],
      },
    },

    // unit tests
    {
      files: [
        '*.spec.js',
        '*.spec.mjs',
        '*.spec.ts',
        '*.test.js',
        '*.test.jsx',
        '*.test.mjs',
        '*.test.ts',
        '*.test.tsx',
      ],
      // `extends` aren't allowed in overrides so inject the config manually
      // @ts-ignore - We don't need types here
      ...require('eslint-plugin-jest').configs.recommended, // eslint-disable-line global-require
      plugins: ['jest', 'import'],
      env: {
        jest: true,
      },
      rules: {
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
        'jest/no-commented-out-tests': WARNING,
        'jest/no-empty-title': ERROR,
        'jest/no-large-snapshots': WARNING,
        'jest/no-test-callback': WARNING,
        'jest/no-test-return-statement': WARNING,
        'jest/no-truthy-falsy': ERROR,
        'jest/prefer-called-with': WARNING,
        'jest/prefer-expect-assertions': WARNING,
        'jest/prefer-spy-on': WARNING,
        'jest/prefer-strict-equal': WARNING,
        'jest/prefer-to-be-null': ERROR,
        'jest/prefer-to-be-undefined': ERROR,
        'jest/prefer-to-contain': ERROR,
        'jest/prefer-to-have-length': ERROR,
        'jest/prefer-todo': ERROR,
        'max-len': [
          ERROR,
          {
            code: 100, // consistency with prettier override
            ignorePattern:
              'eslint-disable|@ts-ignore|stylelint-disable|@typedef',
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreTrailingComments: true,
            ignoreUrls: true,
          },
        ],
        'no-new': OFF, // allow testing constructors
      },
    },

    // unit test snapshots
    {
      files: ['*.snap'],
      rules: {
        quotes: OFF,
      },
    },

    // raw html files (without transpiling)
    {
      files: ['*.html'],
      parserOptions: {
        // https://github.com/BenoitZugmeyer/eslint-plugin-html#multiple-scripts-tags-in-a-html-file
        sourceType: 'module',
      },
      env: {
        browser: true,
        commonjs: false,
        es6: false,
        node: false,
      },
      rules: {
        'comma-dangle': [ERROR, 'never'],
        'func-names': OFF,
        'object-shorthand': [ERROR, 'never'],
        'prefer-arrow-callback': OFF,
        'prefer-destructuring': OFF,
        'no-var': OFF,
      },
    },

    // autogenerated declaration files
    {
      files: ['*.css.d.ts', '*.pcss.d.ts'],
      rules: {
        '@typescript-eslint/member-delimiter-style': OFF,
      },
    },

    // markdown documentation files
    {
      files: ['*.md'],
      rules: {
        // disable rules that don't make sense in code snippets
        '@typescript-eslint/indent': OFF, // FIXME: Remove once fixed - https://github.com/gajus/eslint-plugin-jsdoc/issues/211
        'import/no-extraneous-dependencies': OFF,
        'import/no-unresolved': OFF,
        strict: OFF,
      },
    },

    // ES module files
    {
      files: ['*.mjs'],
      parserOptions: {
        sourceType: 'module',
      },
      env: {
        commonjs: false,
      },
    },
  ],
};
