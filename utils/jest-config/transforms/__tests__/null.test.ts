/** @jest-environment node */

import fs from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { process } from '../null.js';

// eslint-disable-next-line security/detect-non-literal-fs-filename
const readFile = promisify(fs.readFile);
const sourcePath = join(__dirname, '../fixtures/styles.css');

let source = '';

beforeAll(async () => {
  source = await readFile(sourcePath, 'utf8');
});

describe('Null transform', () => {
  it('outputs empty content when importing CSS', () => {
    // @ts-ignore - Function has no arguments which is expected
    const styles = process(source, sourcePath);
    expect(styles).toEqual('');
  });
});
