# 🚀 Android Quick Start Guide

Get your ShineCycle app running on Android in minutes!

## Prerequisites

✅ **Already Configured** (You have these):
- Capacitor installed and configured
- Android platform added
- Build scripts ready in package.json

🔧 **You Need to Install**:
- [Android Studio](https://developer.android.com/studio) - Download and install
- Java JDK 11+ (comes with Android Studio)

---

## Step 1: Setup Android Studio

### Install Android Studio

1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Run installer (Windows/Mac/Linux)
3. Follow setup wizard:
   - Install Standard Setup
   - Accept Android SDK licenses
   - Wait for SDK download

### Configure SDK

1. Open Android Studio
2. Go to: **Settings/Preferences** → **Appearance & Behavior** → **System Settings** → **Android SDK**
3. Install these SDK versions:
   - ✅ Android 14.0 (API 34) - Target SDK
   - ✅ Android 5.1 (API 22) - Minimum SDK
4. Click "SDK Tools" tab
5. Install:
   - ✅ Android SDK Build-Tools
   - ✅ Android SDK Command-line Tools
   - ✅ Android Emulator
6. Click "Apply" to download

---

## Step 2: Firebase Setup for Android

### Get google-services.json

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **istri-82971**
3. Click ⚙️ Settings → Project settings
4. Scroll down to "Your apps"
5. Click "Add app" → Select Android icon
6. Fill in:
   - **Package name**: `com.shinecycle.laundry`
   - **App nickname**: ShineCycle Android
7. Click "Register app"
8. **Download** `google-services.json`
9. Save to: `android/app/google-services.json`

**Important**: Don't commit this file! It's already in `.gitignore`

---

## Step 3: Build & Run

### Option A: Quick Run (Development)

```bash
# Build web app, sync to Android, and open in Android Studio
npm run android:run
```

Then in Android Studio:
1. Wait for Gradle sync to complete
2. Click green ▶️ play button
3. Select device/emulator
4. App will launch!

### Option B: Step by Step

```bash
# 1. Build the web app
npm run build

# 2. Sync to Android platform
npm run android:sync

# 3. Open in Android Studio
npm run android:open
```

---

## Step 4: Create Virtual Device (Emulator)

### Setup Android Emulator

1. In Android Studio: **Tools** → **Device Manager**
2. Click "+" Create Virtual Device
3. Select hardware:
   - **Phone**: Pixel 5 (recommended)
   - Click "Next"
4. Select system image:
   - **Release Name**: UpsideDownCake (API 34)
   - Click "Download" if not installed
   - Click "Next"
5. Name: "Pixel 5 API 34"
6. Click "Finish"

### Run on Emulator

1. Click ▶️ play button in Android Studio
2. Select "Pixel 5 API 34" emulator
3. Wait for emulator to boot (1-2 mins first time)
4. App will install and launch automatically!

---

## Step 5: Test on Real Device

### Enable Developer Mode

**On Your Android Phone**:
1. Go to **Settings** → **About phone**
2. Tap **Build number** 7 times
3. Enter PIN/password if prompted
4. You'll see "You are now a developer!"

### Enable USB Debugging

1. Go to **Settings** → **System** → **Developer options**
2. Enable **USB debugging**
3. Connect phone to computer via USB
4. Allow USB debugging prompt on phone

### Run on Device

```bash
npm run android:run
```

Select your phone when Android Studio asks for device.

---

## Available Commands

### Development Commands

| Command | What it does |
|---------|--------------|
| `npm run dev` | Run web app locally (browser) |
| `npm run build` | Build production web app |
| `npm run android:sync` | Build & sync to Android |
| `npm run android:open` | Open in Android Studio |
| `npm run android:run` | Build, sync, and open (all-in-one) |

### Production Commands

| Command | What it does |
|---------|--------------|
| `npm run android:build` | Build release APK |
| `npm run android:bundle` | Build release AAB (for Play Store) |

### Utility Commands

| Command | What it does |
|---------|--------------|
| `npm run mobile:sync` | Sync to all platforms (iOS + Android) |
| `npm run mobile:update` | Update Capacitor to latest version |

---

## Common Issues & Fixes

### Issue: Gradle Build Failed

**Solution 1**: Clean and rebuild
```bash
cd android
./gradlew clean
cd ..
npm run android:sync
```

**Solution 2**: Check Java version
```bash
java -version
# Should be 11 or higher
```

### Issue: App Shows White Screen

**Solution**: Check build output
```bash
# Ensure dist folder has files
ls -la dist/

# If empty, rebuild:
npm run build
npm run android:sync
```

### Issue: Firebase Not Working

**Checklist**:
- ✅ `google-services.json` exists in `android/app/`
- ✅ Package name is `com.shinecycle.laundry`
- ✅ Firebase services enabled in console
- ✅ Rebuilt after adding google-services.json

**Fix**:
```bash
npm run android:sync
```

### Issue: Cannot Find Android SDK

**Fix in Android Studio**:
1. File → Settings → Appearance & Behavior → System Settings → Android SDK
2. Note SDK location (e.g., `/Users/you/Library/Android/sdk`)
3. Set environment variable:

**macOS/Linux**:
```bash
export ANDROID_HOME=/Users/you/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**Windows**:
```
setx ANDROID_HOME "C:\Users\You\AppData\Local\Android\Sdk"
```

### Issue: Device Not Detected

**Fix**:
1. Check USB cable (use data cable, not charge-only)
2. Enable USB debugging on phone
3. Allow USB debugging prompt
4. Run: `adb devices` (should list your device)

---

## Next Steps

### 1. Configure App Icons

Follow: [ANDROID_APP_ICONS.md](./ANDROID_APP_ICONS.md)
- Generate app icons (all sizes)
- Set up splash screen
- Create Play Store assets

### 2. Prepare for Play Store

Follow: [ANDROID_DEPLOYMENT.md](./ANDROID_DEPLOYMENT.md)
- Generate signing key
- Build release AAB
- Create Play Store listing
- Submit for review

### 3. Monitor & Update

- Set up Firebase Analytics
- Enable Crashlytics for error tracking
- Plan regular updates
- Monitor Play Store reviews

---

## Development Workflow

### Daily Development

```bash
# 1. Make changes to web app (src/)
# Edit components, pages, styles, etc.

# 2. Test in browser first
npm run dev

# 3. When ready, test on Android
npm run android:run

# 4. Make changes, sync updates
npm run android:sync
# Then reload app in Android Studio
```

### Hot Reload Setup

For faster development:

1. In Capacitor config, use local dev server:
```typescript
// capacitor.config.ts (development only)
server: {
  url: 'http://YOUR_LOCAL_IP:5000',
  cleartext: true
}
```

2. Run dev server: `npm run dev`
3. Sync to Android: `npm run android:sync`
4. App will load from dev server with hot reload!

**Remember**: Remove `server.url` for production builds!

---

## Production Checklist

Before releasing to Play Store:

- [ ] Remove debug configurations
- [ ] Test on multiple devices/Android versions
- [ ] Update version code in `build.gradle`
- [ ] Generate release AAB: `npm run android:bundle`
- [ ] Create signing key (see deployment guide)
- [ ] Test release build on real device
- [ ] Prepare store listing (icons, screenshots)
- [ ] Write app description & release notes
- [ ] Submit to Play Console

---

## Support Resources

### Official Docs
- [Capacitor Android Guide](https://capacitorjs.com/docs/android)
- [Android Developer Docs](https://developer.android.com/)
- [Firebase Android Setup](https://firebase.google.com/docs/android/setup)

### Community
- [Capacitor Discord](https://discord.gg/UPYYRhtyzp)
- [Stack Overflow - Capacitor](https://stackoverflow.com/questions/tagged/capacitor)
- [Ionic Forum](https://forum.ionicframework.com/)

### Video Tutorials
- [Capacitor Android Setup](https://www.youtube.com/results?search_query=capacitor+android+setup)
- [Android Studio Basics](https://developer.android.com/courses)

---

## Tips & Best Practices

### Performance

- ✅ Enable minification in production builds
- ✅ Optimize images before adding to app
- ✅ Use code splitting for large apps
- ✅ Test on low-end devices

### Security

- 🔒 Never commit `google-services.json` to public repos
- 🔒 Use environment variables for API keys
- 🔒 Enable ProGuard for release builds
- 🔒 Backup signing key securely

### Testing

- 📱 Test on real devices, not just emulator
- 📱 Test different Android versions (API 22-34)
- 📱 Test different screen sizes
- 📱 Test offline functionality

### Updates

- 🔄 Plan regular feature updates
- 🔄 Monitor crash reports
- 🔄 Fix bugs quickly
- 🔄 Respond to user reviews

---

## Success! 🎉

You're all set! Your ShineCycle app is now running on Android.

**What's Next?**:
1. ✅ Configure app icons → [ANDROID_APP_ICONS.md](./ANDROID_APP_ICONS.md)
2. ✅ Deploy to Play Store → [ANDROID_DEPLOYMENT.md](./ANDROID_DEPLOYMENT.md)
3. ✅ Monitor & improve based on user feedback

**Questions?** Check the comprehensive guides or reach out to Capacitor community!
