# Store Version Comparison Configuration

This document explains the store version comparison functionality and its limitations.

## 🍎 App Store (iOS) - ✅ FULLY FUNCTIONAL

### iTunes Search API (Public - No Auth Required)

The plugin uses Apple's **public iTunes Search API** to fetch App Store versions:

- ✅ **No authentication required**
- ✅ **Works for any published app**
- ✅ **Real-time data**
- ✅ **Reliable and fast**

This works out of the box and provides real store version data.

## 🤖 Google Play Store (Android) - ⚠️ LIMITED

### The Problem

Unlike Apple, **Google does NOT provide a public API** for Play Store app information. This creates limitations:

- ❌ **No public API like iTunes Search**
- ❌ **Official API only works for your own apps**
- ❌ **Web scraping is blocked by Google**

### Available Options

#### Option 1: Google Play Developer API (Your Own Apps Only)

**When to use**: If you want to check YOUR OWN published apps

**Setup Required**:
1. Enable Google Play Developer API in Google Cloud Console
2. Create Service Account with Play Developer API access
3. Download JSON credentials file
4. Place credentials as `google-play-credentials.json`

```bash
export GOOGLE_APPLICATION_CREDENTIALS="./google-play-credentials.json"
```

**Limitations**:
- ✅ Works perfectly for your own apps
- ❌ Cannot check other developers' apps
- ❌ Complex setup

#### Option 2: Mock/Fallback Data (Default)

**When to use**: For development, testing, or when API access isn't available

**How it works**:
- Returns sensible mock version data
- Allows development to continue
- Provides useful comparison testing

```
📱 Using mock data for Android comparison (Play Store API limitations)
🤖 Android (Google Play):
   Store Version: 1.1.0 (Build: 110000)
   Status: ✅ Ready to publish
```

### App Store Connect API (Advanced - Auth Required)

For more advanced features, you can configure App Store Connect API:

1. **Generate API Key** in App Store Connect
2. **Download .p8 key file**
3. **Configure environment variables:**

```bash
export APP_STORE_CONNECT_KEY_ID="your-key-id"
export APP_STORE_CONNECT_ISSUER_ID="your-issuer-id"
export APP_STORE_CONNECT_PRIVATE_KEY_PATH="./AuthKey_XXXXXXXXXX.p8"
```

## 📋 Usage Examples

### Basic Store Comparison
```bash
# Compare with default settings
npx cap-version compare-stores

# Verbose output with detailed information
npx cap-version compare-stores --verbose
```

### Expected Output
```
🔍 Comparing versions with app stores...
==================================================
📱 Local Version: 1.2.3 (Build: 10203)

🤖 Android (Google Play):
   Store Version: 1.2.2 (Build: 10202)
   Status: ✅ Ready to publish

🍎 iOS (App Store):
   Store Version: 1.2.1 (Build: 10201)
   Status: ✅ Ready to publish

🎉 Ready to publish on all platforms!
```

## 🔧 Configuration Files

### App Identification

The plugin automatically detects your app identifiers from:

- **Android**: `android/app/build.gradle` → `applicationId`
- **iOS**: `capacitor.config.ts` → `appId` or `capacitor.config.json` → `appId`

### Manual Configuration

If automatic detection fails, you can create a `.store-config.json` file:

```json
{
  "android": {
    "packageName": "com.yourcompany.yourapp"
  },
  "ios": {
    "bundleId": "com.yourcompany.yourapp"
  }
}
```

## ⚠️ Important Notes

1. **First Publication**: If your app isn't published yet, comparison will show warnings
2. **Version Format**: Ensure your versions follow semantic versioning (X.Y.Z)
3. **Build Numbers**: iOS and Android have different build number requirements
4. **Rate Limits**: Public APIs have rate limits - avoid frequent requests

## 🚀 Integration with CI/CD

Add store comparison to your release workflow:

```yaml
# GitHub Actions example
- name: Compare Store Versions
  run: |
    npx cap-version compare-stores
    if [ $? -ne 0 ]; then
      echo "Version comparison failed - cannot publish"
      exit 1
    fi
```

## 🔍 Troubleshooting

### Common Issues

1. **"App not found in App Store"**
   - App might not be published yet
   - Bundle ID might be incorrect
   - App might be removed from store

2. **"Google Play credentials not found"**
   - Check `google-play-credentials.json` exists
   - Verify `GOOGLE_APPLICATION_CREDENTIALS` environment variable

3. **"Could not determine app ID"**
   - Check `capacitor.config.ts` has correct `appId`
   - Verify `android/app/build.gradle` has `applicationId`

### Enable Debug Mode

```bash
# Enable verbose logging
DEBUG=store-comparison npx cap-version compare-stores --verbose
```
