import fs from 'fs-extra';
import * as path from 'path';
import * as yaml from 'yaml';
import type { PackageInfo } from '../definitions.js';
import { VersionManager } from '../plugin.js';
import { StoreComparison } from '../store-comparison.js';

export class VersionManagerCLI {
  private configPath: string = './trapeze.config.yaml';

  constructor() {}

  async init(options: { config?: string }): Promise<void> {
    try {
      console.log('🚀 Initializing Capacitor Version Manager...');
      
      const configPath = options.config || this.configPath;
      
      if (await fs.pathExists(configPath)) {
        console.log('⚠️  Configuration file already exists:', configPath);
        console.log('ℹ️  To reinitialize, delete the config file first');
        return;
      }

      // Create default Trapeze configuration
      const defaultConfig = this.createDefaultTrapezeConfig();
      
      if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
        await fs.writeFile(configPath, yaml.stringify(defaultConfig), 'utf8');
      } else {
        await fs.writeJSON(configPath, defaultConfig, { spaces: 2 });
      }

      console.log('✅ Configuration file created:', configPath);
      console.log('');
      console.log('🎯 Initial Setup Complete:');
      console.log('   � Setting initial version to 0.0.1');
      console.log('   🏗️  Build number will be: 10');
      console.log('   📱 Version code will be: 10');
      console.log('');
      
      // Set initial version to 0.0.1
      console.log('🔄 Setting initial version...');
      await this.updateVersion('0.0.1', {
        platform: 'both',
        package: true,
        capacitor: true
      });
      
      console.log('');
      console.log('🎉 Capacitor Version Manager initialized successfully!');
      console.log('');
      console.log('📝 Available commands:');
      console.log('   cap-version info           # Show current version');
      console.log('   cap-version update <ver>   # Update to specific version');
      console.log('   cap-version major/minor/patch/hotfix  # Auto increment');
      console.log('   cap-version reset --force  # Reset to 0.0.1');
      console.log('');
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to initialize:', errorMessage);
      throw error;
    }
  }

  async updateVersion(version: string, options: {
    build?: string;
    platform?: string;
    config?: string;
    package?: boolean;
    capacitor?: boolean;
    hotfix?: string;
  }): Promise<void> {
    try {
      console.log(`🔄 Updating version to ${version}...`);

      // Calculate build number for hotfix
      let buildNumber = options.build ? parseInt(options.build) : undefined;
      
      if (options.hotfix && !buildNumber) {
        // Generate base build number from version
        const parts = version.split('.').map((part: string) => parseInt(part, 10));
        if (parts.length === 3) {
          const [major, minor, patchBase] = parts;
          const hotfixNumber = parseInt(options.hotfix);
          
          // Handle hotfix >= 10 as patch increments
          if (hotfixNumber >= 10) {
            const patchIncrements = Math.floor(hotfixNumber / 10);
            const remainingHotfix = hotfixNumber % 10;
            const newPatch = patchBase + patchIncrements;
            
            const newVersion = `${major}.${minor}.${newPatch}`;
            console.log(`⚠️  Hotfix ${hotfixNumber} converted to patch update:`);
            console.log(`   ${version} hotfix ${hotfixNumber} → ${newVersion} hotfix ${remainingHotfix}`);
            console.log(`   ℹ️  Hotfix 10+ automatically becomes patch increment(s)`);
            
            // Update version and calculate new build number
            version = newVersion;
            const baseBuild = major * 1000000 + minor * 1000 + newPatch * 10;
            buildNumber = baseBuild + remainingHotfix;
          } else {
            // Normal hotfix (0-9)
            const baseBuild = major * 1000000 + minor * 1000 + patchBase * 10;
            buildNumber = baseBuild + hotfixNumber;
          }
        }
      }

      const result = await VersionManager.updateVersion({
        version,
        buildNumber,
        platform: options.platform as 'android' | 'ios' | 'both',
        configPath: options.config,
        updatePackageJson: options.package,
        updateCapacitorConfig: options.capacitor,
      });

      if (result.success) {
        console.log('✅ Version updated successfully!');
        console.log(`📦 New version: ${result.newVersion}`);
        console.log(`🏗️  Build number: ${result.newBuildNumber}`);
        console.log(`📱 Version code: ${result.newBuildNumber}`);
        console.log(`🎯 Platform: ${result.platform}`);
        
        if (result.updatedFiles.length > 0) {
          console.log('📝 Updated files:');
          result.updatedFiles.forEach((file: string) => console.log(`   - ${file}`));
        }
      } else {
        console.error('❌ Failed to update version:', result.message);
        throw new Error(result.message);
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Update failed:', errorMessage);
      throw error;
    }
  }

  async incrementVersion(type: 'major' | 'minor' | 'patch', options: {
    platform?: string;
    config?: string;
    package?: boolean;
    capacitor?: boolean;
  }): Promise<void> {
    try {
      // Get current version
      const packageInfo = await VersionManager.getPackageInfo();
      const currentVersion = packageInfo.version;
      
      // Parse current version
      const parts = currentVersion.split('.').map((part: string) => parseInt(part, 10));
      if (parts.length !== 3 || parts.some((p: number) => isNaN(p))) {
        console.error('❌ Invalid current version format:', currentVersion);
        return;
      }

      let [major, minor, patch] = parts;

      // Increment based on type
      switch (type) {
        case 'major':
          major += 1;
          minor = 0;
          patch = 0;
          break;
        case 'minor':
          minor += 1;
          patch = 0;
          break;
        case 'patch':
          patch += 1;
          break;
      }

      const newVersion = `${major}.${minor}.${patch}`;
      console.log(`🔄 Incrementing ${type} version: ${currentVersion} → ${newVersion}`);

      // Call updateVersion with the new version
      await this.updateVersion(newVersion, options);
    } catch (error) {
      console.error('❌ Failed to increment version:', error);
    }
  }

  async incrementHotfix(options: {
    platform?: string;
    config?: string;
    package?: boolean;
    capacitor?: boolean;
  }): Promise<void> {
    try {
      // Get current version and build number
      const packageInfo = await VersionManager.getPackageInfo();
      const currentVersion = packageInfo.version;
      const currentBuildNumber = parseInt(packageInfo.buildNumber);
      
      // Calculate current hotfix number
      const parts = currentVersion.split('.').map((part: string) => parseInt(part, 10));
      if (parts.length !== 3 || parts.some((p: number) => isNaN(p))) {
        console.error('❌ Invalid current version format:', currentVersion);
        return;
      }

      const [major, minor, patchBase] = parts;
      const baseBuild = major * 1000000 + minor * 1000 + patchBase * 10;
      const currentHotfix = currentBuildNumber - baseBuild;

      // Check if we're at hotfix 9 (need to increment patch)
      if (currentHotfix >= 9) {
        const newPatch = patchBase + 1;
        const newVersion = `${major}.${minor}.${newPatch}`;
        console.log(`🔄 Hotfix ${currentHotfix + 1} overflow detected:`);
        console.log(`   ${currentVersion} hotfix ${currentHotfix + 1} → ${newVersion} (patch update)`);
        console.log(`   ℹ️  Hotfix 10+ automatically becomes a patch increment`);
        
        // Call updateVersion with new patch version
        await this.updateVersion(newVersion, options);
      } else {
        const nextHotfix = currentHotfix + 1;
        console.log(`🔄 Incrementing hotfix ${currentHotfix} → ${nextHotfix}:`);
        console.log(`   ${currentVersion} (build ${currentBuildNumber}) → ${currentVersion} (build ${baseBuild + nextHotfix})`);

        // Call updateVersion with hotfix
        await this.updateVersion(currentVersion, {
          ...options,
          hotfix: nextHotfix.toString()
        });
      }
    } catch (error) {
      console.error('❌ Failed to increment hotfix:', error);
    }
  }

  async resetVersion(options: {
    platform?: string;
    config?: string;
    package?: boolean;
    capacitor?: boolean;
    force?: boolean;
  }): Promise<void> {
    try {
      // Get current version for confirmation
      const packageInfo = await VersionManager.getPackageInfo();
      const currentVersion = packageInfo.version;
      
      if (!options.force) {
        console.log(`⚠️  Reset Version Confirmation:`);
        console.log(`   Current version: ${currentVersion}`);
        console.log(`   This will reset to: 0.0.1`);
        console.log(`   🔄 Build number will be: 1 (0*1000000 + 0*1000 + 1*10 + 0 = 10)`);
        console.log(`   📝 All version history will be lost`);
        console.log(`   `);
        console.log(`   To proceed, use: cap-version reset --force`);
        return;
      }

      console.log(`🔄 Resetting version from ${currentVersion} to 0.0.1...`);
      console.log(`   ℹ️  Starting fresh development cycle`);

      // Call updateVersion with 0.0.1
      await this.updateVersion('0.0.1', options);
    } catch (error) {
      console.error('❌ Failed to reset version:', error);
    }
  }

  async checkVersion(options: { verbose?: boolean }): Promise<void> {
    try {
      console.log('🔍 Checking version status...');

      const status = await VersionManager.checkVersionStatus();
      const info: PackageInfo = await VersionManager.getPackageInfo();

      console.log(`📦 Package: ${info.name}`);
      console.log(`📋 Version: ${info.version}`);
      console.log(`🏗️  Build Number: ${info.buildNumber}`);
      console.log(`📱 Version Code: ${info.buildNumber}`);
      console.log(`🎯 Platform: ${info.platform}`);

      if (options.verbose) {
        console.log(`📅 Last updated: ${info.lastUpdated || 'Unknown'}`);
        console.log(`✨ Status: ${status.isUpToDate ? '✅ Up to date' : '⚠️  Needs update'}`);
        
        if (status.suggestions.length > 0) {
          console.log('💡 Suggestions:');
          status.suggestions.forEach((suggestion: string) => console.log(`   - ${suggestion}`));
        }
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to check version:', errorMessage);
      throw error;
    }
  }

  async showInfo(options: { json?: boolean }): Promise<void> {
    try {
      const info: PackageInfo = await VersionManager.getPackageInfo();
      const version = await VersionManager.getVersion();
      const lastUpdate = await VersionManager.getLastUpdate();

      const output = {
        package: info,
        version,
        lastUpdate,
      };

      if (options.json) {
        console.log(JSON.stringify(output, null, 2));
      } else {
        console.log('📦 Package Information:');
        console.log(`   Name: ${info.name}`);
        console.log(`   Version: ${info.version}`);
        console.log(`   Build Number: ${info.buildNumber}`);
        console.log(`   Version Code: ${info.buildNumber}`);
        console.log(`   Platform: ${info.platform}`);
        console.log(`   Description: ${info.description || 'N/A'}`);
        console.log(`   Author: ${info.author || 'N/A'}`);
        console.log(`   Last Updated: ${lastUpdate.lastUpdated}`);
        console.log(`   Update Method: ${lastUpdate.updateMethod}`);
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to get info:', errorMessage);
      throw error;
    }
  }

  async showHistory(_options: { limit?: string }): Promise<void> {
    try {
      console.log('📜 Version History:');
      console.log('   (History tracking will be implemented in future versions)');
      
      const info = await VersionManager.getLastUpdate();
      console.log(`   Last update: ${info.lastUpdated} (${info.updateMethod})`);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to get history:', errorMessage);
      throw error;
    }
  }

  /**
   * Compare local version with store versions
   */
  async compareStores(options: { verbose?: boolean }): Promise<void> {
    try {
      console.log('🔍 Comparing versions with app stores...');
      console.log('='.repeat(50));
      
      const storeComparison = new StoreComparison();
      const result = await storeComparison.compareWithStores();
      
      // Display local version
      console.log(`📱 Local Version: ${result.localVersion} (Build: ${result.localBuild})`);
      console.log('');
      
      // Display Android results
      if (result.android) {
        console.log('🤖 Android (Google Play):');
        if (result.android.error) {
          console.log(`   ❌ Error: ${result.android.error}`);
        } else {
          const status = result.android.isNewer ? '✅ Ready to publish' : '❌ Version too low';
          console.log(`   Store Version: ${result.android.storeVersion} (Build: ${result.android.storeBuild})`);
          console.log(`   Status: ${status}`);
        }
        console.log('');
      }
      
      // Display iOS results
      if (result.ios) {
        console.log('🍎 iOS (App Store):');
        if (result.ios.error) {
          console.log(`   ❌ Error: ${result.ios.error}`);
        } else {
          const status = result.ios.isNewer ? '✅ Ready to publish' : '❌ Version too low';
          console.log(`   Store Version: ${result.ios.storeVersion} (Build: ${result.ios.storeBuild})`);
          console.log(`   Status: ${status}`);
        }
        console.log('');
      }
      
      // Display overall status
      if (result.canPublish) {
        console.log('🎉 Ready to publish on all platforms!');
      } else {
        console.log('⚠️  Cannot publish - version conflicts detected');
      }
      
      // Show warnings
      if (result.warnings.length > 0) {
        console.log('\n⚠️  Warnings:');
        result.warnings.forEach(warning => console.log(`   • ${warning}`));
      }
      
      // Show errors  
      if (result.errors.length > 0) {
        console.log('\n❌ Errors:');
        result.errors.forEach(error => console.log(`   • ${error}`));
      }
      
      if (options.verbose) {
        console.log('\n🔧 Verbose Information:');
        console.log('Raw comparison result:', JSON.stringify(result, null, 2));
      }
      
    } catch (error) {
      console.error('❌ Error comparing store versions:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  }

  async applyTrapeze(config: string, options: {
    platform?: string;
    variables?: string;
  }): Promise<void> {
    try {
      console.log(`🔧 Applying Trapeze configuration: ${config}`);

      let variables = {};
      if (options.variables) {
        try {
          variables = JSON.parse(options.variables);
        } catch {
          console.error('❌ Invalid variables JSON format');
          throw new Error('Variables must be valid JSON');
        }
      }

      const result = await VersionManager.applyTrapezeConfig({
        configPath: config,
        platform: options.platform as 'android' | 'ios' | 'both',
        variables,
      });

      if (result.success) {
        console.log('✅ Trapeze configuration applied successfully!');
        console.log(`🎯 Platforms: ${result.appliedPlatforms.join(', ')}`);
        
        if (result.modifiedFiles.length > 0) {
          console.log('📝 Modified files:');
          result.modifiedFiles.forEach((file: string) => console.log(`   - ${file}`));
        }
      } else {
        console.error('❌ Failed to apply Trapeze config:', result.message);
        throw new Error(result.message);
      }
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('❌ Trapeze application failed:', errorMessage);
      throw error;
    }
  }

  private createDefaultTrapezeConfig(): any {
    return {
      platforms: {
        android: {
          'android/app/build.gradle': [
            {
              replace: {
                find: 'versionName ".*"',
                replace: 'versionName "$VERSION"',
              },
            },
            {
              replace: {
                find: 'versionCode \\d+',
                replace: 'versionCode $BUILD_NUMBER',
              },
            },
          ],
        },
        ios: {
          'ios/App/App.xcodeproj/project.pbxproj': [
            {
              replace: {
                find: 'MARKETING_VERSION = .*;',
                replace: 'MARKETING_VERSION = $VERSION;',
              },
            },
            {
              replace: {
                find: 'CURRENT_PROJECT_VERSION = .*;',
                replace: 'CURRENT_PROJECT_VERSION = $BUILD_NUMBER;',
              },
            },
          ],
        },
      },
    };
  }
}
