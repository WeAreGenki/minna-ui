/* eslint-disable @typescript-eslint/no-explicit-any, no-redeclare */

declare function postcssAdvancedVariables(...args: any[]): any;
declare namespace postcssAdvancedVariables {
  function process(css: any, processOpts: any, pluginOpts: any): any;
}
export = postcssAdvancedVariables;
