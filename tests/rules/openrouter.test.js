import { describe, expect, it } from 'vitest';
import openRouterRule from '../../lib/rules/openrouter.js';

describe('OpenRouter Rule', () => {
  it('detects credentials conflict', () => {
    const content = {
      env: {
        ANTHROPIC_BASE_URL: 'https://openrouter.ai/api',
        ANTHROPIC_API_KEY: 'sk-ant-something',
        ANTHROPIC_AUTH_TOKEN: 'token-123',
      },
    };
    const issues = openRouterRule.check(content);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('Please remove ANTHROPIC_API_KEY');
  });

  it('passes if only one credential is set', () => {
    const content = {
      env: {
        ANTHROPIC_BASE_URL: 'https://openrouter.ai/api',
        ANTHROPIC_AUTH_TOKEN: 'token-123',
      },
    };
    expect(openRouterRule.check(content)).toHaveLength(0);
  });

  it('fixes conflict by clearing API key', () => {
    const content = {
      env: {
        ANTHROPIC_BASE_URL: 'https://openrouter.ai/api',
        ANTHROPIC_API_KEY: 'sk-ant-something',
        ANTHROPIC_AUTH_TOKEN: 'token-123',
      },
    };
    const fixed = openRouterRule.fix(content);
    expect(fixed).toBe(true);
    expect(content.env.ANTHROPIC_API_KEY).toBe('');
  });
});
