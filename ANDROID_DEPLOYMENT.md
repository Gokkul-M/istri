# 📱 ShineCycle Android Deployment Guide

Complete guide to build and deploy ShineCycle app to Google Play Store.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Firebase Setup for Android](#firebase-setup-for-android)
4. [App Icons & Splash Screen](#app-icons--splash-screen)
5. [Build Release APK/AAB](#build-release-apkaab)
6. [Google Play Store Deployment](#google-play-store-deployment)
7. [Testing](#testing)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software
- ✅ **Node.js** (v16 or higher) - Already installed in Replit
- ✅ **Android Studio** - Download from [developer.android.com](https://developer.android.com/studio)
- ✅ **Java JDK 11+** - Bundled with Android Studio
- ✅ **Google Play Developer Account** - $25 one-time fee at [play.google.com/console](https://play.google.com/console)

### App Details
- **App ID**: `com.shinecycle.laundry`
- **App Name**: ShineCycle
- **Bundle Format**: AAB (Android App Bundle) - Required for Play Store
- **Min SDK**: 22 (Android 5.1+)
- **Target SDK**: 34 (Android 14)

---

## Quick Start

### Step 1: Build the Web App
```bash
npm run build
```

### Step 2: Sync to Android
```bash
npm run android:sync
```

### Step 3: Open in Android Studio
```bash
npm run android:open
```

### Available NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run android:sync` | Build web app and sync to Android |
| `npm run android:open` | Open project in Android Studio |
| `npm run android:run` | Build, sync, and open in one command |
| `npm run android:build` | Build release APK |
| `npm run android:bundle` | Build release AAB for Play Store |
| `npm run mobile:sync` | Sync to all platforms |
| `npm run mobile:update` | Update Capacitor to latest version |

---

## Firebase Setup for Android

### 1. Add Android App in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `istri-82971`
3. Click "Add app" → Select Android (robot icon)
4. Enter package name: `com.shinecycle.laundry`
5. App nickname: `ShineCycle Android`
6. Download `google-services.json`

### 2. Add google-services.json to Project

```bash
# Copy downloaded file to:
android/app/google-services.json
```

**Important**: Don't commit this file to Git! It's already in `.gitignore`

### 3. Enable Firebase Services

In Firebase Console, enable:
- ✅ **Authentication** (Email/Password already enabled)
- ✅ **Firestore Database** (Already configured)
- ✅ **Cloud Storage** (Already configured)
- ✅ **Cloud Messaging** (For push notifications)

---

## App Icons & Splash Screen

### Icon Requirements

Android requires icons in multiple sizes:

| Density | Size | Folder |
|---------|------|--------|
| mdpi | 48x48 | `mipmap-mdpi` |
| hdpi | 72x72 | `mipmap-hdpi` |
| xhdpi | 96x96 | `mipmap-xhdpi` |
| xxhdpi | 144x144 | `mipmap-xxhdpi` |
| xxxhdpi | 192x192 | `mipmap-xxxhdpi` |

### Generate Icons

**Option 1: Use Android Studio**
1. Right-click `res` folder → New → Image Asset
2. Select "Launcher Icons (Adaptive and Legacy)"
3. Upload your 512x512 icon (PNG with transparency)
4. Configure foreground/background layers
5. Click "Next" → "Finish"

**Option 2: Use Online Tool**
1. Visit [appicon.co](https://www.appicon.co/)
2. Upload 1024x1024 PNG icon
3. Download Android icon set
4. Extract to `android/app/src/main/res/`

### Splash Screen Configuration

Current splash screen settings (in `capacitor.config.ts`):
```typescript
SplashScreen: {
  launchShowDuration: 2000,
  backgroundColor: "#1E293B",  // Dark navy gradient
  showSpinner: false,
  splashFullScreen: true,
  splashImmersive: true
}
```

**Custom Splash Images** (Optional):
- Place splash images in: `android/app/src/main/res/drawable-{density}/`
- Supported densities: mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi

---

## Build Release APK/AAB

### Step 1: Generate Signing Key

**Important**: Keep this key safe! You need it for all future updates.

```bash
# In your local machine (not Replit):
keytool -genkey -v -keystore shinecycle-release.jks \
  -alias shinecycle -keyalg RSA -keysize 2048 -validity 10000

# You'll be asked for:
# - Keystore password (remember this!)
# - Key password (can be same as keystore)
# - Your name/organization details
```

**Save these credentials securely:**
- Keystore file: `shinecycle-release.jks`
- Keystore password
- Key alias: `shinecycle`
- Key password

### Step 2: Configure Signing in Gradle

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('../../shinecycle-release.jks')
            storePassword 'YOUR_STORE_PASSWORD'
            keyAlias 'shinecycle'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

**Security Best Practice**: Use environment variables or gradle.properties instead of hardcoding passwords.

### Step 3: Build Release AAB

```bash
# Build Android App Bundle (required for Play Store)
npm run android:bundle

# Output file will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

### Step 4: Build Release APK (Optional)

```bash
# Build APK for direct distribution/testing
npm run android:build

# Output file will be at:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## Google Play Store Deployment

### Step 1: Create App in Play Console

1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in app details:
   - **App name**: ShineCycle - Laundry Service
   - **Default language**: English (India) or your region
   - **App or game**: App
   - **Free or paid**: Free (or Paid if applicable)
   - **Privacy Policy URL**: Required!

### Step 2: Complete App Content

**Store Listing**:
- **Short description** (80 chars): "Doorstep laundry pickup & delivery service"
- **Full description** (4000 chars): Detailed app features
- **App icon**: 512x512 PNG
- **Feature graphic**: 1024x500 PNG
- **Screenshots**: 
  - Phone: At least 2 (1080x1920 recommended)
  - Tablet: Optional but recommended
- **App category**: Lifestyle or Shopping
- **Contact details**: Developer email

**Content Rating**:
- Complete questionnaire
- ShineCycle should get "Everyone" or "Teen" rating

**Target Audience**:
- Select age groups (likely 18+)
- No ads/in-app purchases (unless you added them)

**Privacy & Data Safety**:
- Data collection disclosure
- Privacy policy URL (required)
- Data security practices

### Step 3: Upload AAB

1. Go to "Production" → "Create new release"
2. Upload `app-release.aab`
3. Fill in release notes:
   ```
   Initial release of ShineCycle - your doorstep laundry service app!
   
   Features:
   - Order laundry services with pickup & delivery
   - Real-time order tracking
   - QR code verification
   - Multiple payment options
   - Customer & launderer portals
   ```

### Step 4: Set Pricing & Distribution

- **Countries**: Select target countries (India, etc.)
- **Pricing**: Free (with optional in-app purchases)
- **Content rating**: Based on questionnaire results
- **Age restrictions**: As per your app content

### Step 5: Submit for Review

1. Review all sections (Play Console will show status)
2. Click "Send for review"
3. Review usually takes 1-3 days
4. You'll receive email when approved/rejected

---

## Testing

### Test on Android Emulator

1. Open Android Studio
2. Tools → Device Manager
3. Create Virtual Device (Pixel 5, API 33 recommended)
4. Run app: Click green play button

### Test on Real Device

1. Enable Developer Options on your Android phone:
   - Settings → About phone → Tap "Build number" 7 times
2. Enable USB Debugging:
   - Settings → Developer options → USB debugging
3. Connect phone via USB
4. Run: `npm run android:run`
5. Select your device when prompted

### Internal Testing Track

Before production release, use Play Console's Internal Testing:
1. Create internal testing release
2. Add test users (up to 100 emails)
3. Share testing link with testers
4. Collect feedback and fix issues
5. Promote to production when ready

---

## Troubleshooting

### Issue: Build Fails

**Check Gradle Version**:
```bash
cd android
./gradlew --version
```

**Clean Build**:
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### Issue: App Crashes on Launch

**Check Logs**:
```bash
# Connect device/emulator
adb logcat | grep "ShineCycle"
```

**Common Fixes**:
- Ensure `google-services.json` is present
- Check Firebase config matches package name
- Verify all Capacitor plugins are synced

### Issue: White Screen on Launch

**Fix**: Check webDir in `capacitor.config.ts`:
```typescript
webDir: 'dist'  // Must match Vite build output
```

**Rebuild**:
```bash
npm run build
npx cap sync android
```

### Issue: Permissions Not Working

**Fix**: Check `AndroidManifest.xml` has required permissions:
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
```

### Issue: Firebase Not Working

**Checklist**:
- ✅ `google-services.json` in `android/app/`
- ✅ Package name matches: `com.shinecycle.laundry`
- ✅ Firebase services enabled in console
- ✅ SHA-1 fingerprint added (for Auth)

**Get SHA-1**:
```bash
cd android
./gradlew signingReport
```

---

## Version Updates

### Increment Version for New Release

Edit `android/app/build.gradle`:
```gradle
defaultConfig {
    versionCode 2        // Increment by 1
    versionName "1.1.0"  // Semantic versioning
}
```

### Submit Update

1. Build new AAB: `npm run android:bundle`
2. Play Console → Production → Create new release
3. Upload new AAB
4. Add release notes
5. Submit for review

---

## Support & Resources

### Official Documentation
- [Capacitor Android Docs](https://capacitorjs.com/docs/android)
- [Android Developer Guide](https://developer.android.com/studio)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)

### Community
- [Capacitor Discord](https://discord.gg/UPYYRhtyzp)
- [Ionic Forum](https://forum.ionicframework.com/)

### App Store Assets Checklist

Before submitting:
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] 2-8 screenshots (phone + tablet)
- [ ] Short description (80 chars)
- [ ] Full description (4000 chars)
- [ ] Privacy policy URL
- [ ] Content rating completed
- [ ] Release APK/AAB signed
- [ ] Testing completed
- [ ] Version code incremented

---

## Security Best Practices

1. **Never commit**:
   - `google-services.json`
   - `.jks` keystore files
   - Passwords in gradle files

2. **Use environment variables**:
   ```gradle
   // In gradle.properties (not committed)
   RELEASE_STORE_PASSWORD=your_password
   
   // In build.gradle
   storePassword System.getenv("RELEASE_STORE_PASSWORD")
   ```

3. **Backup keystore**:
   - Store `.jks` file in secure location
   - Keep passwords in password manager
   - Share with team via secure channel

---

## Next Steps

After successful Play Store deployment:

1. **Monitor Analytics**: Set up Firebase Analytics
2. **Crash Reporting**: Enable Firebase Crashlytics
3. **User Feedback**: Monitor Play Store reviews
4. **Update Strategy**: Plan regular feature updates
5. **Marketing**: Promote your app!

**Congratulations!** 🎉 Your ShineCycle app is now live on Google Play Store!
