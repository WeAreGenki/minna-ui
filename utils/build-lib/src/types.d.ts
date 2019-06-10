import rollup from 'rollup';

export interface BuildLibResult {
  main?: rollup.RollupOutput;
  module?: rollup.RollupOutput;
}

export interface BuildLibProps {
  external: string[];
  input: string;
  name: string;
  pkgMain?: string;
  pkgModule?: string;
  pkgTypes?: string;
  plugins: rollup.Plugin[];
  sourcemap: boolean;
}
