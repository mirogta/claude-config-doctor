#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { checkConfig, fixConfig, initConfigWizard } from '../lib/healthcheck.js';

const DEFAULT_LOCAL = path.join(process.cwd(), '.claude/settings.local.json');
const DEFAULT_GLOBAL = path.join(os.homedir(), '.claude/settings.json');

const parser = yargs(hideBin(process.argv))
  .scriptName('claude-config-doctor')
  .usage('$0 <command> [options]')
  .command(['check [file]', '$0 [file]'], 'Run diagnostics on Claude settings (default)', (y) => {
    y.positional('file', { describe: 'Path to config file', type: 'string' });
  })
  .command('fix [file]', 'Apply autofixes for known model and API issues', (y) => {
    y.positional('file', { describe: 'Path to config file', type: 'string' });
  })
  .command('init [file]', 'Initialize a new config template', (y) => {
    y.positional('file', { describe: 'Path to create config', type: 'string' });
  })
  .option('json', { type: 'boolean', describe: 'Output raw JSON results', global: true })
  .help();

const argv = parser.parseSync();

async function showReport(filePath, result) {
  console.log(chalk.bold(`\n🩺 Diagnostic Report (Extra): ${chalk.cyan(filePath)}`));
  if (result.issues.length === 0) {
    console.log(`  ${chalk.green('✓')} No issues detected by the Doctor.`);
    return;
  }

  result.issues.forEach((issue) => {
    let icon = chalk.red('✖');
    let color = chalk.red;
    if (issue.type === 'telemetry') {
      icon = chalk.yellow('⚠');
      color = chalk.yellow;
    }
    if (issue.type === 'model_suffix') {
      icon = chalk.blue('🩹');
      color = chalk.blue;
    }
    if (issue.type === 'connectivity') {
      icon = chalk.yellow('☁');
      color = chalk.yellow;
    }
    if (issue.type === 'api_key') {
      icon = chalk.red('🔐');
      color = chalk.red;
    }
    if (issue.type === 'read_error') {
      icon = chalk.red('🚫');
      color = chalk.red;
    }
    if (issue.type === 'gitignore') {
      icon = chalk.yellow('🪵');
      color = chalk.yellow;
    }

    console.log(`  ${icon} ${color(issue.message)}`);
  });
}

(async () => {
  const cmd = argv._[0] || 'check';

  if (cmd === 'init') {
    const file = path.resolve(argv.file || DEFAULT_LOCAL);
    const result = await initConfigWizard(file);
    if (result.success) console.log(chalk.green(`\n✨ Template @ ${chalk.cyan(result.filePath)}`));
    return;
  }

  const filesToCheck = [];
  if (argv.file) {
    filesToCheck.push(path.resolve(argv.file));
  } else {
    if (fs.existsSync(DEFAULT_LOCAL)) filesToCheck.push(DEFAULT_LOCAL);
    if (fs.existsSync(DEFAULT_GLOBAL)) filesToCheck.push(DEFAULT_GLOBAL);
  }

  if (filesToCheck.length === 0) {
    console.log(chalk.red(`\n✖ No config files found in standard locations.`));
    process.exit(1);
  }

  let hasIssues = false;
  for (const file of filesToCheck) {
    const result = cmd === 'fix' ? await fixConfig(file) : await checkConfig(file);
    if (result.issues.length > 0) hasIssues = true;

    if (argv.json) {
      console.log(JSON.stringify({ file, ...result }, null, 2));
    } else {
      await showReport(file, result);
      if (cmd === 'fix' && result.fixed) {
        console.log(chalk.green(`  ${chalk.bold('✔')} Auto-fixes applied successfully.`));
      }
    }
  }

  if (cmd !== 'fix' && hasIssues) process.exit(1);
})();
