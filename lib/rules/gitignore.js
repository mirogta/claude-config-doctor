import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

/**
 * Checks if a file is ignored by Git.
 */
function isIgnored(filePath) {
  try {
    // -q: be quiet, exit with 0 if ignored, 1 if not
    execSync(`git check-ignore -q "${filePath}"`, { stdio: 'ignore' });
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * RULE: Git Ignore Check
 * Ensures sensitive config files and their backups are ignored by Git.
 */
export default {
  id: 'gitignore',
  name: 'Git Isolation Check',
  check: (_, filePath) => {
    // Only relevant for local files in the current working directory, not for tests
    if (!filePath.includes(process.cwd()) || filePath.includes('/tests/')) return [];

    const issues = [];
    const bakPath = `${filePath}.bak`;

    if (!isIgnored(filePath)) {
      issues.push({
        type: 'gitignore',
        message: `.gitignore Missing: ${path.basename(filePath)} is not ignored.`,
      });
    }

    if (!isIgnored(bakPath)) {
      issues.push({
        type: 'gitignore',
        message: `.gitignore Missing: Backup files (*.bak) are not ignored.`,
      });
    }

    return issues;
  },
  fix: (_, filePath) => {
    if (!filePath.includes(process.cwd())) return false;

    const rootDir = process.cwd();
    const gitignorePath = path.join(rootDir, '.gitignore');
    const relPath = path.relative(rootDir, filePath);
    const bakPath = `${filePath}.bak`;

    let changed = false;
    const linesToAdd = [];

    if (!isIgnored(filePath)) linesToAdd.push(relPath);
    if (!isIgnored(bakPath)) linesToAdd.push('*.bak');

    if (linesToAdd.length > 0) {
      const header = '\n# Claude Config Doctor';
      let content = '';
      if (fs.existsSync(gitignorePath)) {
        content = fs.readFileSync(gitignorePath, 'utf8');
      }

      let newContent = content;
      if (!newContent.includes(header)) newContent += header;

      for (const line of linesToAdd) {
        if (!newContent.includes(line)) {
          newContent += `\n${line}`;
          changed = true;
        }
      }

      if (changed) {
        fs.writeFileSync(gitignorePath, `${newContent.trim()}\n`);
      }
    }

    return changed;
  },
};
