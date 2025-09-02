<!--
Thank you for adding a new plugin proposal!

Please fill out the following template.
-->

## Plugin Request
<!--
Propose a human-readable name for the plugin as well as its package name.
-->

**Name**: Capacitor Version Manager
**Package**: `@capacitor-community/version-manager`

### Platform(s)
<!--
List the platforms for which this plugin should work.
-->

- ✅ **Web** (TypeScript implementation)
- ✅ **Android** (Java implementation) 
- ✅ **iOS** (Swift implementation)

### Existing Solutions
<!--
List any existing Capacitor or Cordova plugins. If you've used any of them, be sure to include your thoughts.
-->

**Current approaches are fragmented and manual:**

1. **Manual file updates**: Developers manually edit `package.json`, `capacitor.config.ts`, `android/app/build.gradle`, and iOS project files
2. **Build scripts**: Custom bash/PowerShell scripts that are project-specific and error-prone
3. **Trapeze standalone**: Requires manual configuration and doesn't handle version-to-build-number conversion
4. **Cordova plugins**: Legacy solutions like `cordova-plugin-app-version` only provide reading capabilities

**Problems with existing solutions:**
- ❌ No standardized build number generation from semantic versions
- ❌ Manual process prone to human error
- ❌ No hotfix overflow handling
- ❌ Platform-specific implementations required
- ❌ No unified CLI for version management
- ❌ No integration between version updating and native platform updates

### Description
<!--
Describe the plugin and its features.
-->

A comprehensive Capacitor plugin for **automated version management** in Ionic/Capacitor projects. Provides a professional CLI and programmatic API for managing versions across all platforms with smart build number generation and Trapeze integration.

## 🎯 Key Features

### Smart Versioning System
- **MMmmpph Format**: Converts semantic versions to numeric build codes (e.g., `21.15.3` → `21015030`)
- **Hotfix Support**: Automatic overflow handling (hotfix 10+ automatically becomes patch increment)
- **Auto-increment**: Commands for major, minor, patch, and hotfix updates

### Professional CLI
```bash
cap-version init                    # Initialize with 0.0.1
cap-version update 2.5.3           # Manual version update  
cap-version major/minor/patch       # Auto-increment commands
cap-version hotfix                  # Auto-increment hotfix with overflow handling
cap-version reset --force           # Reset to 0.0.1 for fresh development
cap-version info/check/history      # Status and information commands
```

### Multi-Platform Automation
- **Unified Updates**: Single command updates all platforms simultaneously
- **Trapeze Integration**: Automatic native platform file updates
- **File Management**: Updates `package.json`, `capacitor.config.ts`, Android `build.gradle`, iOS project files

### Developer Experience
- **Zero Configuration**: Works out of the box with sensible defaults
- **Safety Features**: Confirmation prompts for destructive operations
- **Clear Messaging**: Detailed output and progress indicators
- **Error Prevention**: Automated process eliminates human error

## 🔧 Technical Implementation

### Build Number System
```
Version 21.15.3 → Build Number 21015030
- Major: 21 → 21 (2 digits, extended to 3: 210xxxxx practical limit)
- Minor: 15 → 015 (3 digits: xx015xxx) 
- Patch: 3 → 03 (2 digits: xxxxx030)
- Hotfix: 0-9 (1 digit: xxxxxxx0-9)
```

### Hotfix Overflow Logic
```
20.15.3 hotfix 9  → 20015039 (normal hotfix)
20.15.3 hotfix 10 → 20.15.4 → 20015040 (automatic patch increment)
20.15.3 hotfix 25 → 20.15.7 → 20015070 (patch +2, hotfix 5)
```

### Files Updated Automatically
- ✅ `package.json` → version
- ✅ `capacitor.config.ts/json` → version  
- ✅ `android/app/build.gradle` → versionName, versionCode
- ✅ `ios/App/App.xcodeproj/project.pbxproj` → MARKETING_VERSION, CURRENT_PROJECT_VERSION

## 🚀 Why This Plugin is Critical

### Current Pain Points
1. **Manual Version Management**: Developers spend time manually updating multiple files
2. **Build Number Inconsistency**: No standard for converting versions to build numbers
3. **Platform Fragmentation**: Different update processes for Android/iOS
4. **Human Error**: Easy to forget updating all required files
5. **Hotfix Complexity**: No standard handling for emergency fixes

### Community Value
- **Standardization**: Establishes best practices for version management in Capacitor
- **Time Saving**: Eliminates repetitive manual tasks
- **Reliability**: Reduces deployment errors and inconsistencies
- **CI/CD Ready**: Fully automatable for professional workflows

## 📦 Installation & Usage

```bash
# Install
npm install @capacitor-community/version-manager

# Initialize (first time - sets version to 0.0.1)
npx cap-version init

# Update version (updates all platforms)
npx cap-version update 2.5.3

# Auto-increment examples
npx cap-version major    # 2.5.3 → 3.0.0
npx cap-version minor    # 2.5.3 → 2.6.0  
npx cap-version patch    # 2.5.3 → 2.5.4
npx cap-version hotfix   # 2.5.3 → 2.5.3 (build +1)
```

## 🛠️ Implementation Status

- ✅ **Complete Implementation**: Fully functional TypeScript + Rollup + Jest
- ✅ **Native Platforms**: Android (Java) and iOS (Swift) implementations
- ✅ **Professional CLI**: Commander.js with comprehensive command structure  
- ✅ **Testing**: Complete Jest test suite
- ✅ **Documentation**: README, CONTRIBUTING, CHANGELOG
- ✅ **Build System**: ESM/CJS compatible, production-ready

---

**This plugin fills a critical gap in the Capacitor ecosystem by providing professional-grade version management tooling that developers need for production applications.**
