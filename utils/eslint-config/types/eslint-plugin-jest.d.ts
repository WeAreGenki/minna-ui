export const configs: {
  recommended: {
    env: {
      "jest/globals": boolean;
    };
    plugins: string[];
    rules: {
      "jest/no-alias-methods": string;
      "jest/no-disabled-tests": string;
      "jest/no-focused-tests": string;
      "jest/no-identical-title": string;
      "jest/no-jasmine-globals": string;
      "jest/no-jest-import": string;
      "jest/no-test-prefixes": string;
      "jest/valid-describe": string;
      "jest/valid-expect": string;
      "jest/valid-expect-in-promise": string;
    };
  };
  style: {
    plugins: string[];
    rules: {
      "jest/prefer-to-be-null": string;
      "jest/prefer-to-be-undefined": string;
      "jest/prefer-to-contain": string;
      "jest/prefer-to-have-length": string;
    };
  };
};
export const environments: {
  globals: {
    globals: {
      afterAll: boolean;
      afterEach: boolean;
      beforeAll: boolean;
      beforeEach: boolean;
      describe: boolean;
      expect: boolean;
      fit: boolean;
      it: boolean;
      jasmine: boolean;
      jest: boolean;
      pending: boolean;
      pit: boolean;
      require: boolean;
      test: boolean;
      xdescribe: boolean;
      xit: boolean;
      xtest: boolean;
    };
  };
};
export const processors: {
  ".snap": {
    postprocess: Function;
    preprocess: Function;
  };
};
export const rules: {
  "consistent-test-it": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
      schema: any[];
    };
  };
  "expect-expect": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      schema: any[];
    };
  };
  "lowercase-name": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "no-alias-methods": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "no-disabled-tests": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "no-focused-tests": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "no-hooks": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
    schema: {
      additionalProperties: any;
      properties: any;
      type: any;
    }[];
  };
  "no-identical-title": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "no-jasmine-globals": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
      messages: {
        illegalFail: any;
        illegalGlobal: any;
        illegalJasmine: any;
        illegalMethod: any;
        illegalPending: any;
      };
    };
  };
  "no-jest-import": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "no-large-snapshots": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "no-test-callback": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "no-test-prefixes": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "no-test-return-statement": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "no-truthy-falsy": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "prefer-called-with": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "prefer-expect-assertions": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "prefer-inline-snapshots": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "prefer-spy-on": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "prefer-strict-equal": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "prefer-to-be-null": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "prefer-to-be-undefined": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "prefer-to-contain": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "prefer-to-have-length": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "prefer-todo": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
      fixable: string;
    };
  };
  "require-tothrow-message": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "valid-describe": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "valid-expect": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
  "valid-expect-in-promise": {
    create: Function;
    meta: {
      docs: {
        url: any;
      };
    };
  };
};
