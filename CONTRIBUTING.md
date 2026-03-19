# Contributing to Claude Config Doctor 🩺

First off, thank you for considering contributing to Claude Config Doctor! It's people like you that make Claude Config Doctor such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](.github/CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

- **Search first**. Before creating a new issue, please check if the bug has already been reported.
- **Provide details**. If you find a bug, please create an issue with a clear description of the problem, expected behavior, and steps to reproduce.
- **Environment info**. Mention your OS, Node.js/Bun version, and any relevant configuration snippets (redact sensitive information like API keys!).

### Suggesting Enhancements

- **Open an issue**. Describe the feature you'd like to see and why it would be useful.
- **Provide context**. How does this solve a problem for users of Claude Code?

### Pull Requests

1. **Check for existing issues**. If you're planning a major change, it's best to open an issue for discussion first.
2. **Fork the repo** and create your branch from `main`.
3. **Install dependencies**: `bun install`.
4. **Make your changes**. Write clean, documented code.
5. **Lint and Format**: Run `bun run lint` to ensure your code matches the style. Biome will automatically check for common issues.
6. **Run tests**: `bun test`. Ensure all tests pass before submitting.
7. **Submit PR**. Provide a clear description of your changes and link to any related issues.

## Development Setup

To set up the development environment, you will need:
- [Bun](https://bun.sh/) installed.
- [Biome](https://biomejs.dev/) (installed via dependencies).
- Any modern code editor (VS Code recommended with the Biome extension).

```bash
# Clone the repository
git clone https://github.com/mirogta/claude-config-doctor.git
cd claude-config-doctor

# Install dependencies
bun install

# Lint and Format
bun run lint
bun run format

# Run tests
bun test
```

## Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for our commit messages. This helps us generate clean and automated changelogs.

Format: `<type>(<scope>): <description>`

Common types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools and libraries

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
