export interface VersionManagerPlugin {
  /**
   * Get the current version information for the app
   */
  getVersion(): Promise<{ version: string; buildNumber: string; platform: string }>;

  /**
   * Get the current package information (name, version, build number)
   */
  getPackageInfo(): Promise<{
    name: string;
    version: string;
    buildNumber: string;
    platform: string;
  }>;

  /**
   * Get the last update information for version tracking
   */
  getLastUpdate(): Promise<{
    lastUpdated: string;
    updateMethod: string;
    previousVersion?: string;
  }>;

  /**
   * Update the version using Trapeze configuration
   */
  updateVersion(options: UpdateVersionOptions): Promise<UpdateVersionResult>;

  /**
   * Apply Trapeze configuration for platform-specific updates
   */
  applyTrapezeConfig(options: TrapezeConfigOptions): Promise<TrapezeConfigResult>;

  /**
   * Check if the app needs version update based on configuration
   */
  checkVersionStatus(): Promise<VersionStatusResult>;
}

export interface UpdateVersionOptions {
  /**
   * New version to apply (e.g., "1.2.3")
   */
  version: string;

  /**
   * New build number (optional, will auto-increment if not provided)
   */
  buildNumber?: number;

  /**
   * Platform to update ("android", "ios", or "both")
   * @default "both"
   */
  platform?: 'android' | 'ios' | 'both';

  /**
   * Custom Trapeze configuration path
   */
  configPath?: string;

  /**
   * Whether to update package.json as well
   * @default true
   */
  updatePackageJson?: boolean;

  /**
   * Whether to update capacitor.config.ts/json
   * @default true
   */
  updateCapacitorConfig?: boolean;
}

export interface UpdateVersionResult {
  success: boolean;
  message: string;
  updatedFiles: string[];
  newVersion: string;
  newBuildNumber: number;
  platform: string;
}

export interface TrapezeConfigOptions {
  /**
   * Path to Trapeze configuration file
   */
  configPath: string;

  /**
   * Platform to apply configuration
   */
  platform: 'android' | 'ios' | 'both';

  /**
   * Variables to pass to Trapeze
   */
  variables?: Record<string, any>;
}

export interface TrapezeConfigResult {
  success: boolean;
  message: string;
  appliedPlatforms: string[];
  modifiedFiles: string[];
}

export interface VersionStatusResult {
  isUpToDate: boolean;
  currentVersion: string;
  currentBuildNumber: number;
  suggestions: string[];
  lastCheck: string;
}

export interface VersionInfo {
  version: string;
  buildNumber: string;
  platform: string;
  lastUpdated?: string;
}

export interface PackageInfo extends VersionInfo {
  name: string;
  description?: string;
  author?: string;
}

export interface UpdateHistory {
  timestamp: string;
  previousVersion: string;
  newVersion: string;
  method: 'manual' | 'cli' | 'plugin';
  platform: string;
  buildNumber: number;
}
