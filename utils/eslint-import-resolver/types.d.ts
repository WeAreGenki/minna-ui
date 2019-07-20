import { SyncOpts } from 'resolve';

interface ImportAlias {
  [regex: string]: string;
}

export interface ResolverOptions extends SyncOpts {
  alias: ImportAlias;
}

export interface ResolverResult {
  found: boolean;
  path?: string | null;
}
