import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = path.resolve(__dirname, '../../schema/claude-code-settings.json');

let schema = {};
try {
  const raw = fs.readFileSync(schemaPath, 'utf8');
  schema = JSON.parse(raw);
} catch (_err) {
  // Graceful fallback if schema is missing or invalid JSON
}

const ajv = new Ajv({ strict: false });
addFormats(ajv);

/**
 * RULE: Schema Validation
 * Validates config against the official Claude Code settings schema.
 */
export default {
  id: 'schema',
  name: 'JSON Schema Validation',
  check: (content) => {
    if (!schema || Object.keys(schema).length === 0) return [];
    const issues = [];
    if (!ajv.validate(schema, content)) {
      ajv.errors.forEach((e) => {
        issues.push({
          type: 'schema',
          message: `${e.instancePath || '/'} ${e.message}`,
        });
      });
    }
    return issues;
  },
  fix: () => false,
};
