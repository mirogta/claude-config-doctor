import nodeFetch from 'node-fetch';

/**
 * RULE: API Connectivity
 * Verifies that the configured model host (or default) is reachable.
 */
export default {
  id: 'connectivity',
  name: 'API Connectivity Check',
  check: async (content) => {
    const baseUrl = content.env?.ANTHROPIC_BASE_URL || 'https://api.anthropic.com';
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      await nodeFetch(baseUrl, {
        method: 'HEAD',
        signal: controller.signal,
      });
      clearTimeout(timeout);
      return [];
    } catch (_err) {
      return [
        {
          type: 'connectivity',
          message: `Connection Error: Could not reach ${baseUrl}.`,
        },
      ];
    }
  },
  fix: () => false,
};
