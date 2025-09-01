import { VersionManager } from '../plugin';

describe('VersionManager', () => {
  beforeEach(() => {
    // Reset any mocks
    jest.clearAllMocks();
  });

  describe('getVersion', () => {
    it('should return version information', async () => {
      const result = await VersionManager.getVersion();
      
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('buildNumber');
      expect(result).toHaveProperty('platform');
      expect(typeof result.version).toBe('string');
      expect(typeof result.buildNumber).toBe('string');
      expect(typeof result.platform).toBe('string');
    });
  });

  describe('getPackageInfo', () => {
    it('should return package information', async () => {
      const result = await VersionManager.getPackageInfo();
      
      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('buildNumber');
      expect(result).toHaveProperty('platform');
      expect(typeof result.name).toBe('string');
      expect(typeof result.version).toBe('string');
      expect(typeof result.buildNumber).toBe('string');
      expect(typeof result.platform).toBe('string');
    });
  });

  describe('getLastUpdate', () => {
    it('should return last update information', async () => {
      const result = await VersionManager.getLastUpdate();
      
      expect(result).toHaveProperty('lastUpdated');
      expect(result).toHaveProperty('updateMethod');
      expect(typeof result.lastUpdated).toBe('string');
      expect(typeof result.updateMethod).toBe('string');
    });
  });

  describe('updateVersion', () => {
    it('should update version successfully', async () => {
      const options = {
        version: '1.2.3',
        buildNumber: 456,
        platform: 'both' as const,
      };

      const result = await VersionManager.updateVersion(options);
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('updatedFiles');
      expect(result).toHaveProperty('newVersion');
      expect(result).toHaveProperty('newBuildNumber');
      expect(result).toHaveProperty('platform');
      
      expect(result.newVersion).toBe('1.2.3');
      expect(result.newBuildNumber).toBe(456);
    });

    it('should handle missing required parameters', async () => {
      const options = {
        version: '',
      };

      const result = await VersionManager.updateVersion(options);
      
      expect(result.success).toBe(false);
      expect(result.message).toContain('Version');
    });
  });

  describe('checkVersionStatus', () => {
    it('should return version status', async () => {
      const result = await VersionManager.checkVersionStatus();
      
      expect(result).toHaveProperty('isUpToDate');
      expect(result).toHaveProperty('currentVersion');
      expect(result).toHaveProperty('currentBuildNumber');
      expect(result).toHaveProperty('suggestions');
      expect(result).toHaveProperty('lastCheck');
      
      expect(typeof result.isUpToDate).toBe('boolean');
      expect(typeof result.currentVersion).toBe('string');
      expect(typeof result.currentBuildNumber).toBe('number');
      expect(Array.isArray(result.suggestions)).toBe(true);
      expect(typeof result.lastCheck).toBe('string');
    });
  });

  describe('applyTrapezeConfig', () => {
    it('should apply trapeze configuration', async () => {
      const options = {
        configPath: './test-config.yaml',
        platform: 'both' as const,
        variables: { version: '1.0.0', buildNumber: 1 },
      };

      const result = await VersionManager.applyTrapezeConfig(options);
      
      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('appliedPlatforms');
      expect(result).toHaveProperty('modifiedFiles');
      
      expect(Array.isArray(result.appliedPlatforms)).toBe(true);
      expect(Array.isArray(result.modifiedFiles)).toBe(true);
    });
  });
});
