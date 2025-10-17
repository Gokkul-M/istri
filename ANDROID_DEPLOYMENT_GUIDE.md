# Android App Deployment Guide - ShineCycle

## Overview
This guide covers converting your ShineCycle laundry service web app into a native Android application and publishing it to Google Play Store.

## Prerequisites

### Required Accounts
- ✅ Firebase project (istri-82971) - Already set up
- ⬜ Google Play Console Developer Account ($25 one-time fee)
- ⬜ Google Cloud Console access (for Firebase)

### Required Software
- ⬜ Android Studio (latest version)
- ⬜ Java Development Kit (JDK) 11 or higher
- ⬜ Node.js (already installed)

## Step 1: Get Firebase Web Credentials

### Get Web App Config
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **istri-82971**
3. Click Settings ⚙️ → Project Settings
4. Scroll to "Your apps" → Click Web app icon (`</>`)
5. Copy the `firebaseConfig` values

### Add to Replit Secrets
Add these environment variables:
```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=istri-82971.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=istri-82971
VITE_FIREBASE_STORAGE_BUCKET=istri-82971.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 2: Add Android App to Firebase

### Register Android App
1. In Firebase Console → Project Settings
2. Click "Add app" → Select **Android**
3. Enter details:
   - **Package name**: `com.shinecycle.laundry` (must be unique)
   - **App nickname**: ShineCycle
   - **SHA-1 certificate**: (we'll add this later)
4. Click "Register app"
5. **Download** `google-services.json`
6. Save this file - you'll need it later

### Enable Firebase Services for Android
1. **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Phone" authentication
   - Add your Android app's SHA-1 fingerprint
   
2. **Cloud Firestore**: Already enabled

3. **Storage**: Already enabled

4. **Cloud Messaging (FCM)**: 
   - Automatically enabled for push notifications

## Step 3: Configure Capacitor for Android

### Update Capacitor Configuration

Edit `capacitor.config.ts`:
```typescript
import { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.shinecycle.laundry',
  appName: 'ShineCycle',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    allowNavigation: ['*']
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#1E293B",
      showSpinner: false
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
```

### Install Required Capacitor Plugins
```bash
npm install @capacitor/push-notifications
npm install @capacitor/camera
npm install @capacitor/geolocation
npm install @capacitor/share
npm install @capacitor/haptics
```

## Step 4: Build and Add Android Platform

### Build the Web App
```bash
npm run build
```

### Add Android Platform
```bash
npx cap add android
```

### Sync Web App with Android
```bash
npx cap sync android
```

## Step 5: Configure Android Project

### Add google-services.json
1. Copy the `google-services.json` file you downloaded
2. Place it in: `android/app/google-services.json`

### Update AndroidManifest.xml

Add required permissions in `android/app/src/main/AndroidManifest.xml`:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <!-- Internet & Network -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    
    <!-- Camera (for QR code scanning) -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature android:name="android.hardware.camera" android:required="false" />
    
    <!-- Location (for delivery tracking) -->
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
    
    <!-- Notifications -->
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
    <uses-permission android:name="android.permission.VIBRATE" />
    
    <!-- File access (for image uploads) -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" 
                     android:maxSdkVersion="32" />
    
    <application
        android:label="ShineCycle"
        android:icon="@mipmap/ic_launcher"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        <!-- Activities and other components -->
    </application>
</manifest>
```

### Update build.gradle

In `android/app/build.gradle`:

```gradle
android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.shinecycle.laundry"
        minSdkVersion 22
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
        multiDexEnabled true
    }
    
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
            signingConfig signingConfigs.release
        }
    }
}

dependencies {
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
    implementation 'com.google.firebase:firebase-auth'
    implementation 'com.google.firebase:firebase-firestore'
    implementation 'com.google.firebase:firebase-storage'
    implementation 'com.google.firebase:firebase-messaging'
}
```

## Step 6: Create App Icons & Splash Screen

### Icon Requirements
- **1024x1024 PNG** - Play Store listing
- **512x512 PNG** - Adaptive icon
- **192x192 PNG** - Legacy icon

### Generate Icons
1. Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
2. Upload your logo (1024x1024)
3. Download adaptive icon package
4. Replace files in `android/app/src/main/res/`

### Splash Screen
Create splash screen in `android/app/src/main/res/drawable/splash.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splash_background"/>
    <item>
        <bitmap
            android:gravity="center"
            android:src="@drawable/splash_logo"/>
    </item>
</layer-list>
```

## Step 7: Generate Signing Key

### Create Upload Key
```bash
keytool -genkey -v -keystore shinecycle-upload-key.keystore \
  -alias shinecycle -keyalg RSA -keysize 2048 -validity 10000
```

**IMPORTANT**: Save the keystore file and password securely!

### Configure Signing

Create `android/key.properties`:
```properties
storePassword=your_store_password
keyPassword=your_key_password
keyAlias=shinecycle
storeFile=shinecycle-upload-key.keystore
```

Update `android/app/build.gradle`:
```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }
}
```

### Get SHA-1 Fingerprint
```bash
keytool -list -v -keystore shinecycle-upload-key.keystore -alias shinecycle
```

Add this SHA-1 to Firebase Console → Project Settings → Your Android app

## Step 8: Build Release APK/AAB

### Build APK (for testing)
```bash
cd android
./gradlew assembleRelease
```
Output: `android/app/build/outputs/apk/release/app-release.apk`

### Build AAB (for Play Store)
```bash
cd android
./gradlew bundleRelease
```
Output: `android/app/build/outputs/bundle/release/app-release.aab`

## Step 9: Test the App

### Install on Device
```bash
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Test Checklist
- ✅ App launches without crashes
- ✅ Firebase authentication works (Phone OTP)
- ✅ User can create account
- ✅ Orders can be created and tracked
- ✅ QR code scanning works
- ✅ Images upload successfully
- ✅ Real-time updates work
- ✅ Push notifications arrive
- ✅ App works offline (cached data)

## Step 10: Prepare Play Store Listing

### Required Assets

#### Screenshots (minimum 2, maximum 8)
- **Phone**: 1080x1920 or 1080x2400
- **7-inch Tablet**: 1200x1920
- **10-inch Tablet**: 1600x2560

#### Feature Graphic
- **Size**: 1024x500 PNG
- **No text**: Keep important info away from edges

#### App Icon
- **Size**: 512x512 PNG (32-bit)
- **No transparency**

### Store Listing Content

#### App Title (max 50 chars)
```
ShineCycle - Laundry Delivery
```

#### Short Description (max 80 chars)
```
On-demand laundry service with doorstep pickup & delivery. Quick & convenient!
```

#### Full Description (max 4000 chars)
```
🧺 ShineCycle - Your Complete Laundry Solution

Transform your laundry experience with ShineCycle! We connect you with professional laundry service providers for hassle-free doorstep pickup and delivery.

✨ KEY FEATURES:

FOR CUSTOMERS:
• 📱 Easy Order Placement - Select services, schedule pickup in seconds
• 🚚 Real-Time Tracking - Track your order from pickup to delivery
• 💰 Transparent Pricing - Know exactly what you'll pay upfront
• 🎟️ Exclusive Offers - Special discounts and coupons
• ⭐ Quality Assurance - Rate and review your experience
• 📍 Multiple Addresses - Save home, office, and more
• 🔒 Secure Payments - Multiple payment options

FOR SERVICE PROVIDERS:
• 📊 Business Dashboard - Manage orders and track revenue
• 💼 Professional Tools - Streamline your operations
• 📈 Analytics & Reports - Grow your business with insights
• 🔔 Instant Notifications - Never miss an order

🎯 SERVICES AVAILABLE:
• Wash & Fold
• Dry Cleaning
• Ironing & Pressing
• Stain Removal
• Shoe Cleaning
• Carpet & Upholstery Cleaning

🔐 SECURITY & PRIVACY:
• Secure authentication with OTP verification
• Encrypted data transmission
• Safe payment processing
• Privacy-first approach

📞 CUSTOMER SUPPORT:
Our dedicated support team is here to help with any questions or concerns.

Download ShineCycle today and experience the future of laundry services! 🚀
```

#### Privacy Policy URL
You need to create and host a privacy policy. Required content:
- Data collection practices
- How user data is used
- Third-party services (Firebase, payment processors)
- User rights and data deletion
- Contact information

### Category
**Lifestyle**

### Content Rating
Complete the content rating questionnaire:
- Violence: None
- Sexual Content: None
- Language: Everyone
- Controlled Substances: None
- Gambling: None

Target age: **Everyone**

## Step 11: Submit to Play Store

### Create Play Console Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Complete account verification

### Create New App
1. Click "Create app"
2. Fill in details:
   - **App name**: ShineCycle
   - **Default language**: English (US)
   - **App or game**: App
   - **Free or paid**: Free

### Complete Dashboard Tasks

#### 1. App Access
Declare if login is required and provide test account

#### 2. Ads
Declare if app contains ads (No)

#### 3. Content Rating
Complete questionnaire for age rating

#### 4. Target Audience
Select target age groups

#### 5. Privacy Policy
Add your privacy policy URL

#### 6. App Category
Select "Lifestyle"

#### 7. Store Listing
- Upload screenshots
- Add feature graphic
- Write descriptions
- Add app icon

#### 8. Upload App Bundle
- Upload `app-release.aab`
- Add release notes

### Release Tracks

#### 1. Internal Testing (optional)
- Quick testing with up to 100 users
- No review required

#### 2. Closed Testing (optional)
- Test with selected users
- Faster review

#### 3. Open Testing (optional)
- Public beta
- Get feedback before launch

#### 4. Production
- Live on Play Store
- Full review process

### Submit for Review
1. Review all sections
2. Fix any warnings
3. Click "Send for review"
4. Wait 1-7 days for approval

## Post-Launch Checklist

### Monitor Performance
- ✅ Check crash reports in Play Console
- ✅ Review user feedback and ratings
- ✅ Monitor Firebase Analytics
- ✅ Track user engagement metrics

### Regular Updates
- ✅ Fix bugs based on crash reports
- ✅ Add new features based on feedback
- ✅ Update dependencies and SDKs
- ✅ Improve performance

### Marketing
- ✅ Share on social media
- ✅ Create promotional materials
- ✅ Run ads if budget allows
- ✅ Encourage users to rate and review

## Common Issues & Solutions

### Issue: App crashes on startup
**Solution**: Check Firebase configuration and SHA-1 fingerprint

### Issue: Phone authentication not working
**Solution**: Verify Firebase Phone Auth is enabled and SHA-1 is added

### Issue: Build fails
**Solution**: Clean build with `./gradlew clean` then rebuild

### Issue: App rejected
**Solution**: Read rejection reason carefully, address issues, resubmit

## Useful Commands

```bash
# Build web app
npm run build

# Sync with Android
npx cap sync android

# Open in Android Studio
npx cap open android

# Run on device
npx cap run android

# Build release APK
cd android && ./gradlew assembleRelease

# Build release AAB
cd android && ./gradlew bundleRelease

# Clean build
cd android && ./gradlew clean
```

## Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Firebase Android Setup](https://firebase.google.com/docs/android/setup)
- [Google Play Console](https://play.google.com/console)
- [Android Developer Guidelines](https://developer.android.com/distribute/best-practices/launch)

## Support

For issues specific to ShineCycle app:
1. Check this guide first
2. Review Firebase console for configuration issues
3. Check Android Studio logcat for errors
4. Consult Capacitor documentation for plugin issues

---

**Last Updated**: January 2024
**App Version**: 1.0.0
**Minimum Android**: 5.1 (API 22)
**Target Android**: 14 (API 34)
