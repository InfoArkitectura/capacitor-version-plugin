import Foundation

@objc public class VersionManager: NSObject {
    @objc public func getVersion() -> String {
        return Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0"
    }
    
    @objc public func getBuildNumber() -> String {
        return Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"
    }
    
    @objc public func getPlatform() -> String {
        return "ios"
    }
}
