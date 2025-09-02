# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 🆕 **Store Version Comparison**: New `compare-stores` command to compare local versions with Google Play and App Store
- ✅ **iTunes Search API Integration**: Automatic App Store version checking
- ✅ **Google Play API Support**: Framework for Google Play Store version checking (requires google-services.json)
- ✅ **Smart Version Validation**: Semantic version and build number comparison
- ✅ **Publishing Readiness Check**: Validate if local version is ready for store submission
- ✅ **Detailed Store Status**: Per-platform comparison results with clear error/warning messages
- 📖 **Store Comparison Guide**: Comprehensive documentation for store API setup

### Technical Details
- Added `StoreComparison` class with comprehensive store version checking
- Integrated iTunes Search API for public App Store version lookups
- Added automatic app ID detection from Capacitor config and Android build files
- Implemented robust error handling for store API failures
- Added verbose mode for detailed comparison debugging

## [1.2.3] - Previous Release

### Added
- Initial release of Capacitor Version Manager
- Multi-platform version management (Android, iOS, Web)
- CLI interface with comprehensive commands
- Trapeze integration for cross-platform configuration
- TypeScript support with full type definitions
- Native plugin implementation for Android and iOS
- Web implementation for development and testing
- Automated version updating across all platforms
- Package information retrieval from native platforms
- Version status checking and validation
- Build number management and auto-increment
- Custom Trapeze configuration support
- JSON and YAML configuration file support

### CLI Commands
- `cap-version init` - Initialize version manager in project
- `cap-version update <version>` - Update version across platforms
- `cap-version check` - Check current version status
- `cap-version info` - Show package information
- `cap-version history` - Show version update history
- `cap-version trapeze <config>` - Apply Trapeze configuration

### Plugin API Methods
- `getVersion()` - Get current version information
- `getPackageInfo()` - Get complete package information
- `getLastUpdate()` - Get last update information
- `updateVersion(options)` - Update version programmatically
- `applyTrapezeConfig(options)` - Apply Trapeze configuration
- `checkVersionStatus()` - Check version status

### Features
- Cross-platform version synchronization
- Build number auto-increment
- Custom configuration file support
- TypeScript interface definitions
- Native platform integration
- CLI progress indicators
- Error handling and validation
- JSON and verbose output options
- Platform-specific updates (android|ios|both)
- Variable substitution in Trapeze configs

### Documentation
- Comprehensive README with examples
- Contributing guidelines
- TypeScript interface documentation
- CLI command reference
- Integration examples for React, Vue, and Ionic
- Platform support matrix
- Configuration file examples

## [1.0.0] - TBD

### Added
- First stable release
- Full platform support (Android, iOS, Web)
- Complete CLI interface
- Native plugin implementations
- Comprehensive documentation
- Test coverage
- TypeScript support
