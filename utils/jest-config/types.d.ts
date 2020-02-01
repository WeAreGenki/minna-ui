import {
  TransformOptions,
  TransformedSource,
} from '@jest/transform/build/types';
import { Config } from '@jest/types';

type JestTransformer = (
  sourceText: string,
  sourcePath: Config.Path,
  config?: Config.ProjectConfig,
  options?: TransformOptions,
) => TransformedSource;
