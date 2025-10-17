# ✅ Android Setup Checklist - ShineCycle

## Current Status: 80% Complete ✨

### ✅ Completed Tasks

- [x] **Firebase Web Credentials** - Added to `.env.local`
- [x] **Capacitor Configuration** - Updated with app ID and name
- [x] **Android Plugins Installed** - All 6 plugins ready
  - Camera (QR code scanning)
  - Geolocation (delivery tracking)
  - Push Notifications
  - Haptics (vibration)
  - Share (social sharing)
  - Splash Screen
- [x] **Web App Built** - Production build in `dist/`
- [x] **Android Platform Created** - Native project in `android/`
- [x] **Android Permissions** - All required permissions added to AndroidManifest.xml
- [x] **Build Configuration** - build.gradle ready for google-services.json

### ⏳ Remaining Tasks (Critical)

#### 1. Add Android App to Firebase (REQUIRED)
**Status**: ⏳ Pending User Action

**Steps**:
1. Go to https://console.firebase.google.com/
2. Select project: **istri-82971**
3. Click Settings → Project Settings
4. Under "Your apps", click "Add app" → Select Android
5. Enter:
   - Package name: `com.shinecycle.laundry`
   - App nickname: ShineCycle Android
6. Download `google-services.json`
7. Place in: `android/app/google-services.json`

**Why**: Firebase SDK needs this file to connect the Android app to Firebase services (Auth, Firestore, Storage, FCM).

#### 2. Add SHA-1 Fingerprint (REQUIRED for Phone Auth)
**Status**: ⏳ Pending

**Steps**:
```bash
# Generate SHA-1 for debug build
cd android
./gradlew signingReport
```

Copy the SHA-1 from output, then:
1. Go to Firebase Console → Your Android app
2. Click "Add fingerprint"
3. Paste SHA-1 and save

**Why**: Phone OTP authentication requires SHA-1 fingerprint for security.

### 🚀 Next Steps (After Firebase Setup)

#### 3. Test on Device/Emulator
```bash
npx cap open android
```
Then click "Run" in Android Studio.

#### 4. Generate Release Key
```bash
keytool -genkey -v -keystore android/shinecycle-release-key.keystore \
  -alias shinecycle -keyalg RSA -keysize 2048 -validity 10000
```

#### 5. Configure App Signing
Create `android/key.properties` (see NEXT_STEPS_ANDROID.md)

#### 6. Build Release APK/AAB
```bash
cd android
./gradlew assembleRelease  # APK
./gradlew bundleRelease    # AAB for Play Store
```

### 📋 Pre-Play Store Checklist

- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (2-8, phone: 1080x1920)
- [ ] Privacy policy URL
- [ ] App description
- [ ] Content rating completed
- [ ] Release APK/AAB built and tested

### 📚 Documentation Available

- **NEXT_STEPS_ANDROID.md** - Detailed Android deployment guide
- **ANDROID_DEPLOYMENT_GUIDE.md** - Complete Play Store submission guide
- **FIREBASE_SETUP.md** - Firebase backend configuration
- **QUICK_START_ANDROID.md** - Quick reference guide

### 🎯 What Works Now

✅ All frontend features (Customer, Launderer, Admin portals)
✅ Firebase backend (Auth, Firestore, Storage)
✅ Real-time order tracking
✅ QR code generation
✅ User profiles and image uploads
✅ Responsive mobile design
✅ All Android permissions configured

### 🔐 What Needs Firebase Android App

⏳ Phone OTP authentication on Android
⏳ Push notifications (FCM)
⏳ Proper Firebase initialization on native Android
⏳ Full offline support with Firebase caching

---

## Quick Commands

```bash
# Build web app
npm run build

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on device
npx cap run android

# Build release
cd android && ./gradlew bundleRelease
```

## Need Help?

1. **Firebase Android Setup**: See NEXT_STEPS_ANDROID.md (Step-by-step guide)
2. **Play Store Submission**: See ANDROID_DEPLOYMENT_GUIDE.md
3. **Quick Start**: See QUICK_START_ANDROID.md

---

**Last Updated**: January 16, 2025
**App Status**: Ready for Firebase Android registration → Testing → Play Store
