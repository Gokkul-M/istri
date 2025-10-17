# Quick Start: Android App Setup

## 🎯 Current Status
- ✅ Web app is working
- ✅ Firebase backend fully configured
- ✅ Capacitor installed and configured
- ⏳ **Waiting for Firebase web credentials**

## 🔑 Step 1: Add Firebase Web Credentials (REQUIRED)

You provided Firebase **service account** credentials, but we need **web app** credentials.

### Get Your Web Credentials:
1. Go to https://console.firebase.google.com/
2. Select project: **istri-82971**
3. Click ⚙️ Settings → Project Settings
4. Under "Your apps", find or add a **Web app**
5. Copy the `firebaseConfig` values

### Add to Replit:
Click the 🔒 Secrets icon and add:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=istri-82971.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=istri-82971
VITE_FIREBASE_STORAGE_BUCKET=istri-82971.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📱 Step 2: Install Android Plugins

Once Firebase credentials are added, run:
```bash
npm install @capacitor/push-notifications @capacitor/camera @capacitor/geolocation @capacitor/share @capacitor/haptics
```

## 🏗️ Step 3: Build & Add Android Platform

```bash
# Build the web app
npm run build

# Add Android platform
npx cap add android

# Sync changes
npx cap sync android
```

## 🔐 Step 4: Add Android App to Firebase

1. In Firebase Console → Project Settings
2. Click "Add app" → Android
3. Package name: `com.shinecycle.laundry`
4. Download `google-services.json`
5. Place in: `android/app/google-services.json`

## 🛠️ Step 5: Open in Android Studio

```bash
npx cap open android
```

Then in Android Studio:
1. Let Gradle sync complete
2. Click "Run" to test on emulator/device

## 📦 Step 6: Build Release APK

```bash
cd android
./gradlew assembleRelease
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

## 🚀 What's Ready for Android

Your app has these features ready:
- ✅ Phone OTP authentication
- ✅ Real-time order tracking
- ✅ QR code generation (scanning needs camera plugin)
- ✅ User profiles with image uploads
- ✅ Firebase data sync
- ✅ Push notifications setup
- ✅ Responsive mobile UI

## 📚 Full Documentation

See `ANDROID_DEPLOYMENT_GUIDE.md` for complete Play Store deployment instructions including:
- App signing
- Play Store listing
- Screenshots requirements
- Privacy policy
- Release management

## ⚡ Next Actions

1. **Get Firebase web credentials** (see Step 1 above)
2. Share them so I can configure the app
3. Then we'll test and build for Android!
