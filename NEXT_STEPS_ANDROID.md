# ✅ Android Setup - Next Steps

## 🎉 What's Been Done

### ✅ Completed Tasks:
1. **Firebase Web Credentials** - Added to `.env.local`
2. **Capacitor Plugins Installed** - All 6 Android plugins ready:
   - Camera (QR code scanning)
   - Geolocation (delivery tracking)
   - Push Notifications
   - Haptics (vibration feedback)
   - Share (social sharing)
   - Splash Screen
3. **Web App Built** - Production build in `dist/` folder
4. **Android Platform Synced** - All plugins configured in Android project
5. **Capacitor Config Updated** - App ID: `com.shinecycle.laundry`, App Name: `ShineCycle`

### 📁 Project Structure:
```
your-project/
├── android/                    # Android native project
│   ├── app/
│   │   ├── src/main/
│   │   │   ├── assets/public/  # Your web app (synced)
│   │   │   ├── AndroidManifest.xml
│   │   │   └── res/            # Icons & resources
│   │   └── build.gradle        # Build configuration
│   └── build.gradle           # Project-level config
├── dist/                      # Built web app
├── src/                       # React source code
└── .env.local                 # Firebase credentials
```

## 🔥 Critical Next Step: Add Android App to Firebase

You **MUST** add an Android app to your Firebase project before the app will work.

### Step-by-Step Instructions:

#### 1. Go to Firebase Console
- Open: https://console.firebase.google.com/
- Select project: **istri-82971**

#### 2. Add Android App
- Click **Project Settings** (⚙️ gear icon)
- Scroll to **Your apps** section
- Click **Add app** → Select **Android** icon
- Fill in details:
  - **Package name**: `com.shinecycle.laundry` (must match exactly!)
  - **App nickname**: ShineCycle Android
  - **Debug signing certificate SHA-1**: (skip for now, add later)

#### 3. Download google-services.json
- After registering, click **Download google-services.json**
- This file contains your Android-specific Firebase configuration

#### 4. Add to Your Project
- Copy the downloaded `google-services.json` file
- Place it in: `android/app/google-services.json`

**IMPORTANT**: This file is required for Firebase to work on Android!

#### 5. Get SHA-1 Fingerprint (for Authentication)
For Phone OTP authentication to work on Android:

**For Debug Builds:**
```bash
cd android
./gradlew signingReport
```
Copy the **SHA-1** from the output (under `Task :app:signingReport` → `Variant: debug`)

**Add to Firebase:**
- Go to Firebase Console → Project Settings → Your Android app
- Click **Add fingerprint**
- Paste the SHA-1 fingerprint
- Click **Save**

## 📱 Testing on Android

### Option 1: Using Android Studio (Recommended)
```bash
# Open Android project in Android Studio
npx cap open android
```

In Android Studio:
1. Wait for Gradle sync to complete
2. Connect Android device or start emulator
3. Click **Run** (green play button)

### Option 2: Using Command Line
```bash
# Run on connected device
npx cap run android
```

## 🔨 Building Release APK

### Step 1: Generate Signing Key
```bash
keytool -genkey -v -keystore android/shinecycle-release-key.keystore \
  -alias shinecycle -keyalg RSA -keysize 2048 -validity 10000
```

**Save the passwords securely!**

### Step 2: Configure Signing
Create `android/key.properties`:
```properties
storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=shinecycle
storeFile=../shinecycle-release-key.keystore
```

### Step 3: Update build.gradle
Edit `android/app/build.gradle` to add:

```gradle
// At the top, after plugins
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    // ... existing config ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

### Step 4: Build Release APK
```bash
cd android
./gradlew assembleRelease
```

**Output**: `android/app/build/outputs/apk/release/app-release.apk`

### Step 5: Build AAB for Play Store
```bash
cd android
./gradlew bundleRelease
```

**Output**: `android/app/build/outputs/bundle/release/app-release.aab`

## 🧪 Testing Checklist

Before Play Store submission, test:

- [ ] App launches without crashes
- [ ] Phone OTP authentication works
- [ ] Users can create accounts (Customer & Launderer)
- [ ] Order creation and tracking works
- [ ] QR code scanning works (camera permission)
- [ ] Image uploads work (storage)
- [ ] Real-time order updates appear
- [ ] Push notifications arrive
- [ ] Location permission for delivery tracking
- [ ] App works offline (cached data)
- [ ] All user roles work (Customer, Launderer, Admin)

## 📝 Play Store Preparation

### Required Assets:

#### 1. App Screenshots (2-8 required)
- **Phone**: 1080x1920 or 1080x2400 pixels
- **7-inch Tablet**: 1200x1920 (optional)
- **10-inch Tablet**: 1600x2560 (optional)

#### 2. Feature Graphic
- **Size**: 1024x500 pixels
- **Format**: PNG or JPG
- Showcases your app's main value

#### 3. High-res Icon
- **Size**: 512x512 pixels
- **Format**: 32-bit PNG
- No transparency

#### 4. Privacy Policy
Required URL with:
- Data collection practices
- How user data is used
- Third-party services (Firebase)
- User rights
- Contact information

### Store Listing Content:

**App Title** (50 chars max):
```
ShineCycle - Laundry Delivery
```

**Short Description** (80 chars):
```
On-demand laundry service with doorstep pickup & delivery. Quick & convenient!
```

**Full Description** (4000 chars):
See `ANDROID_DEPLOYMENT_GUIDE.md` for complete description template

**Category**: Lifestyle

**Content Rating**: Everyone

## 🚀 Play Store Submission

1. **Create Google Play Console Account**
   - Go to: https://play.google.com/console
   - Pay $25 one-time registration fee

2. **Create New App**
   - Click "Create app"
   - App name: ShineCycle
   - Default language: English
   - App type: Application
   - Free or Paid: Free

3. **Complete All Required Sections**
   - App access
   - Ads declaration
   - Content rating
   - Target audience
   - Privacy policy
   - Data safety
   - Store listing

4. **Upload App Bundle**
   - Upload `app-release.aab`
   - Add release notes

5. **Submit for Review**
   - Review takes 1-7 days
   - Check regularly for any issues

## ⚠️ Common Issues

### Issue: Firebase not initialized
**Solution**: Make sure `google-services.json` is in `android/app/`

### Issue: Phone auth not working
**Solution**: Add SHA-1 fingerprint to Firebase Console

### Issue: Build fails
**Solution**: 
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

### Issue: Permissions denied
**Solution**: Check `AndroidManifest.xml` has required permissions

## 📚 Additional Resources

- **Full Deployment Guide**: See `ANDROID_DEPLOYMENT_GUIDE.md`
- **Firebase Setup**: See `FIREBASE_SETUP.md`
- **Capacitor Docs**: https://capacitorjs.com/docs/android
- **Firebase Android**: https://firebase.google.com/docs/android/setup
- **Play Console**: https://play.google.com/console

## 🎯 Current Status Summary

| Task | Status |
|------|--------|
| Firebase Web Credentials | ✅ Done |
| Capacitor Plugins | ✅ Installed |
| Web App Build | ✅ Built |
| Android Platform | ✅ Synced |
| Firebase Android App | ⏳ **Next: Add in Firebase Console** |
| google-services.json | ⏳ **Next: Download & Add** |
| SHA-1 Fingerprint | ⏳ **Next: Generate & Add** |
| Test on Device | ⏳ Pending |
| Release Build | ⏳ Pending |
| Play Store Listing | ⏳ Pending |
| Submit to Play Store | ⏳ Pending |

---

## 🚦 What to Do Right Now:

1. **Add Android app to Firebase** (see instructions above)
2. **Download google-services.json**
3. **Place it in `android/app/google-services.json`**
4. **Generate SHA-1 and add to Firebase**
5. **Test the app**: `npx cap open android`

Once these steps are done, your app will be ready for testing and Play Store submission! 🎉
