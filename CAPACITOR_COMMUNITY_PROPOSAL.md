# 🔥 Capacitor Version Manager Plugin - Proposal

## Plugin Overview

**Name**: `@capacitor-community/version-manager`  
**Category**: Development Tools / Build Automation  
**Author**: InfoArkitectura  
**Status**: Complete Implementation ✅  

## Description

A comprehensive Capacitor plugin for automated version management in Ionic/Capacitor projects. Provides a professional CLI and programmatic API for managing versions across all platforms with smart build number generation and Trapeze integration.

## Key Features

### 🎯 Smart Versioning System
- **MMmmpph Format**: Converts semantic versions to numeric build codes
- **Hotfix Support**: Automatic overflow handling (hotfix 10+ → patch increment)
- **Auto-increment**: Commands for major, minor, patch, and hotfix updates

### 🛠️ Professional CLI
```bash
cap-version init                    # Initialize with 0.0.1
cap-version update 2.5.3           # Manual version update
cap-version major/minor/patch       # Auto-increment
cap-version hotfix                  # Auto-increment hotfix
cap-version reset --force           # Reset to 0.0.1
cap-version info/check/history      # Status and information
```

### 📱 Multi-Platform Support
- **Web**: TypeScript implementation
- **Android**: Java implementation with build.gradle updates
- **iOS**: Swift implementation with Xcode project updates
- **Trapeze Integration**: Automatic native platform file updates

### 🔧 Developer Experience
- **Zero Configuration**: Works out of the box
- **Trapeze Config**: Auto-generated configuration
- **Safety Features**: Confirmation prompts for destructive operations
- **Clear Messaging**: Detailed output and progress indicators

## Technical Implementation

### Architecture
- **TypeScript**: Full type safety and modern ES modules
- **Build System**: Rollup with ESM/CJS compatibility
- **Testing**: Jest test suite with comprehensive coverage
- **CLI**: Commander.js with professional command structure

### Build Number System
```
Version 21.15.3 → Build Number 21015030
- Major: 21 → 21 (3 digits: 210xxxxx, but limited to 2 for practical use)
- Minor: 15 → 150 (3 digits: xx015xxx)
- Patch: 3 → 30 (2 digits: xxxxx030)
- Hotfix: 0-9 (1 digit: xxxxxxx0-9)
```

### Hotfix Overflow Logic
```
20.15.3 hotfix 9  → 20015039 (normal)
20.15.3 hotfix 10 → 20.15.4   → 20015040 (patch increment)
20.15.3 hotfix 25 → 20.15.5   → 20015050 (patch +2, hotfix 5)
```

## Files Updated Automatically

- ✅ `package.json` → version
- ✅ `capacitor.config.ts/json` → version
- ✅ `android/app/build.gradle` → versionName, versionCode
- ✅ `ios/App/App.xcodeproj/project.pbxproj` → MARKETING_VERSION, CURRENT_PROJECT_VERSION

## API Methods

```typescript
// Get version information
await VersionManager.getVersion();
await VersionManager.getPackageInfo();

// Update versions
await VersionManager.updateVersion({
  version: '2.5.3',
  buildNumber: 2005030,
  platform: 'both'
});

// Status and configuration
await VersionManager.checkVersionStatus();
await VersionManager.applyTrapezeConfig(config);
```

## Installation & Usage

```bash
# Install
npm install @capacitor-community/version-manager

# Initialize (first time)
npx cap-version init
# → Creates trapeze.config.yaml
# → Sets initial version to 0.0.1 (build 10)
# → Updates all platform files

# Update version
npx cap-version update 2.5.3
# → Version: 2.5.3, Build: 2005030
# → Updates package.json, capacitor.config.ts, Android, iOS

# Auto-increment
npx cap-version major    # 2.5.3 → 3.0.0
npx cap-version minor    # 2.5.3 → 2.6.0
npx cap-version patch    # 2.5.3 → 2.5.4
npx cap-version hotfix   # 2.5.3 → 2.5.3 (build +1)
```

## Why This Plugin is Needed

### Current Pain Points
1. **Manual Version Management**: Developers manually update multiple files
2. **Build Number Inconsistency**: No standard for converting versions to build numbers
3. **Platform Fragmentation**: Different update processes for Android/iOS
4. **Human Error**: Easy to forget updating all required files
5. **Hotfix Complexity**: No standard handling for emergency fixes

### Our Solution
1. **One Command Updates Everything**: Single CLI command updates all platforms
2. **Smart Build Numbers**: Consistent, predictable build number generation
3. **Unified Platform Handling**: Trapeze integration for seamless updates
4. **Error Prevention**: Automated process eliminates human error
5. **Professional Workflow**: Complete tooling for version lifecycle

## Community Value

### For Individual Developers
- **Time Saving**: Eliminates manual version management
- **Consistency**: Standardized versioning across projects
- **Reliability**: Reduces deployment errors

### For Teams
- **Standardization**: Common tooling across all projects
- **CI/CD Integration**: Automatable version management
- **Documentation**: Clear version history and tracking

### For Capacitor Ecosystem
- **Best Practices**: Establishes standard for version management
- **Tool Integration**: Works seamlessly with existing Capacitor tooling
- **Community Growth**: Reduces barrier to professional development workflows

## Maintenance Commitment

- ✅ **Active Development**: Responsive to issues and feature requests
- ✅ **Documentation**: Comprehensive docs and examples
- ✅ **Testing**: Full test coverage and CI/CD
- ✅ **Compatibility**: Keep up with Capacitor updates
- ✅ **Community**: Support users and gather feedback

## Repository Status

- **Code**: Complete and production-ready
- **Tests**: Comprehensive Jest test suite
- **Documentation**: README, CONTRIBUTING, CHANGELOG
- **Examples**: Working test projects
- **Build**: Functional TypeScript + Rollup pipeline

## Proposed Package Name

`@capacitor-community/version-manager`

## License

MIT License

---

**This plugin fills a critical gap in the Capacitor ecosystem by providing professional-grade version management tooling that developers need for production applications.**
