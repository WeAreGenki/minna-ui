import rollup from 'rollup';

export interface BuildLibResult {
  main?: rollup.RollupOutput;
  module?: rollup.RollupOutput;
}

type ExternalCheck = (id: string) => boolean;

export interface BuildLibProps {
  external: string[] | ExternalCheck;
  input: string;
  name: string;
  pkgMain?: string;
  pkgModule?: string;
  pkgTypes?: string;
  plugins: rollup.Plugin[];
  sourcemap: boolean;
}
