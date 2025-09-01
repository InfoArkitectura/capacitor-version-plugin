package com.capacitorcommunity.versionmanager;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "VersionManager")
public class VersionManagerPlugin extends Plugin {

    private VersionManager implementation = new VersionManager();

    @PluginMethod
    public void getVersion(PluginCall call) {
        try {
            Context context = getContext();
            PackageManager packageManager = context.getPackageManager();
            String packageName = context.getPackageName();
            PackageInfo packageInfo = packageManager.getPackageInfo(packageName, 0);
            
            JSObject ret = new JSObject();
            ret.put("version", packageInfo.versionName);
            ret.put("buildNumber", String.valueOf(packageInfo.versionCode));
            ret.put("platform", "android");
            
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to get version info", e);
        }
    }

    @PluginMethod
    public void getPackageInfo(PluginCall call) {
        try {
            Context context = getContext();
            PackageManager packageManager = context.getPackageManager();
            String packageName = context.getPackageName();
            PackageInfo packageInfo = packageManager.getPackageInfo(packageName, 0);
            
            JSObject ret = new JSObject();
            ret.put("name", packageName);
            ret.put("version", packageInfo.versionName);
            ret.put("buildNumber", String.valueOf(packageInfo.versionCode));
            ret.put("platform", "android");
            ret.put("lastUpdated", String.valueOf(packageInfo.lastUpdateTime));
            
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to get package info", e);
        }
    }

    @PluginMethod
    public void getLastUpdate(PluginCall call) {
        try {
            Context context = getContext();
            PackageManager packageManager = context.getPackageManager();
            String packageName = context.getPackageName();
            PackageInfo packageInfo = packageManager.getPackageInfo(packageName, 0);
            
            JSObject ret = new JSObject();
            ret.put("lastUpdated", String.valueOf(packageInfo.lastUpdateTime));
            ret.put("updateMethod", "android");
            
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to get last update info", e);
        }
    }

    @PluginMethod
    public void updateVersion(PluginCall call) {
        // Version updates are handled at build time via Trapeze
        // This method provides feedback that the operation should be done via CLI
        JSObject ret = new JSObject();
        ret.put("success", false);
        ret.put("message", "Version updates must be performed using the CLI tool: cap-version update <version>");
        ret.put("updatedFiles", new String[]{});
        ret.put("newVersion", call.getString("version", ""));
        ret.put("newBuildNumber", call.getInt("buildNumber", 1));
        ret.put("platform", "android");
        
        call.resolve(ret);
    }

    @PluginMethod
    public void applyTrapezeConfig(PluginCall call) {
        // Trapeze operations are handled at build time
        // This method provides feedback that the operation should be done via CLI
        JSObject ret = new JSObject();
        ret.put("success", false);
        ret.put("message", "Trapeze configuration must be applied using the CLI tool: cap-version trapeze <config>");
        ret.put("appliedPlatforms", new String[]{"android"});
        ret.put("modifiedFiles", new String[]{});
        
        call.resolve(ret);
    }

    @PluginMethod
    public void checkVersionStatus(PluginCall call) {
        try {
            Context context = getContext();
            PackageManager packageManager = context.getPackageManager();
            String packageName = context.getPackageName();
            PackageInfo packageInfo = packageManager.getPackageInfo(packageName, 0);
            
            JSObject ret = new JSObject();
            ret.put("isUpToDate", true);
            ret.put("currentVersion", packageInfo.versionName);
            ret.put("currentBuildNumber", packageInfo.versionCode);
            ret.put("suggestions", new String[]{});
            ret.put("lastCheck", String.valueOf(System.currentTimeMillis()));
            
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to check version status", e);
        }
    }
}
