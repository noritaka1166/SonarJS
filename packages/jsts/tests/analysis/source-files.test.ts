/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2025 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the Sonar Source-Available License Version 1, as published by SonarSource SA.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the Sonar Source-Available License for more details.
 *
 * You should have received a copy of the Sonar Source-Available License
 * along with this program; if not, see https://sonarsource.com/license/ssal/
 */
import { beforeEach, describe, it } from 'node:test';
import { expect } from 'expect';
import { join } from 'node:path/posix';
import {
  initFileStores,
  sourceFileStore,
} from '../../src/analysis/projectAnalysis/file-stores/index.js';
import { setGlobalConfiguration } from '../../../shared/src/helpers/configuration.js';
import { toUnixPath } from '../../../shared/src/helpers/files.js';
import { UNINITIALIZED_ERROR } from '../../src/analysis/projectAnalysis/file-stores/source-files.js';

const fixtures = join(import.meta.dirname, 'fixtures');

describe('files', () => {
  beforeEach(() => {
    sourceFileStore.clearCache();
  });
  it('should crash getting files before initializing', async () => {
    expect(() => sourceFileStore.getFoundFilenames()).toThrow(new Error(UNINITIALIZED_ERROR));
    expect(() => sourceFileStore.getFoundFilesCount()).toThrow(new Error(UNINITIALIZED_ERROR));
    expect(() => sourceFileStore.getFoundFiles()).toThrow(new Error(UNINITIALIZED_ERROR));
  });

  it('should return the files', async () => {
    await initFileStores(join(fixtures, 'paths'));
    expect(sourceFileStore.getFoundFilesCount()).toEqual(2);
  });

  it('should properly classify files as MAIN or TEST', async () => {
    const file1 = toUnixPath(join(fixtures, 'paths', 'file.ts'));
    const file2 = toUnixPath(join(fixtures, 'paths', 'subfolder', 'index.ts'));
    setGlobalConfiguration({
      tests: ['subfolder'],
    });
    await initFileStores(join(fixtures, 'paths'));
    expect(sourceFileStore.getFoundFiles()).toMatchObject({
      [file1]: {
        fileType: 'MAIN',
      },
      [file2]: {
        fileType: 'TEST',
      },
    });
  });
});
