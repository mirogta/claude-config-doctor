/**
 * RULE: OpenRouter Conflict Check
 * Prevents using both API keys and Auth Tokens simultaneously with OpenRouter.
 */
export default {
  id: 'api_key',
  name: 'OpenRouter Credentials Integrity',
  check: (content) => {
    if (!content.env) return [];
    const isOpenRouter = content.env.ANTHROPIC_BASE_URL?.includes('openrouter.ai');
    if (isOpenRouter && content.env.ANTHROPIC_API_KEY && content.env.ANTHROPIC_AUTH_TOKEN) {
      return [
        {
          type: 'api_key',
          message: 'OpenRouter Conflict: Please remove ANTHROPIC_API_KEY.',
        },
      ];
    }
    return [];
  },
  fix: (content) => {
    if (!content.env) return false;
    const isOpenRouter = content.env.ANTHROPIC_BASE_URL?.includes('openrouter.ai');
    if (isOpenRouter && content.env.ANTHROPIC_API_KEY && content.env.ANTHROPIC_AUTH_TOKEN) {
      content.env.ANTHROPIC_API_KEY = '';
      return true;
    }
    return false;
  },
};
