const MODEL_VARS = [
  'ANTHROPIC_MODEL',
  'ANTHROPIC_DEFAULT_OPUS_MODEL',
  'ANTHROPIC_DEFAULT_SONNET_MODEL',
  'ANTHROPIC_DEFAULT_HAIKU_MODEL',
  'CLAUDE_CODE_SUBAGENT_MODEL',
];

/**
 * RULE: Model Suffix Check
 * Detects and strips legacy ":free" suffixes from model names.
 */
export default {
  id: 'model_suffix',
  name: 'Model Prefix Sanitization',
  check: (content) => {
    const issues = [];
    if (!content.env) return issues;
    for (const v of MODEL_VARS) {
      if (content.env[v]?.includes(':free')) {
        issues.push({
          type: 'model_suffix',
          message: `Legacy Suffix: Please remove ":free" from ${v}.`,
        });
      }
    }
    return issues;
  },
  fix: (content) => {
    let changed = false;
    if (!content.env) return false;
    for (const v of MODEL_VARS) {
      if (content.env[v]?.includes(':free')) {
        content.env[v] = content.env[v].replace(':free', '');
        changed = true;
      }
    }
    return changed;
  },
};
