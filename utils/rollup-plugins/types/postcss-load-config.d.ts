import postcss from 'postcss';

declare function index(
  ctx?: postcss.ProcessOptions,
  path?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: any,
): Promise<{
  plugins: postcss.AcceptedPlugin[];
  options: postcss.ProcessOptions;
}>;

export = index;
