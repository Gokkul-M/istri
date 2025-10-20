# 🚀 Quick Start: Build ShineCycle Mobile Apps

**Get your APK and IPA files in minutes!**

---

## ⚡ **Super Fast Build Commands**

### **Android APK (works everywhere)**

#### **Linux/macOS:**
```bash
./build-android.sh
```

#### **Windows:**
```bash
build-android.bat
```

**Output:** `android/app/build/outputs/apk/release/app-release.apk`

---

### **iOS IPA (macOS only)**

```bash
./ios-setup/build-ios.sh
```

**Output:** `ios/App/build/App.ipa`

---

## 📱 **What Gets Built**

### **Android Package:**
- ✅ Optimized production build
- ✅ Minified code (703 KB)
- ✅ All native features included
- ✅ Ready to install on any Android device
- ✅ Can be uploaded to Google Play Store

### **iOS Package:**
- ✅ Optimized production build
- ✅ All native features included
- ✅ Ready for TestFlight
- ✅ Ready for App Store submission

---

## 🎯 **Installation on Devices**

### **Android (via USB):**
```bash
# 1. Connect phone via USB
# 2. Enable Developer Mode & USB Debugging
# 3. Install:
adb install android/app/build/outputs/apk/release/app-release.apk
```

### **Android (via file):**
1. Copy APK to phone
2. Open APK file
3. Tap "Install"
4. Allow "Install from unknown sources" if prompted

### **iOS (via Xcode):**
```bash
# 1. Connect iPhone via USB
# 2. Open Xcode:
npm run ios:open

# 3. In Xcode:
#    - Select your device
#    - Click Run (⌘R)
```

---

## 🔧 **Prerequisites Check**

### **For Android:**
- [ ] Node.js installed? → `node --version`
- [ ] npm installed? → `npm --version`
- [ ] Android SDK? → Check Android Studio

### **For iOS:**
- [ ] Running macOS? → `uname -a`
- [ ] Xcode installed? → `xcodebuild -version`
- [ ] CocoaPods? → `pod --version`

---

## 🐛 **Quick Fixes**

### **Build fails?**
```bash
# Clean everything
npm run android:clean  # or just delete android/app/build/
npm run build
./build-android.sh
```

### **"Command not found" error?**
```bash
# Make scripts executable
chmod +x build-android.sh
chmod +x ios-setup/build-ios.sh
```

### **iOS build fails?**
```bash
# Update dependencies
cd ios/App
pod install
cd ../..
```

---

## 📊 **Build Time Estimates**

| Platform | First Build | Subsequent Builds |
|----------|-------------|-------------------|
| Android | 2-5 minutes | 1-3 minutes |
| iOS | 5-10 minutes | 2-5 minutes |

---

## 🎉 **Success!**

After building, you'll have:
- ✅ Installable app file (APK or IPA)
- ✅ Can install on unlimited devices (Android)
- ✅ Can test immediately on your phone
- ✅ Can distribute to others
- ✅ Can submit to app stores

---

## 📖 **Need More Help?**

- **Full Guide:** See [BUILD_GUIDE.md](BUILD_GUIDE.md)
- **Setup Issues:** See [MOBILE_SETUP_GUIDE.md](MOBILE_SETUP_GUIDE.md)
- **Testing:** See [MOBILE_CONNECTIVITY_CHECKLIST.md](MOBILE_CONNECTIVITY_CHECKLIST.md)

---

**Happy Building! 🚀📱**
