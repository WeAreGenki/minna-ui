/* eslint-disable @typescript-eslint/no-explicit-any, no-redeclare */

declare function postcssFlexbugFixes(...args: any[]): any;
declare namespace postcssFlexbugFixes {
  function process(css: any, processOpts: any, pluginOpts: any): any;
}
export = postcssFlexbugFixes;
