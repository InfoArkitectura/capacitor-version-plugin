import { WebPlugin } from '@capacitor/core';

import type {
  VersionManagerPlugin,
  UpdateVersionOptions,
  UpdateVersionResult,
  TrapezeConfigOptions,
  TrapezeConfigResult,
  VersionStatusResult,
  PackageInfo,
} from './definitions';

function versionToNumericCode(version: string): number {
  // Convert semantic version to numeric code
  // Example: "21.0.0" -> 21000000, "20.15.3" -> 20015030
  const parts = version.split('.').map((part: string) => parseInt(part, 10));
  if (parts.length !== 3 || parts.some((p: number) => isNaN(p))) {
    return 100000; // Default fallback
  }
  
  const [major, minor, patch] = parts;
  // Format: MMMmmmpp (major*1000000 + minor*1000 + patch*10)
  // 21.0.0 -> 21*1000000 + 0*1000 + 0*10 = 21000000
  // 20.15.3 -> 20*1000000 + 15*1000 + 3*10 = 20015030  
  return major * 1000000 + minor * 1000 + patch * 10;
}

export class VersionManagerWeb extends WebPlugin implements VersionManagerPlugin {
  constructor() {
    super();
  }

  async getVersion(): Promise<{ version: string; buildNumber: string; platform: string }> {
    const version = '20.15.3'; // Current version from the update
    const buildNumber = versionToNumericCode(version);
    return {
      version,
      buildNumber: buildNumber.toString(),
      platform: 'web',
    };
  }

  async getPackageInfo(): Promise<PackageInfo> {
    const version = '20.15.3'; // Current version from the update
    const buildNumber = versionToNumericCode(version);
    return {
      name: '@capacitor-community/version-manager',
      version,
      buildNumber: buildNumber.toString(),
      platform: 'web',
      description: 'Capacitor Version Manager',
      author: 'InfoArkitectura',
      lastUpdated: new Date().toISOString(),
    };
  }

  async getLastUpdate(): Promise<{
    lastUpdated: string;
    updateMethod: string;
    previousVersion?: string;
  }> {
    return {
      lastUpdated: new Date().toISOString(),
      updateMethod: 'web',
      previousVersion: undefined,
    };
  }

  async updateVersion(options: UpdateVersionOptions): Promise<UpdateVersionResult> {
    // Validate required parameters
    if (!options.version || options.version.trim() === '') {
      return {
        success: false,
        message: 'Version is required and cannot be empty',
        updatedFiles: [],
        newVersion: options.version || '',
        newBuildNumber: options.buildNumber || 100000,
        platform: options.platform || 'web',
      };
    }

    // Calculate build number from version
    const calculatedBuildNumber = versionToNumericCode(options.version);

    // Simulate successful update for web platform
    return {
      success: true,
      message: `Version updated to ${options.version} successfully`,
      updatedFiles: ['package.json', 'capacitor.config.ts'],
      newVersion: options.version,
      newBuildNumber: options.buildNumber || calculatedBuildNumber,
      platform: options.platform || 'web',
    };
  }

  async applyTrapezeConfig(options: TrapezeConfigOptions): Promise<TrapezeConfigResult> {
    // Simulate successful Trapeze application
    return {
      success: true,
      message: 'Trapeze configuration applied successfully',
      appliedPlatforms: [options.platform],
      modifiedFiles: ['android/app/build.gradle', 'ios/App/App.xcodeproj/project.pbxproj'],
    };
  }

  async checkVersionStatus(): Promise<VersionStatusResult> {
    const version = '20.15.3'; // Current version from the update
    const buildNumber = versionToNumericCode(version);
    return {
      isUpToDate: true,
      currentVersion: version,
      currentBuildNumber: buildNumber,
      suggestions: [],
      lastCheck: new Date().toISOString(),
    };
  }
}
