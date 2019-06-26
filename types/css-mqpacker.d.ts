/* eslint-disable @typescript-eslint/no-explicit-any */

declare function cssMQPacker(...args: any[]): any;
declare namespace cssMQPacker {
  function pack(css: any, opts: any): any;
  const postcss: any;
  function process(css: any, processOpts: any, pluginOpts: any): any;
}
export = cssMQPacker;
