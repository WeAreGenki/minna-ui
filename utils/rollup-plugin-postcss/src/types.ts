import { Plugin, ProcessOptions } from 'postcss';

// In the ConfigContext, these three options can be instances of the
// appropriate class, or strings. If they are strings, postcss-load-config will
// require() them and pass the instances along.
interface ProcessOptionsPreload {
  parser?: string | ProcessOptions['parser'];
  stringifier?: string | ProcessOptions['stringifier'];
  syntax?: string | ProcessOptions['syntax'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins?: Plugin<any>[] | { [plugin: string]: any };
}

// The remaining ProcessOptions, sans the three above.
type RemainingProcessOptions = Pick<
ProcessOptions,
Exclude<keyof ProcessOptions, keyof ProcessOptionsPreload>
>;

// Additional context options that postcss-load-config understands.
interface Context {
  cwd?: string;
  env?: string;
}

// The full shape of the ConfigContext.
export type ConfigContext = Context &
ProcessOptionsPreload &
RemainingProcessOptions;

export interface RollupPostcssOptions extends ConfigContext {
  /** Files to exclude from processing. */
  exclude?: RegExp[] | string[];
  /** Files to include in processing. */
  include?: RegExp[] | string[];
}
