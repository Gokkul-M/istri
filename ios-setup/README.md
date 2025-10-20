# iOS Build Configuration

This directory contains configuration files for building the ShineCycle iOS app.

## Files

### **exportOptions.plist**
Configuration for exporting IPA files from Xcode archives.

**Before building, you MUST update:**
1. `YOUR_TEAM_ID_HERE` → Your Apple Developer Team ID
2. `YOUR_PROVISIONING_PROFILE_NAME` → Your provisioning profile name

### **exportOptions.plist.example**
Template file showing the structure of exportOptions.plist.

### **Info.plist.template**
Template for iOS app permissions and configuration.
Copy this to `ios/App/App/Info.plist` after initializing the iOS platform.

### **build-ios.sh**
Automated build script for creating iOS IPA files.

## Quick Setup

### 1. Find Your Apple Team ID

```bash
# Method 1: In Xcode
# Open Xcode → Preferences → Accounts → Select your Apple ID → View team details

# Method 2: In App Store Connect
# Visit: https://developer.apple.com/account
# Look for "Team ID" in Membership section
```

### 2. Update exportOptions.plist

```bash
# Edit the file
nano ios-setup/exportOptions.plist

# Replace:
<string>YOUR_TEAM_ID_HERE</string>
# With your actual Team ID:
<string>ABCD123456</string>

# Replace:
<string>YOUR_PROVISIONING_PROFILE_NAME</string>
# With your profile name:
<string>ShineCycle Production</string>
```

### 3. Configure Signing in Xcode

```bash
# Open project
npm run ios:open

# In Xcode:
# 1. Select project in navigator
# 2. Select "App" target
# 3. Go to "Signing & Capabilities"
# 4. Check "Automatically manage signing"
# 5. Select your Team
# 6. Xcode will generate provisioning profiles
```

## Distribution Methods

Update the `method` key in exportOptions.plist:

### App Store (Production)
```xml
<key>method</key>
<string>app-store</string>
```

### Ad Hoc (Testing - up to 100 devices)
```xml
<key>method</key>
<string>ad-hoc</string>
```

### Development (Testing)
```xml
<key>method</key>
<string>development</string>
```

### Enterprise (Internal)
```xml
<key>method</key>
<string>enterprise</string>
```

## Building the IPA

### Option 1: Automated Script
```bash
./ios-setup/build-ios.sh
```

### Option 2: npm commands
```bash
npm run ios:build    # Archive
npm run ios:export   # Export IPA
```

### Option 3: Xcode GUI (Recommended for first time)
```bash
npm run ios:open
# Then: Product → Archive → Distribute App
```

## Troubleshooting

### "No signing certificate found"
1. Open Xcode Preferences → Accounts
2. Add your Apple ID
3. Download certificates
4. Try building again

### "Provisioning profile doesn't match"
1. Delete old profiles: Xcode → Preferences → Accounts → View Details → Delete all
2. Enable "Automatically manage signing"
3. Clean build folder: ⌘⇧K
4. Build again

### "Team ID not found"
Make sure you've updated exportOptions.plist with your actual Team ID.

## Additional Resources

- [Apple Developer Portal](https://developer.apple.com/account)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Xcode Documentation](https://developer.apple.com/xcode/)
