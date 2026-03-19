import fs from 'node:fs';
import path from 'node:path';
import connectivityRule from './rules/connectivity.js';
import gitignoreRule from './rules/gitignore.js';
import modelSuffixRule from './rules/model-suffix.js';
import openRouterRule from './rules/openrouter.js';
// Rules
import schemaRule from './rules/schema.js';

/**
 * Registry of rules.
 */
const RULES = [schemaRule, modelSuffixRule, openRouterRule, connectivityRule, gitignoreRule];

export async function checkConfig(filePath) {
  if (!fs.existsSync(filePath)) {
    return { issues: [{ type: 'read_error', message: `Not found: ${filePath}` }] };
  }
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const issues = [];
    for (const rule of RULES) {
      const results = await rule.check(content, filePath);
      issues.push(...results);
    }
    return { issues };
  } catch (err) {
    return { issues: [{ type: 'read_error', message: `Parse Failure: ${err.message}` }] };
  }
}

export async function fixConfig(filePath) {
  const check = await checkConfig(filePath);
  if (check.issues.some((i) => i.type === 'read_error')) return { ...check, fixed: false };

  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  let changed = false;
  for (const rule of RULES) {
    if (rule.fix(content, filePath)) changed = true;
  }

  if (changed) {
    fs.copyFileSync(filePath, `${filePath}.bak`);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  }
  return { issues: check.issues, fixed: changed };
}

export async function initConfigWizard(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const defaultConfig = {
    $schema: 'https://json.schemastore.org/claude-code-settings.json',
    env: {
      ANTHROPIC_MODEL: 'claude-3-5-sonnet-latest',
    },
    permissions: {
      allow: ['Read', 'Bash'],
      deny: [],
      ask: [],
    },
  };

  fs.writeFileSync(filePath, JSON.stringify(defaultConfig, null, 2));
  return { filePath, success: true };
}
