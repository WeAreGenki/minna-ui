/**
 * @file Upstream types use an old version of rollup which is incompatible with
 * the current version's types so we define it ourself here.
 *
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/rollup-plugin-json
 */

import { Plugin } from 'rollup';

declare namespace json {
  interface Options {
    /**
     * All JSON files will be parsed by default, but you can also specifically
     * include/exclude files.
     */
    include?: string | string[];
    exclude?: string | string[];
    /**
     * For tree-shaking, properties will be declared as variables, using either
     * `var` or `const`.
     *
     * @default false
     */
    preferConst?: boolean;
    /**
     * Specify indentation for the generated default export — defaults to '\t'.
     *
     * @default '\t'
     */
    indent?: string;
  }
}

declare function json(options?: json.Options): Plugin;
export = json;
