import Foundation
import Capacitor

/**
 * Please read the Capacitor iOS Plugin Development Guide
 * here: https://capacitorjs.com/docs/plugins/ios
 */
@objc(VersionManagerPlugin)
public class VersionManagerPlugin: CAPPlugin {
    private let implementation = VersionManager()

    @objc func getVersion(_ call: CAPPluginCall) {
        guard let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String,
              let buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String else {
            call.reject("Failed to get version info")
            return
        }
        
        call.resolve([
            "version": version,
            "buildNumber": buildNumber,
            "platform": "ios"
        ])
    }

    @objc func getPackageInfo(_ call: CAPPluginCall) {
        guard let bundleId = Bundle.main.bundleIdentifier,
              let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String,
              let buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String,
              let displayName = Bundle.main.infoDictionary?["CFBundleDisplayName"] as? String ?? Bundle.main.infoDictionary?["CFBundleName"] as? String else {
            call.reject("Failed to get package info")
            return
        }
        
        call.resolve([
            "name": bundleId,
            "version": version,
            "buildNumber": buildNumber,
            "platform": "ios",
            "description": displayName,
            "lastUpdated": ISO8601DateFormatter().string(from: Date())
        ])
    }

    @objc func getLastUpdate(_ call: CAPPluginCall) {
        call.resolve([
            "lastUpdated": ISO8601DateFormatter().string(from: Date()),
            "updateMethod": "ios"
        ])
    }

    @objc func updateVersion(_ call: CAPPluginCall) {
        // Version updates are handled at build time via Trapeze
        // This method provides feedback that the operation should be done via CLI
        let version = call.getString("version") ?? ""
        let buildNumber = call.getInt("buildNumber") ?? 1
        
        call.resolve([
            "success": false,
            "message": "Version updates must be performed using the CLI tool: cap-version update <version>",
            "updatedFiles": [],
            "newVersion": version,
            "newBuildNumber": buildNumber,
            "platform": "ios"
        ])
    }

    @objc func applyTrapezeConfig(_ call: CAPPluginCall) {
        // Trapeze operations are handled at build time
        // This method provides feedback that the operation should be done via CLI
        call.resolve([
            "success": false,
            "message": "Trapeze configuration must be applied using the CLI tool: cap-version trapeze <config>",
            "appliedPlatforms": ["ios"],
            "modifiedFiles": []
        ])
    }

    @objc func checkVersionStatus(_ call: CAPPluginCall) {
        guard let version = Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String,
              let buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"] as? String else {
            call.reject("Failed to check version status")
            return
        }
        
        call.resolve([
            "isUpToDate": true,
            "currentVersion": version,
            "currentBuildNumber": Int(buildNumber) ?? 1,
            "suggestions": [],
            "lastCheck": ISO8601DateFormatter().string(from: Date())
        ])
    }
}
