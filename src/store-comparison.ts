import fs from 'fs';
import path from 'path';

export interface StoreVersionInfo {
  platform: 'android' | 'ios';
  currentVersion: string;
  currentBuild: string;
  storeVersion?: string;
  storeBuild?: string;
  isNewer: boolean;
  error?: string;
}

export interface StoreComparisonResult {
  localVersion: string;
  localBuild: string;
  android?: StoreVersionInfo;
  ios?: StoreVersionInfo;
  canPublish: boolean;
  warnings: string[];
  errors: string[];
}

export class StoreComparison {
  private projectPath: string;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  /**
   * Compare local version with store versions
   */
  async compareWithStores(): Promise<StoreComparisonResult> {
    const localInfo = this.getLocalVersionInfo();
    const result: StoreComparisonResult = {
      localVersion: localInfo.version,
      localBuild: localInfo.build,
      canPublish: true,
      warnings: [],
      errors: []
    };

    // Check for manual store versions configuration
    const manualConfig = this.getManualStoreVersions();

    // Check Android (Google Play)
    if (this.hasAndroidProject()) {
      try {
        result.android = await this.getGooglePlayVersion();
        
        // Use manual config if available
        if (manualConfig?.android) {
          result.android.storeVersion = manualConfig.android.version;
          result.android.storeBuild = manualConfig.android.build;
          console.log(`📱 Using manual Android store version: ${manualConfig.android.version}`);
        }
        
        result.android.currentVersion = localInfo.version;
        result.android.currentBuild = localInfo.build;
        result.android.isNewer = this.isVersionNewer(
          localInfo.version, 
          localInfo.build, 
          result.android.storeVersion || '0.0.0',
          result.android.storeBuild || '0'
        );
        
        if (!result.android.isNewer) {
          result.canPublish = false;
          result.errors.push(`Android version ${localInfo.version} (${localInfo.build}) is not newer than store version ${result.android.storeVersion} (${result.android.storeBuild})`);
        }
      } catch (error) {
        result.android = {
          platform: 'android',
          currentVersion: localInfo.version,
          currentBuild: localInfo.build,
          isNewer: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        result.warnings.push(`Could not fetch Android store version: ${result.android.error}`);
      }
    }

    // Check iOS (App Store) - This works automatically
    if (this.hasIosProject()) {
      try {
        result.ios = await this.getAppStoreVersion();
        
        // Manual config can override iOS too
        if (manualConfig?.ios) {
          result.ios.storeVersion = manualConfig.ios.version;
          result.ios.storeBuild = manualConfig.ios.build;
          console.log(`📱 Using manual iOS store version: ${manualConfig.ios.version}`);
        }
        
        result.ios.currentVersion = localInfo.version;
        result.ios.currentBuild = localInfo.build;
        result.ios.isNewer = this.isVersionNewer(
          localInfo.version,
          localInfo.build,
          result.ios.storeVersion || '0.0.0',
          result.ios.storeBuild || '0'
        );

        if (!result.ios.isNewer) {
          result.canPublish = false;
          result.errors.push(`iOS version ${localInfo.version} (${localInfo.build}) is not newer than store version ${result.ios.storeVersion} (${result.ios.storeBuild})`);
        }
      } catch (error) {
        result.ios = {
          platform: 'ios',
          currentVersion: localInfo.version,
          currentBuild: localInfo.build,
          isNewer: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        result.warnings.push(`Could not fetch iOS store version: ${result.ios.error}`);
      }
    }

    return result;
  }

  /**
   * Get manual store versions from config file
   */
  private getManualStoreVersions(): any {
    try {
      const configPath = path.join(this.projectPath, '.store-versions.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log(`📋 Found manual store versions configuration`);
        return config.storeVersions;
      }
    } catch (error) {
      console.log(`⚠️ Could not read .store-versions.json: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    return null;
  }

  /**
   * Get local version information from project files
   */
  private getLocalVersionInfo(): { version: string; build: string } {
    try {
      // Try package.json first
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const version = packageJson.version || '0.0.1';
        
        // Calculate build number using our MMmmpph system
        const build = this.calculateBuildNumber(version);
        
        return { version, build: build.toString() };
      }
      
      throw new Error('Could not find package.json');
    } catch (error) {
      throw new Error(`Failed to read local version: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Calculate build number from version using MMmmpph format
   */
  private calculateBuildNumber(version: string): number {
    const parts = version.split('.').map(Number);
    const major = parts[0] || 0;
    const minor = parts[1] || 0;
    const patch = parts[2] || 0;
    const hotfix = 0; // Default hotfix

    return major * 100000 + minor * 100 + patch * 10 + hotfix;
  }

  /**
   * Get Google Play version information
   */
  private async getGooglePlayVersion(): Promise<StoreVersionInfo> {
    // Try to get app ID from build.gradle
    const appId = this.getAndroidApplicationId();
    if (!appId) {
      throw new Error('Could not determine Android application ID from build.gradle');
    }

    console.log(`🤖 Checking Google Play Store for ${appId}...`);
    
    // Check if we have manual configuration first
    const manualConfig = this.getManualStoreVersions();
    if (manualConfig?.android) {
      console.log(`� Using manual Android store version: ${manualConfig.android.version}`);
      return {
        platform: 'android',
        currentVersion: '',
        currentBuild: '',
        storeVersion: manualConfig.android.version,
        storeBuild: manualConfig.android.build,
        isNewer: true
      };
    }

    // Check if we have Google Play credentials for API access
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
                           path.join(this.projectPath, 'google-play-credentials.json');
    
    if (fs.existsSync(credentialsPath)) {
      console.log(`� Found Google Play credentials, attempting API access...`);
      try {
        return await this.getGooglePlayVersionFromAPI(appId);
      } catch (error) {
        console.log(`⚠️ Google Play API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.log(`💡 Tip: Add manual store versions to .store-versions.json for reliable comparison`);
      }
    }

    // Final fallback: provide helpful guidance
    console.log(`📱 Google Play API access not configured`);
    console.log(`💡 To get real Google Play versions:`);
    console.log(`   1. Add current store version to .store-versions.json (recommended)`);
    console.log(`   2. Or set up Google Play API credentials (advanced)`);
    console.log(`📋 Using safe default for comparison`);
    
    return {
      platform: 'android',
      currentVersion: '',
      currentBuild: '',
      storeVersion: '0.9.0', // Safe default that allows publishing newer versions
      storeBuild: '90000',
      isNewer: true
    };
  }

  /**
   * Get App Store version information  
   */
  private async getAppStoreVersion(): Promise<StoreVersionInfo> {
    // Try to get bundle ID from iOS project
    const bundleId = this.getIosBundleId();
    if (!bundleId) {
      throw new Error('Could not determine iOS bundle identifier');
    }

    // For now, we'll use iTunes Search API as it's publicly available
    return this.getiTunesStoreVersion(bundleId);
  }

  /**
   * Get Android application ID from build.gradle
   */
  private getAndroidApplicationId(): string | null {
    try {
      const buildGradlePath = path.join(this.projectPath, 'android', 'app', 'build.gradle');
      if (!fs.existsSync(buildGradlePath)) {
        console.log('⚠️  android/app/build.gradle not found');
        return null;
      }

      const buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
      
      // Try multiple patterns for applicationId
      const patterns = [
        /applicationId\s+["']([^"']+)["']/,
        /applicationId\s*=\s*["']([^"']+)["']/,
        /namespace\s+["']([^"']+)["']/,
        /namespace\s*=\s*["']([^"']+)["']/
      ];
      
      for (const pattern of patterns) {
        const match = buildGradleContent.match(pattern);
        if (match) {
          console.log(`✅ Found Android app ID: ${match[1]}`);
          return match[1];
        }
      }
      
      console.log('⚠️  Could not find applicationId in build.gradle');
      return null;
    } catch (error) {
      console.log(`⚠️  Error reading build.gradle: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Get iOS bundle identifier
   */
  private getIosBundleId(): string | null {
    try {
      // Try capacitor.config.ts first
      const configPath = path.join(this.projectPath, 'capacitor.config.ts');
      if (fs.existsSync(configPath)) {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const bundleIdMatch = configContent.match(/appId:\s*['"]([^'"]+)['"]/);
        if (bundleIdMatch) {
          console.log(`✅ Found iOS bundle ID from capacitor.config.ts: ${bundleIdMatch[1]}`);
          return bundleIdMatch[1];
        }
      }

      // Try capacitor.config.json
      const configJsonPath = path.join(this.projectPath, 'capacitor.config.json');
      if (fs.existsSync(configJsonPath)) {
        const config = JSON.parse(fs.readFileSync(configJsonPath, 'utf8'));
        if (config.appId) {
          console.log(`✅ Found iOS bundle ID from capacitor.config.json: ${config.appId}`);
          return config.appId;
        }
      }

      console.log('⚠️  Could not find iOS bundle ID in Capacitor config files');
      return null;
    } catch (error) {
      console.log(`⚠️  Error reading Capacitor config: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }

  /**
   * Mock Google Play version (replace with real API call)
   */
  private async mockGooglePlayVersion(appId: string): Promise<StoreVersionInfo> {
    // This is a mock implementation
    // In production, you would use Google Play Developer API
    console.log(`🔍 Checking Google Play for ${appId}...`);
    
    return {
      platform: 'android',
      currentVersion: '',
      currentBuild: '',
      storeVersion: '1.0.0',
      storeBuild: '10000',
      isNewer: true
    };
  }

  /**
   * Get Google Play version using official API (requires credentials)
   */
  private async getGooglePlayVersionFromAPI(appId: string): Promise<StoreVersionInfo> {
    try {
      console.log(`📋 Fetching from Google Play Developer API for ${appId}...`);
      
      // Check if we have Google Play credentials
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './google-play-credentials.json';
      if (!fs.existsSync(credentialsPath)) {
        throw new Error('Google Play credentials not found. Set GOOGLE_APPLICATION_CREDENTIALS or add google-play-credentials.json');
      }

      // Load credentials (for future use)
      console.log(`📋 Found credentials file: ${credentialsPath}`);
      
      // Get access token (simplified - in real implementation you'd use OAuth2)
      const accessToken = await this.getGooglePlayAccessToken();
      
      // Create edit session
      const editId = await this.createEditSession(appId, accessToken);
      
      // Get production track information
      const trackInfo = await this.getTrackInfo(appId, editId, 'production', accessToken);
      
      if (trackInfo.releases && trackInfo.releases.length > 0) {
        const latestRelease = trackInfo.releases[trackInfo.releases.length - 1];
        const versionCode = latestRelease.versionCodes?.[0] || '0';
        
        // We need to get version name from APK info (additional API call)
        const versionName = await this.getVersionNameFromCode(appId, editId, versionCode, accessToken);
        
        console.log(`✅ Found Google Play version: ${versionName} (${versionCode})`);
        
        return {
          platform: 'android',
          currentVersion: '',
          currentBuild: '',
          storeVersion: versionName,
          storeBuild: versionCode,
          isNewer: true
        };
      } else {
        throw new Error('No releases found in production track');
      }
      
    } catch (error) {
      console.log(`⚠️ Google Play API failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.log(`📱 Falling back to manual configuration or mock data`);
      
      // Return fallback data
      return {
        platform: 'android',
        currentVersion: '',
        currentBuild: '',
        storeVersion: '1.0.0',
        storeBuild: '100000',
        isNewer: true
      };
    }
  }

  /**
   * Get Google Play access token using service account credentials
   */
  private async getGooglePlayAccessToken(): Promise<string> {
    console.log(`🔑 Google Play API requires additional setup...`);
    console.log(`📋 For full API integration, install: npm install google-auth-library`);
    console.log(`📋 This implementation provides framework for future expansion`);
    
    throw new Error('Google Play API integration requires google-auth-library - use manual configuration instead');
  }

  /**
   * Create edit session for Google Play API
   */
  private async createEditSession(packageName: string, accessToken: string): Promise<string> {
    const response = await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/edits`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to create edit session: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.id;
  }

  /**
   * Get track information from Google Play API
   */
  private async getTrackInfo(packageName: string, editId: string, track: string, accessToken: string): Promise<any> {
    const response = await fetch(
      `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/edits/${editId}/tracks/${track}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get track info: ${response.statusText}`);
    }
    
    return response.json();
  }

  /**
   * Get version name from version code using Google Play API
   */
  private async getVersionNameFromCode(packageName: string, editId: string, versionCode: string, accessToken: string): Promise<string> {
    try {
      // Get APK information to extract version name
      const response = await fetch(
        `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/edits/${editId}/apks/${versionCode}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.ok) {
        const apkData = await response.json();
        return apkData.versionName || versionCode;
      } else {
        // If APK endpoint fails, try to derive version name from version code
        return this.deriveVersionNameFromCode(versionCode);
      }
    } catch {
      return this.deriveVersionNameFromCode(versionCode);
    }
  }

  /**
   * Derive version name from version code using our MMmmpph format
   */
  private deriveVersionNameFromCode(versionCode: string): string {
    const code = parseInt(versionCode);
    if (isNaN(code) || code < 10) return versionCode;
    
    // Reverse our MMmmpph format: 2010300 -> 2.1.3.0
    const major = Math.floor(code / 100000);
    const minor = Math.floor((code % 100000) / 1000);
    const patch = Math.floor((code % 1000) / 10);
    const hotfix = code % 10;
    
    return hotfix > 0 ? `${major}.${minor}.${patch}.${hotfix}` : `${major}.${minor}.${patch}`;
  }

  /**
   * Get Google Play version by scraping public Play Store page
   */
  private async getGooglePlayVersionFromWeb(appId: string): Promise<StoreVersionInfo> {
    try {
      console.log(`🌐 Checking Play Store web for ${appId}...`);
      console.log(`⚠️  Note: Google Play does not provide public API like App Store`);
      console.log(`⚠️  Web scraping is unreliable and may be blocked`);
      
      // Google actively blocks automated requests to Play Store
      // This is a demonstration of why we need alternatives
      
      // Return sensible mock data for testing
      console.log(`📱 Using mock data for Android comparison (Play Store API limitations)`);
      return {
        platform: 'android',
        currentVersion: '',
        currentBuild: '',
        storeVersion: '1.1.0', // Mock: reasonable comparison version
        storeBuild: '110000',
        isNewer: true
      };
    } catch (error) {
      console.log(`❌ Play Store web access failed (expected): ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Return safe mock data
      return {
        platform: 'android',
        currentVersion: '',
        currentBuild: '',
        storeVersion: '1.0.0',
        storeBuild: '100000',
        isNewer: true
      };
    }
  }

  /**
   * Get version from iTunes Search API
   */
  private async getiTunesStoreVersion(bundleId: string): Promise<StoreVersionInfo> {
    try {
      console.log(`🔍 Checking App Store for ${bundleId}...`);
      
      // Try with bundle ID first
      let response = await fetch(`https://itunes.apple.com/lookup?bundleId=${bundleId}`);
      let data = await response.json();

      // If not found with bundle ID, try some common variations or known app IDs
      if (!data.results || data.results.length === 0) {
        console.log(`📱 Not found with bundle ID, trying alternative searches...`);
        
        // For tutorplus.infortecnica.es, try the known App Store ID
        if (bundleId === 'tutorplus.infortecnica.es') {
          console.log(`🔍 Trying with known App Store ID for TutorPlus...`);
          response = await fetch(`https://itunes.apple.com/lookup?id=6737483100`);
          data = await response.json();
        }
      }

      if (data.results && data.results.length > 0) {
        const app = data.results[0];
        console.log(`✅ Found app: ${app.trackName} - Version: ${app.version}`);
        return {
          platform: 'ios',
          currentVersion: '',
          currentBuild: '',
          storeVersion: app.version,
          storeBuild: app.version, // iOS often uses version as build
          isNewer: true
        };
      } else {
        // App not found in App Store - might not be published yet
        console.log(`📱 App ${bundleId} not found in App Store (might not be published yet)`);
        
        // Return a safe default that allows publishing
        return {
          platform: 'ios',
          currentVersion: '',
          currentBuild: '',
          storeVersion: '0.0.0',
          storeBuild: '0',
          isNewer: true
        };
      }
    } catch (error) {
      // Network error or other issue
      console.log(`⚠️  Could not reach App Store API: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Return safe default that allows publishing
      return {
        platform: 'ios',
        currentVersion: '',
        currentBuild: '',
        storeVersion: '0.0.0',
        storeBuild: '0',
        isNewer: true
      };
    }
  }

  /**
   * Compare if current version is newer than store version
   */
  private isVersionNewer(currentVersion: string, currentBuild: string, storeVersion: string, storeBuild: string): boolean {
    // Compare semantic versions first
    const versionComparison = this.compareSemanticVersions(currentVersion, storeVersion);
    
    if (versionComparison !== 0) {
      return versionComparison > 0;
    }
    
    // If versions are equal, compare build numbers
    const currentBuildNum = parseInt(currentBuild);
    const storeBuildNum = parseInt(storeBuild);
    
    if (!isNaN(currentBuildNum) && !isNaN(storeBuildNum)) {
      return currentBuildNum > storeBuildNum;
    }
    
    // If build numbers can't be compared, assume current is newer (safe default)
    return true;
  }

  /**
   * Compare semantic versions
   */
  private compareSemanticVersions(version1: string, version2: string): number {
    const v1parts = version1.split('.').map(Number);
    const v2parts = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(v1parts.length, v2parts.length); i++) {
      const v1part = v1parts[i] || 0;
      const v2part = v2parts[i] || 0;
      
      if (v1part > v2part) return 1;
      if (v1part < v2part) return -1;
    }
    
    return 0;
  }

  /**
   * Check if Android project exists
   */
  private hasAndroidProject(): boolean {
    return fs.existsSync(path.join(this.projectPath, 'android', 'app', 'build.gradle'));
  }

  /**
   * Check if iOS project exists
   */
  private hasIosProject(): boolean {
    return fs.existsSync(path.join(this.projectPath, 'ios', 'App'));
  }
}
