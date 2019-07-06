/**
 * ESLint config preset for Minna UI projects.
 *
 * @see http://eslint.org/docs/user-guide/configuring.html
 */

/* eslint-disable @typescript-eslint/no-magic-numbers, sort-keys */

'use strict';

const { join } = require('path');

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

/** @type {import('./types').ESLintConfig} */
module.exports = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:jsdoc/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
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
    'import/cache': Infinity, // Only OK when not using long running processes e.g. eslint-loader
    'import/extensions': [
      '.mjs',
      '.js',
      '.ts',
      '.svelte',
      '.jsx',
      '.tsx',
      '.d.ts',
    ],
    'import/ignore': ['.css', '.pcss', '.svelte'],
    'import/resolver': {
      [join(__dirname, 'import-resolver.js')]: {
        alias: {
          '^##\\/(.*)$': 'src/$1',
        },
        extensions: [
          '.mjs',
          '.js',
          '.ts',
          '.svelte',
          '.jsx',
          '.tsx',
          '.json',
          '.css',
          '.pcss',
          '.node',
          '.d.ts',
        ],
      },
    },
    jsdoc: {
      additionalTagNames: {
        customTags: ['externs', 'jest-environment', 'jsx'],
      },
      matchingFileName: 'example.md',
    },
  },
  rules: {
    /* eslint-enable sort-keys */
    '@typescript-eslint/ban-ts-ignore': WARNING,
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
        // ESTree spec: https://github.com/estree/estree
        // TS node types: https://git.io/fj6bE
        ignoredNodes: ['ConditionalExpression *'], // Prettier :'(
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/member-ordering': ERROR,
    '@typescript-eslint/no-empty-function': ERROR,
    '@typescript-eslint/no-empty-interface': [
      ERROR,
      { allowSingleExtends: true },
    ],
    '@typescript-eslint/no-extraneous-class': ERROR,
    '@typescript-eslint/no-magic-numbers': [
      WARNING,
      {
        detectObjects: false,
        enforceConst: false,
        ignore: [-1, 0, 1],
        ignoreArrayIndexes: true,
        ignoreEnums: true,
        ignoreNumericLiteralTypes: true,
      },
    ],
    '@typescript-eslint/no-this-alias': ERROR,
    '@typescript-eslint/no-unused-vars': [
      WARNING,
      {
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    '@typescript-eslint/no-useless-constructor': ERROR,
    '@typescript-eslint/prefer-for-of': WARNING,
    '@typescript-eslint/prefer-function-type': WARNING,
    '@typescript-eslint/unified-signatures': ERROR,
    'comma-dangle': [
      ERROR,
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline', // On multiline function params is OK 👌
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'id-length': [ERROR, { exceptions: ['_'], min: 2 }], // Encourage descriptive names
    'import/extensions': [
      ERROR,
      'ignorePackages', // Do use file extensions
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
    'jsdoc/require-jsdoc': OFF, // Far too annoying
    'jsdoc/require-returns': [WARNING, { forceReturnsWithAsync: true }],
    'max-len': [
      ERROR,
      {
        code: 80, // Consistency with prettier
        ignorePattern: 'eslint-disable|@ts-ignore|stylelint-disable|@typedef',
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
      },
    ],
    'no-console': ERROR,
    'no-debugger': ERROR,
    'no-empty': [ERROR, { allowEmptyCatch: true }],
    'no-magic-numbers': OFF, // Handled by `@typescript-eslint/no-magic-numbers`
    'no-return-assign': [ERROR, 'except-parens'],
    'no-useless-constructor': OFF, // Handled by `@typescript-eslint/no-useless-constructor`
    'object-curly-newline': [ERROR, { consistent: true }],
    'sort-keys': [WARNING, 'asc', { caseSensitive: false, natural: true }],
    /* eslint-disable sort-keys */

    // Rules incompatible with prettier :'(
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
        '@typescript-eslint/no-require-imports': ERROR,
        'jsdoc/no-types': ERROR,
        'jsdoc/require-param': OFF,
        'jsdoc/require-param-type': OFF,
        'jsdoc/require-returns': OFF,
        'jsdoc/require-returns-type': OFF,
        'lines-between-class-members': [
          ERROR,
          'always',
          { exceptAfterSingleLine: true }, // Useful to declare class member types
        ],
      },
    },

    // TypeScript declaration files
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-extraneous-class': OFF,
        'import/no-extraneous-dependencies': [ERROR, { devDependencies: true }],
        'no-useless-constructor': OFF, // Crashes node process
        'no-var': OFF,
        'vars-on-top': OFF,
      },
    },

    // Config files
    {
      files: ['*.config.js', '*rc.js'],
      excludedFiles: ['preact.config.js', 'rollup.config.js'], // Use ES modules
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        // Should be node CommonJS format
        commonjs: true,
        node: true,
      },
      rules: {
        // Can use any installed dependency
        'import/no-extraneous-dependencies': [
          ERROR,
          {
            devDependencies: true,
            peerDependencies: true,
          },
        ],
      },
    },

    // Unit tests
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
      // Using `extends` isn't allowed in overrides; inject config manually
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore - We don't care about types here
      ...require('eslint-plugin-jest').configs.recommended, // eslint-disable-line global-require
      plugins: ['jest', 'import'],
      env: {
        jest: true,
      },
      rules: {
        '@typescript-eslint/no-magic-numbers': OFF, // Too verbose for short unit tests
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
            code: 100, // Consistency with prettier override
            ignorePattern:
              'eslint-disable|@ts-ignore|stylelint-disable|@typedef',
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreTrailingComments: true,
            ignoreUrls: true,
          },
        ],
        'no-new': OFF, // Allows testing constructors
      },
    },

    // Unit test snapshots
    {
      files: ['*.snap'],
      rules: {
        quotes: OFF,
        strict: OFF,
      },
    },

    // Raw HTML (without transpiling)
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
        'eol-last': OFF,
        'func-names': OFF,
        'no-var': OFF,
        'object-shorthand': [ERROR, 'never'],
        'prefer-arrow-callback': OFF,
        'prefer-destructuring': OFF,
      },
    },

    // Auto-generated declarations
    {
      files: ['*.css.d.ts', '*.pcss.d.ts'],
      rules: {
        '@typescript-eslint/member-delimiter-style': OFF,
      },
    },

    // Markdown documentation files
    {
      files: ['*.md'],
      parserOptions: {
        ecmaFeatures: {
          impliedStrict: true,
        },
      },
      rules: {
        // Disable rules that don't make sense in code snippets
        '@typescript-eslint/indent': OFF, // FIXME: Remove once fixed - https://github.com/gajus/eslint-plugin-jsdoc/issues/211
        '@typescript-eslint/no-var-requires': OFF,
        'import/no-extraneous-dependencies': OFF,
        'import/no-unresolved': OFF,
        'no-console': OFF,
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
      rules: {
        '@typescript-eslint/no-require-imports': ERROR,
      },
    },

    // JSX
    {
      files: ['*.jsx', '*.tsx'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  ],
};
