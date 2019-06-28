/* eslint-disable @typescript-eslint/no-explicit-any */

declare function postcssUse(...args: any[]): any;
declare namespace postcssUse {
  function process(css: any, processOpts: any, pluginOpts: any): any;
}
export = postcssUse;
