/**
 * ESLint config preset for Minna UI projects.
 */

/* eslint-disable sort-keys */

// @ts-ignore Package does not need types
import jestPlugin from 'eslint-plugin-jest';

const isProd = process.env.NODE_ENV === 'production';

export = {
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'plugin:security/recommended',
  ],
  plugins: [
    'security',
    'import',
    'html',
    'markdown',
    'jsdoc',
    '@typescript-eslint',
  ],
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es6: true,
  },
  settings: {
    'html/indent': '+2',
    'html/report-bad-indent': 'error',
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
  },
  rules: {
    /* eslint-enable sort-keys */
    '@typescript-eslint/ban-types': [
      'error',
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
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        ignoredNodes: ['ConditionalExpression *'], // incompatible with prettier :'(
        SwitchCase: 1,
      },
    ],
    '@typescript-eslint/interface-name-prefix': ['error', 'always'],
    '@typescript-eslint/member-ordering': 'error',
    '@typescript-eslint/no-empty-interface': [
      'error',
      { allowSingleExtends: true },
    ],
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/prefer-function-type': 'warn',
    '@typescript-eslint/unified-signatures': 'error',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        exports: 'always-multiline',
        functions: 'only-multiline', // comma on multiline function params is OK 👌
        imports: 'always-multiline',
        objects: 'always-multiline',
      },
    ],
    'id-length': ['error', { exceptions: ['_'], min: 2 }], // encourage descriptive names
    'import/extensions': [
      'error',
      'ignorePackages', // do use file extensions
      {
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/no-deprecated': 'warn',
    'import/prefer-default-export': 'off',
    indent: 'off', // use `@typescript-eslint/indent` instead
    'jsdoc/check-examples': 'warn',
    'jsdoc/check-param-names': 'warn',
    'jsdoc/check-tag-names': 'warn',
    'jsdoc/check-types': 'warn',
    'jsdoc/newline-after-description': ['warn', 'never'],
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-name': 'warn',
    'jsdoc/require-param-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-check': 'warn',
    'jsdoc/require-returns-type': 'warn',
    'jsdoc/valid-types': 'warn',
    'max-len': [
      'error',
      {
        code: 80, // consistency with prettier
        ignorePattern: 'eslint-disable',
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: true,
        ignoreUrls: true,
      },
    ],
    'no-console': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-debugger': /* istanbul ignore next */ isProd ? 'error' : 'warn',
    'no-return-assign': ['error', 'except-parens'],
    'object-curly-newline': ['error', { consistent: true }],
    'sort-keys': ['error', 'asc', { caseSensitive: false, natural: true }],
    /* eslint-disable sort-keys */

    // rules incompatible with prettier :'(
    'arrow-parens': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'operator-linebreak': 'off',
  },

  overrides: [
    // TypeScript
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'jsdoc/require-param': 'off',
        'jsdoc/require-returns': 'off',
      },
    },

    // TypeScript declaration files
    {
      files: ['*.d.ts'],
      rules: {
        '@typescript-eslint/no-extraneous-class': 'off',
        'no-useless-constructor': 'off', // crashes node process
        'no-var': 'off',
        'vars-on-top': 'off',
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
          'error',
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
      // eslint doesn't allow `extends` in overrides but we're being sneaky
      ...jestPlugin.configs.recommended,
      plugins: ['jest', 'import'],
      env: {
        jest: true,
      },
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          {
            devDependencies: true,
            peerDependencies: true,
          },
        ],
        'max-len': [
          'error',
          {
            code: 100, // consistency with prettier override
            ignorePattern: 'eslint-disable',
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreTrailingComments: true,
            ignoreUrls: true,
          },
        ],
        'no-new': 'off', // allow testing constructors
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
        'comma-dangle': ['error', 'never'],
        'func-names': 'off',
        'object-shorthand': ['error', 'never'],
        'prefer-arrow-callback': 'off',
        'prefer-destructuring': 'off',
        'no-var': 'off',
      },
    },

    // autogenerated declaration files
    {
      files: ['*.css.d.ts'],
      rules: {
        '@typescript-eslint/member-delimiter-style': 'off',
      },
    },

    // markdown documentation files
    {
      files: ['*.md'],
      rules: {
        // turns off rules that don't make sense in code snippets
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        strict: 'off',
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
