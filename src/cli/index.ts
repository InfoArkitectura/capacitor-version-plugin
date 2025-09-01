#!/usr/bin/env node

import { Command } from 'commander';
import { VersionManagerCLI } from './cli.js';

const program = new Command();

program
  .name('cap-version')
  .description('🔥 Capacitor Version Manager - Automated version management for Ionic projects')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize version manager in current project')
  .option('-c, --config <path>', 'Custom config file path')
  .action(async (options) => {
    const cli = new VersionManagerCLI();
    await cli.init(options);
  });

program
  .command('update')
  .description('Update version across all platforms')
  .argument('<version>', 'New version number (e.g., 1.2.3)')
  .option('-b, --build <number>', 'Build number (auto-increment if not specified)')
  .option('-h, --hotfix <number>', 'Hotfix number (increments build number)')
  .option('-p, --platform <platform>', 'Platform to update (android|ios|both)', 'both')
  .option('-c, --config <path>', 'Custom Trapeze config path')
  .option('--no-package', 'Skip package.json update')
  .option('--no-capacitor', 'Skip capacitor.config update')
  .action(async (version, options) => {
    const cli = new VersionManagerCLI();
    await cli.updateVersion(version, options);
  });

program
  .command('major')
  .description('Increment major version (X.0.0)')
  .option('-p, --platform <platform>', 'Platform to update (android|ios|both)', 'both')
  .option('-c, --config <path>', 'Custom Trapeze config path')
  .option('--no-package', 'Skip package.json update')
  .option('--no-capacitor', 'Skip capacitor.config update')
  .action(async (options) => {
    const cli = new VersionManagerCLI();
    await cli.incrementVersion('major', options);
  });

program
  .command('minor')
  .description('Increment minor version (X.Y.0)')
  .option('-p, --platform <platform>', 'Platform to update (android|ios|both)', 'both')
  .option('-c, --config <path>', 'Custom Trapeze config path')
  .option('--no-package', 'Skip package.json update')
  .option('--no-capacitor', 'Skip capacitor.config update')
  .action(async (options) => {
    const cli = new VersionManagerCLI();
    await cli.incrementVersion('minor', options);
  });

program
  .command('patch')
  .description('Increment patch version (X.Y.Z)')
  .option('-p, --platform <platform>', 'Platform to update (android|ios|both)', 'both')
  .option('-c, --config <path>', 'Custom Trapeze config path')
  .option('--no-package', 'Skip package.json update')
  .option('--no-capacitor', 'Skip capacitor.config update')
  .action(async (options) => {
    const cli = new VersionManagerCLI();
    await cli.incrementVersion('patch', options);
  });

program
  .command('hotfix')
  .description('Increment hotfix for current version (+1 to build number)')
  .option('-p, --platform <platform>', 'Platform to update (android|ios|both)', 'both')
  .option('-c, --config <path>', 'Custom Trapeze config path')
  .option('--no-package', 'Skip package.json update')
  .option('--no-capacitor', 'Skip capacitor.config update')
  .action(async (options) => {
    const cli = new VersionManagerCLI();
    await cli.incrementHotfix(options);
  });

program
  .command('reset')
  .description('Reset version to 0.0.1 (development start)')
  .option('-p, --platform <platform>', 'Platform to update (android|ios|both)', 'both')
  .option('-c, --config <path>', 'Custom Trapeze config path')
  .option('--no-package', 'Skip package.json update')
  .option('--no-capacitor', 'Skip capacitor.config update')
  .option('-f, --force', 'Force reset without confirmation')
  .action(async (options) => {
    const cli = new VersionManagerCLI();
    await cli.resetVersion(options);
  });

program
  .command('check')
  .description('Check current version status')
  .option('-v, --verbose', 'Show detailed information')
  .action(async (options) => {
    const cli = new VersionManagerCLI();
    await cli.checkVersion(options);
  });

program
  .command('info')
  .description('Show current package and version information')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    const cli = new VersionManagerCLI();
    await cli.showInfo(options);
  });

program
  .command('history')
  .description('Show version update history')
  .option('-l, --limit <number>', 'Limit number of entries', '10')
  .action(async (options) => {
    const cli = new VersionManagerCLI();
    await cli.showHistory(options);
  });

program
  .command('trapeze')
  .description('Apply Trapeze configuration')
  .argument('<config>', 'Path to Trapeze config file')
  .option('-p, --platform <platform>', 'Platform to apply (android|ios|both)', 'both')
  .option('-v, --variables <vars>', 'Variables in JSON format')
  .action(async (config, options) => {
    const cli = new VersionManagerCLI();
    await cli.applyTrapeze(config, options);
  });

// Error handling
program.exitOverride();

try {
  program.parse();
} catch (error: unknown) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error('❌ Error:', errorMessage);
  process.exit(1);
}
