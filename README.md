# Claude Config Doctor 🩺

[![CI Status](https://github.com/mirogta/claude-config-doctor/actions/workflows/ci.yml/badge.svg)](https://github.com/mirogta/claude-config-doctor/actions)
[![License: MIT](https://img.shields.io/github/license/mirogta/claude-config-doctor)](LICENSE)
[![npm version](https://img.shields.io/npm/v/claude-config-doctor)](https://www.npmjs.com/package/claude-config-doctor)

An **extra diagnostic tool** designed specifically to find and fix common community-reported pitfalls in Claude Code configuration files. It acts as a specialized extension to the built-in Claude doctor.

## 🚀 Usage

Run the doctor instantly with `npx` in either your repo root or home directory:

```bash
# Check for common configuration issues
npx claude-config-doctor check

# Apply autofixes for known model-naming and API key conflicts
npx claude-config-doctor fix

# Initialize a fresh repo-level config template
npx claude-config-doctor init
```

## 🔍 Targeted Diagnostics

The Doctor focuses on some specific frustration points:

- ✅ **Schema Guard**: Validates your configuration against official JSON standards.
- ✅ **OpenRouter Bridge Verification**: Ensures correct variable separation for OpenRouter integrations.
- ✅ **Model Name Errors**: Detects and strips accidental `:free` suffixes that cause "Model not found" errors.

## 🛠️ Pro Workflow

The tool automatically prioritizes `./.claude/settings.local.json` but checks `~/.claude/settings.json` too.

```bash
# Output raw results for scriptable diagnostics or CI/CD
npx claude-config-doctor check --json
```

## 📜 License

MIT.
For more information, please read our [Contributing Guide](CONTRIBUTING.md).
