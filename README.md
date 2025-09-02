# @capacitor-community/version-manager

🔥 **Capacitor Version Manager** - Automated version management for Ionic projects with TypeScript support

## Features

- 🚀 **Automated Version Management**: Update versions across all platforms with a single command
- 🎯 **Multi-Platform Support**: Supports Android, iOS, and web platforms
- 🔧 **Trapeze Integration**: Built-in support for Trapeze configuration files
- 💻 **CLI Interface**: Powerful command-line interface for version management
- 🏗️ **TypeScript Support**: Full TypeScript support with type definitions
- 📱 **Native API Access**: Get version information directly from native platforms
- 🎨 **Capacitor Plugin**: Works seamlessly with Capacitor projects

## Installation

```bash
npm install @capacitor-community/version-manager
npx cap sync
```

## Quick Start

### 1. Install the plugin

```bash
npm install @capacitor-community/version-manager
```

### 2. Initialize (First Time Setup)

**🎯 Important:** Run this command in your Capacitor/Ionic project root:

```bash
npx cap-version init
```

This will:
- ✅ Create `trapeze.config.yaml` configuration
- ✅ Set your initial version to **0.0.1** (build number: 10)
- ✅ Update `package.json` and `capacitor.config.ts`
- ✅ Apply version to Android and iOS native files

**After initialization, your project starts at version `0.0.1` with build number `10`.**

### 3. Update your app version

```bash
npx cap-version update 1.2.3
```

This will update:
- `package.json`
- `capacitor.config.ts/json`
- Android `build.gradle` files
- iOS project files

### 3. Check current version status

```bash
npx cap-version check
```

## CLI Commands

### Initialize
```bash
npx cap-version init [options]
```

Options:
- `-c, --config <path>`: Custom config file path

### Update Version
```bash
npx cap-version update <version> [options]
```

Options:
- `-b, --build <number>`: Build number (auto-increment if not specified)
- `-p, --platform <platform>`: Platform to update (android|ios|both)
- `-c, --config <path>`: Custom Trapeze config path
- `--no-package`: Skip package.json update
- `--no-capacitor`: Skip capacitor.config update

Examples:
```bash
# Update version to 1.2.3 on all platforms
npx cap-version update 1.2.3

# Update only Android with specific build number
npx cap-version update 1.2.3 -p android -b 100

# Update with custom config
npx cap-version update 1.2.3 -c ./custom-trapeze.config.yaml
```

### Check Version Status
```bash
npx cap-version check [options]
```

Options:
- `-v, --verbose`: Show detailed information

### Compare with Store Versions 🆕
```bash
npx cap-version compare-stores [options]
```

Compare your local version with published store versions to ensure you can publish:

Options:
- `--verbose`: Show detailed comparison information

**Features:**
- ✅ **Check Google Play Store** (requires google-services.json)
- ✅ **Check Apple App Store** (uses iTunes Search API)  
- ✅ **Compare versions and build numbers**
- ✅ **Validate publishing readiness**
- ✅ **Show detailed status per platform**

**Example output:**
```
🔍 Comparing versions with app stores...
📱 Local Version: 2.1.4 (Build: 201040)

🤖 Android (Google Play):
   Store Version: 2.1.3 (Build: 201030)
   Status: ✅ Ready to publish

🍎 iOS (App Store):
   Store Version: 2.1.2 (Build: 201020) 
   Status: ✅ Ready to publish

🎉 Ready to publish on all platforms!
```

**Setup Requirements:**
- **Android**: Add `google-services.json` to enable Google Play API
- **iOS**: Uses public iTunes Search API (no setup required)
- **Auto-detection**: Automatically finds app IDs from your project files

For detailed configuration instructions, see [STORE-COMPARISON-GUIDE.md](./STORE-COMPARISON-GUIDE.md).

### Show Package Info
```bash
npx cap-version info [options]
```

Options:
- `-j, --json`: Output as JSON

### Apply Trapeze Configuration
```bash
npx cap-version trapeze <config> [options]
```

Options:
- `-p, --platform <platform>`: Platform to apply (android|ios|both)
- `-v, --variables <vars>`: Variables in JSON format

## Plugin API

### Import

```typescript
import { VersionManager } from '@capacitor-community/version-manager';
```

### Methods

#### getVersion()

Get current version information.

```typescript
const version = await VersionManager.getVersion();
console.log(version);
// { version: "1.2.3", buildNumber: "100", platform: "ios" }
```

#### getPackageInfo()

Get complete package information.

```typescript
const info = await VersionManager.getPackageInfo();
console.log(info);
// {
//   name: "com.example.app",
//   version: "1.2.3",
//   buildNumber: "100",
//   platform: "ios",
//   description: "My App",
//   author: "Developer"
// }
```

#### updateVersion(options)

Update version programmatically.

```typescript
const result = await VersionManager.updateVersion({
  version: '1.2.3',
  buildNumber: 100,
  platform: 'both',
  updatePackageJson: true,
  updateCapacitorConfig: true
});

if (result.success) {
  console.log('Version updated successfully!');
  console.log('Updated files:', result.updatedFiles);
}
```

#### checkVersionStatus()

Check current version status.

```typescript
const status = await VersionManager.checkVersionStatus();
console.log('Is up to date:', status.isUpToDate);
console.log('Current version:', status.currentVersion);
```

#### applyTrapezeConfig(options)

Apply Trapeze configuration.

```typescript
const result = await VersionManager.applyTrapezeConfig({
  configPath: './trapeze.config.yaml',
  platform: 'both',
  variables: { version: '1.2.3', buildNumber: 100 }
});

if (result.success) {
  console.log('Configuration applied to:', result.appliedPlatforms);
}
```

## Configuration

### Trapeze Configuration

The plugin uses Trapeze for cross-platform configuration management. Here's a sample `trapeze.config.yaml`:

```yaml
platforms:
  android:
    android/app/build.gradle:
      - replace:
          find: versionName ".*"
          replace: versionName "$VERSION"
      - replace:
          find: versionCode \d+
          replace: versionCode $BUILD_NUMBER
  ios:
    ios/App/App.xcodeproj/project.pbxproj:
      - replace:
          find: MARKETING_VERSION = .*;
          replace: MARKETING_VERSION = $VERSION;
      - replace:
          find: CURRENT_PROJECT_VERSION = .*;
          replace: CURRENT_PROJECT_VERSION = $BUILD_NUMBER;
```

### Variables

You can use the following variables in your Trapeze configuration:

- `$VERSION`: The version number (e.g., "1.2.3")
- `$BUILD_NUMBER`: The build number (e.g., 100)

## Platform Support

| Platform | Support | Version Info | Update Support |
|----------|---------|-------------|----------------|
| Web      | ✅      | ✅          | ✅             |
| Android  | ✅      | ✅          | ✅ (via CLI)   |
| iOS      | ✅      | ✅          | ✅ (via CLI)   |

## TypeScript Support

The plugin is written in TypeScript and provides full type definitions:

```typescript
import type {
  VersionManagerPlugin,
  UpdateVersionOptions,
  UpdateVersionResult,
  VersionStatusResult,
  PackageInfo
} from '@capacitor-community/version-manager';
```

## Integration with Existing Projects

### Ionic Projects

```bash
# In your Ionic project
npm install @capacitor-community/version-manager
npx cap sync
npx cap-version init
npx cap-version update 1.0.0
```

### React Projects

```typescript
import { VersionManager } from '@capacitor-community/version-manager';
import { useEffect, useState } from 'react';

function VersionInfo() {
  const [version, setVersion] = useState('');

  useEffect(() => {
    VersionManager.getVersion().then(info => {
      setVersion(info.version);
    });
  }, []);

  return <div>Version: {version}</div>;
}
```

### Vue Projects

```vue
<template>
  <div>Version: {{ version }}</div>
</template>

<script setup>
import { VersionManager } from '@capacitor-community/version-manager';
import { ref, onMounted } from 'vue';

const version = ref('');

onMounted(async () => {
  const info = await VersionManager.getVersion();
  version.value = info.version;
});
</script>
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for details.

## Support

- 📖 [Documentation](https://github.com/InfoArkitectura/capacitor-version-plugin)
- 🐛 [Issue Tracker](https://github.com/InfoArkitectura/capacitor-version-plugin/issues)
- 💬 [Discussions](https://github.com/InfoArkitectura/capacitor-version-plugin/discussions)

---

Made with ❤️ by InfoArkitectura
