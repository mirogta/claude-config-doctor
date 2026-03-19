import path from 'node:path';
import { vi } from 'vitest';

/** @type {Record<string, string>} */
export const virtualFiles = {};

// We MUST define the mock implementation BEFORE vi.mock if we want to use it there,
// or use the factory function directly.
// In Vitest, vi.mock is hoisted, so variables used inside it must be either prefixed with 'vi'
// or defined in a way that respects hoisting.
// Actually, variables defined with 'const' or 'let' are NOT hoisted.

// A better way for Vitest: use the factory directly.

vi.mock('node:fs', () => {
  // We can't access virtualFiles here if it's not prefixed with 'vi' in some versions
  // but in newer Vitest it might work if it's in the same file.
  // However, let's use a global check.
  return {
    default: {
      readFileSync: vi.fn(),
      writeFileSync: vi.fn(),
      copyFileSync: vi.fn(),
      existsSync: vi.fn(),
      readdirSync: vi.fn(),
    },
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    copyFileSync: vi.fn(),
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
  };
});

vi.mock('fs', () => {
  // Should be same as node:fs
  return {
    readFileSync: vi.fn(),
    writeFileSync: vi.fn(),
    copyFileSync: vi.fn(),
    existsSync: vi.fn(),
    readdirSync: vi.fn(),
  };
});

// Now we need to IMPORT the mocked versions and SET their implementations
import fs from 'node:fs';
import fsLegacy from 'node:fs';

export async function loadFixtures(fixturesDir) {
  const absFixturesDir = path.resolve(fixturesDir);
  const glob = new Bun.Glob('*.json');
  for await (const file of glob.scan(absFixturesDir)) {
    const fullPath = path.resolve(path.join(absFixturesDir, file));
    const content = await Bun.file(fullPath).text();
    virtualFiles[fullPath] = content;
  }

  // Set up mock implementations
  const readFileSyncImpl = (filePath, _encoding) => {
    const absPath = path.resolve(filePath);
    if (virtualFiles[absPath]) return virtualFiles[absPath];
    throw new Error(`[VirtualFS] File not found: ${filePath}`);
  };

  const writeFileSyncImpl = (filePath, content) => {
    virtualFiles[path.resolve(filePath)] = content;
  };

  const copyFileSyncImpl = (src, dest) => {
    const srcAbs = path.resolve(src);
    const destAbs = path.resolve(dest);
    if (!virtualFiles[srcAbs]) throw new Error(`[VirtualFS] Source file not found: ${src}`);
    virtualFiles[destAbs] = virtualFiles[srcAbs];
  };

  const existsSyncImpl = (filePath) => {
    return !!virtualFiles[path.resolve(filePath)];
  };

  const readdirSyncImpl = (dirPath) => {
    const absDir = path.resolve(dirPath);
    return Object.keys(virtualFiles)
      .filter((f) => f.startsWith(absDir))
      .map((f) => path.basename(f));
  };

  fs.readFileSync.mockImplementation(readFileSyncImpl);
  fs.writeFileSync.mockImplementation(writeFileSyncImpl);
  fs.copyFileSync.mockImplementation(copyFileSyncImpl);
  fs.existsSync.mockImplementation(existsSyncImpl);
  fs.readdirSync.mockImplementation(readdirSyncImpl);

  // Also for legacies
  fsLegacy.readFileSync.mockImplementation(readFileSyncImpl);
  fsLegacy.writeFileSync.mockImplementation(writeFileSyncImpl);
  fsLegacy.copyFileSync.mockImplementation(copyFileSyncImpl);
  fsLegacy.existsSync.mockImplementation(existsSyncImpl);
  fsLegacy.readdirSync.mockImplementation(readdirSyncImpl);
}
