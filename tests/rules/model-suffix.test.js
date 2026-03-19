import { describe, expect, it } from 'vitest';
import modelSuffixRule from '../../lib/rules/model-suffix.js';

describe('Model Suffix Rule', () => {
  it('detects legacy :free suffix', () => {
    const content = {
      env: {
        ANTHROPIC_MODEL: 'claude-3-5-sonnet-latest:free',
      },
    };
    const issues = modelSuffixRule.check(content);
    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain('Please remove ":free"');
  });

  it('fixes suffix by stripping :free', () => {
    const content = {
      env: {
        ANTHROPIC_MODEL: 'claude-3-5-sonnet-latest:free',
      },
    };
    const fixed = modelSuffixRule.fix(content);
    expect(fixed).toBe(true);
    expect(content.env.ANTHROPIC_MODEL).toBe('claude-3-5-sonnet-latest');
  });
});
