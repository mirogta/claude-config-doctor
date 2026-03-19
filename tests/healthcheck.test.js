import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { checkConfig, fixConfig } from '../lib/healthcheck.js';
import { loadFixtures } from './helpers/virtual-fs.js';

const fixturesDir = path.resolve('./tests/fixtures');

describe('Healthcheck Orchestration', () => {
  beforeAll(async () => {
    await loadFixtures(fixturesDir);
  });

  it('collects issues from all rules', async () => {
    const filePath = path.resolve(fixturesDir, 'openrouter-conflict.json');
    const result = await checkConfig(filePath);

    expect(result.issues).toBeDefined();
    // Should catch OpenRouter conflict
    expect(result.issues.some((i) => i.type === 'api_key')).toBe(true);
  });

  it('successfully fixes issues via fixConfig', async () => {
    const filePath = path.resolve(fixturesDir, 'model-suffix-legacy.json');
    const result = await fixConfig(filePath);

    expect(result.fixed).toBe(true);
    expect(result.issues.some((i) => i.type === 'model_suffix')).toBe(true);
  });

  it('returns empty issues for valid.json', async () => {
    const filePath = path.resolve(fixturesDir, 'valid.json');
    const result = await checkConfig(filePath);
    expect(result.issues).toHaveLength(0);
  });
});
