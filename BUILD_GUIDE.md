# 📱 ShineCycle - Mobile App Build Guide

Complete guide for building Android APK and iOS IPA files for production deployment.

---

## 📋 **Table of Contents**

1. [Quick Start](#quick-start)
2. [Android APK Build](#android-apk-build)
3. [iOS IPA Build](#ios-ipa-build)
4. [Version Management](#version-management)
5. [Signing & Security](#signing--security)
6. [Troubleshooting](#troubleshooting)

---

## 🚀 **Quick Start**

### **Prerequisites**

**For Android:**
- ✅ Node.js 18+ installed
- ✅ Android Studio with SDK
- ✅ JDK 17
- ✅ Gradle (comes with Android Studio)

**For iOS:**
- ✅ macOS (required)
- ✅ Xcode (latest version)
- ✅ CocoaPods (`sudo gem install cocoapods`)
- ✅ Apple Developer Account

---

## 📦 **Android APK Build**

### **Method 1: Automated Build Script (Recommended)**

#### **On Linux/macOS:**
```bash
./build-android.sh
```

#### **On Windows:**
```bash
build-android.bat
```

The script will:
1. Clean previous builds
2. Build optimized web app
3. Sync with Capacitor
4. Check signing configuration
5. Generate APK file

**Output Location:**
```
android/app/build/outputs/apk/release/app-release.apk
```

---

### **Method 2: NPM Scripts**

#### **Build Release APK:**
```bash
# Linux/macOS
npm run android:build

# Windows
npm run android:build:win
```

#### **Build Debug APK (for testing):**
```bash
# Linux/macOS
npm run android:build:debug

# Windows
npm run android:build:debug:win
```

#### **Build AAB (for Google Play Store):**
```bash
# Linux/macOS
npm run android:bundle

# Windows
npm run android:bundle:win
```

**AAB Output Location:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

### **Method 3: Android Studio**

1. **Open in Android Studio:**
   ```bash
   npm run android:open
   ```

2. **In Android Studio:**
   - Click **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Or for AAB: **Build** → **Build Bundle(s) / APK(s)** → **Build Bundle(s)**

3. **Locate Output:**
   - Click **locate** in the notification that appears
   - Or navigate to: `android/app/build/outputs/`

---

### **Android Build Variants**

| Build Type | Command | Use Case | Output |
|------------|---------|----------|--------|
| **Debug APK** | `npm run android:build:debug` | Development testing | Unsigned, debug keys |
| **Release APK** | `npm run android:build` | Distribution, sideloading | Signed (if keystore exists) |
| **Release AAB** | `npm run android:bundle` | Google Play Store | Optimized bundle |

---

## 🍎 **iOS IPA Build**

### **⚠️ Important: macOS Required**
iOS apps can **only** be built on macOS with Xcode installed.

---

### **Method 1: Automated Build Script**

```bash
./ios-setup/build-ios.sh
```

The script will:
1. Initialize iOS platform (if needed)
2. Build optimized web app
3. Sync with Capacitor
4. Install CocoaPods dependencies
5. Archive the app
6. Export IPA file

**Output Location:**
```
ios/App/build/App.ipa
```

---

### **Method 2: NPM Scripts**

#### **Initialize iOS (first time only):**
```bash
npm run ios:init
```

#### **Sync and Build:**
```bash
npm run ios:build
```

#### **Export IPA:**
```bash
npm run ios:export
```

---

### **Method 3: Xcode (Recommended for Production)**

1. **Open in Xcode:**
   ```bash
   npm run ios:open
   ```

2. **Configure Signing:**
   - Select project in navigator
   - Go to **Signing & Capabilities** tab
   - Select your **Team** (Apple Developer account)
   - Xcode will auto-generate provisioning profiles

3. **Archive the App:**
   - Select **Product** → **Archive** (⌘B then ⌘⇧A)
   - Wait for archive to complete
   - Organizer window will open

4. **Distribute:**
   - Click **Distribute App**
   - Choose distribution method:
     - **App Store Connect** - For App Store submission
     - **Ad Hoc** - For testing on specific devices
     - **Enterprise** - For enterprise distribution
     - **Development** - For development testing

5. **Export IPA:**
   - Follow the wizard steps
   - Select signing certificate and provisioning profile
   - Click **Export**
   - Choose save location

**Output:** IPA file ready for distribution

---

## 🔢 **Version Management**

### **Update App Version**

Update version in these files before building:

#### **1. package.json**
```json
{
  "name": "shinecycle",
  "version": "1.0.0"
}
```

#### **2. Android (android/app/build.gradle)**
```gradle
defaultConfig {
    versionCode 1       // Integer - increment for each release
    versionName "1.0.0" // String - visible to users
}
```

#### **3. iOS (Xcode)**
- Open project in Xcode
- Select project → Target → General
- Update **Version** (e.g., 1.0.0)
- Update **Build** (e.g., 1)

### **Version Naming Convention**
```
MAJOR.MINOR.PATCH

1.0.0 - Initial release
1.0.1 - Bug fixes
1.1.0 - New features
2.0.0 - Major changes
```

---

## 🔐 **Signing & Security**

### **Android App Signing**

#### **For Production (Google Play Store):**

1. **Create Keystore:**
   ```bash
   keytool -genkey -v -keystore shinecycle-release.jks \
           -keyalg RSA -keysize 2048 -validity 10000 \
           -alias shinecycle-key
   ```

2. **Create keystore.properties:**
   ```bash
   # Create file: android/app/keystore.properties
   storeFile=/path/to/shinecycle-release.jks
   storePassword=YOUR_STORE_PASSWORD
   keyAlias=shinecycle-key
   keyPassword=YOUR_KEY_PASSWORD
   ```

3. **Secure the Keystore:**
   - ⚠️ **NEVER commit keystore to Git**
   - Store in secure location
   - Back up keystore safely
   - Document passwords securely

4. **Build with Signing:**
   ```bash
   npm run android:bundle
   ```

#### **For Testing (Debug):**
No keystore needed - uses debug keystore automatically.

---

### **iOS App Signing**

#### **Requirements:**
- ✅ Apple Developer Account ($99/year)
- ✅ Signing Certificate
- ✅ Provisioning Profile

#### **Setup:**

1. **Create App ID:**
   - Go to: https://developer.apple.com/account
   - Certificates, IDs & Profiles → Identifiers
   - Click **+** to create new identifier
   - Bundle ID: `com.istri.laundry`
   - Enable capabilities: Push Notifications, Background Modes

2. **Create Certificates:**
   - Xcode can auto-generate certificates
   - Or manually create in Apple Developer Portal
   - Download and install certificate

3. **Create Provisioning Profile:**
   - App Store: For production distribution
   - Ad Hoc: For testing on specific devices
   - Download and install profile

4. **Configure in Xcode:**
   - Open project: `npm run ios:open`
   - Select project → Signing & Capabilities
   - Check **Automatically manage signing**
   - Select your **Team**
   - Xcode handles the rest

5. **Update exportOptions.plist:**
   ```bash
   # Edit: ios-setup/exportOptions.plist
   # Update YOUR_TEAM_ID_HERE with your Apple Team ID
   ```

---

## 🔍 **Build Verification**

### **Before Building, Check:**

- [ ] ✅ All dependencies installed: `npm install`
- [ ] ✅ Web app builds: `npm run build`
- [ ] ✅ No errors in console
- [ ] ✅ Firebase config set (environment variables)
- [ ] ✅ Version numbers updated
- [ ] ✅ App icons created (all sizes)
- [ ] ✅ Splash screens designed

### **After Building:**

#### **Android APK Test:**
```bash
# Install on connected device
adb install android/app/build/outputs/apk/release/app-release.apk

# Check if signed
jarsigner -verify -verbose -certs android/app/build/outputs/apk/release/app-release.apk
```

#### **iOS IPA Test:**
- Install via Xcode on connected device
- Or use TestFlight for beta testing

---

## 📤 **Distribution**

### **Android Distribution Options**

| Method | Command | Use Case |
|--------|---------|----------|
| **Google Play Store** | Upload AAB | Public release |
| **Firebase App Distribution** | Upload APK | Beta testing |
| **Direct APK** | Share file | Limited distribution |
| **Amazon Appstore** | Upload APK | Alternative store |

### **iOS Distribution Options**

| Method | Profile Type | Use Case |
|--------|-------------|----------|
| **App Store** | App Store | Public release |
| **TestFlight** | App Store | Beta testing (10,000 testers) |
| **Ad Hoc** | Ad Hoc | Testing (100 devices max) |
| **Enterprise** | Enterprise | Internal company distribution |

---

## 🐛 **Troubleshooting**

### **Common Android Issues**

#### **Issue: "SDK location not found"**
```bash
# Solution: Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

#### **Issue: "Execution failed for task ':app:processReleaseResources'"**
```bash
# Solution: Clean and rebuild
npm run android:clean
npm run android:build
```

#### **Issue: "google-services.json not found"**
```bash
# Solution: Ensure file exists
ls android/app/google-services.json
```

#### **Issue: Build fails with "Out of memory"**
```bash
# Solution: Increase Gradle memory
# Edit: android/gradle.properties
org.gradle.jvmargs=-Xmx4096m
```

---

### **Common iOS Issues**

#### **Issue: "No such module 'Capacitor'"**
```bash
# Solution: Install CocoaPods dependencies
cd ios/App
pod install
cd ../..
```

#### **Issue: "Signing certificate not found"**
```
Solution: In Xcode
1. Preferences → Accounts
2. Add Apple ID
3. Download certificates
4. Signing & Capabilities → Select team
```

#### **Issue: "Provisioning profile doesn't include signing certificate"**
```bash
# Solution: Delete and regenerate
1. Delete old profiles in Xcode
2. Check "Automatically manage signing"
3. Clean build folder (⌘⇧K)
4. Build again
```

#### **Issue: CocoaPods error**
```bash
# Solution: Update CocoaPods
sudo gem install cocoapods
pod repo update
cd ios/App && pod install
```

---

### **General Build Issues**

#### **Issue: "Command not found: npx"**
```bash
# Solution: Install Node.js
# Download from: https://nodejs.org/
```

#### **Issue: Build takes very long**
```bash
# Solution: Clear cache and optimize
npm run android:clean  # or ios clean
npm run build
```

#### **Issue: "Module not found" errors**
```bash
# Solution: Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📊 **Build Checklist**

### **Pre-Release Checklist**

- [ ] All features tested on web
- [ ] All features tested on Android device
- [ ] All features tested on iOS device (if applicable)
- [ ] Firebase security rules updated
- [ ] API keys secured (not exposed in code)
- [ ] Version numbers incremented
- [ ] App icons finalized (all sizes)
- [ ] Splash screens finalized
- [ ] Privacy policy page created
- [ ] Terms of service created
- [ ] Test accounts created for review
- [ ] Screenshots prepared for store listings
- [ ] App description written
- [ ] Release notes prepared
- [ ] Keystore/certificates backed up securely

---

## 🎯 **Quick Reference Commands**

### **Android**
```bash
# Clean build
npm run android:clean

# Debug APK (testing)
npm run android:build:debug

# Release APK (distribution)
npm run android:build

# AAB (Google Play)
npm run android:bundle

# Open in Android Studio
npm run android:open
```

### **iOS** (macOS only)
```bash
# Initialize iOS
npm run ios:init

# Build and archive
npm run ios:build

# Export IPA
npm run ios:export

# Open in Xcode
npm run ios:open
```

### **Both Platforms**
```bash
# Build web app
npm run build

# Sync both platforms
npm run mobile:sync

# Check setup
npm run mobile:doctor
```

---

## 📚 **Additional Resources**

- **Android Publishing:** https://developer.android.com/studio/publish
- **iOS Publishing:** https://developer.apple.com/app-store/submissions/
- **Capacitor Docs:** https://capacitorjs.com/docs
- **Firebase Setup:** https://firebase.google.com/docs
- **Google Play Console:** https://play.google.com/console
- **App Store Connect:** https://appstoreconnect.apple.com/

---

## 💡 **Tips for Success**

1. **Start with Debug Builds** - Test thoroughly before release builds
2. **Version Control** - Always increment versions for new releases
3. **Backup Keystores** - Losing your keystore = cannot update app
4. **Test on Real Devices** - Emulators don't catch all issues
5. **Beta Test First** - Use Firebase/TestFlight before public release
6. **Monitor Crash Reports** - Set up Firebase Crashlytics
7. **Plan for Updates** - Keep codebase ready for quick bug fixes

---

**Last Updated:** October 20, 2025  
**App Version:** 1.0.0  
**Build Guide Version:** 1.0
