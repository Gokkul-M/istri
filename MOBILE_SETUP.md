# 📱 ShineCycle - Native Mobile App Setup Guide

Capacitor has been configured for your native mobile app development! Follow these steps to run your app on iOS and Android devices.

## 🚀 Quick Start

### Prerequisites
- **Git** installed on your machine
- **Node.js** (v16 or higher) installed
- **For iOS**: Mac with Xcode installed
- **For Android**: Android Studio installed

## 📋 Step-by-Step Setup

### 1. Export to GitHub
1. Click the **"Export to Github"** button in Lovable
2. Clone your repository to your local machine:
   ```bash
   git clone your-repository-url
   cd your-project-folder
   ```

### 2. Install Dependencies
```bash
npm install
```

### 3. Add Native Platforms

**For Android:**
```bash
npx cap add android
```

**For iOS:**
```bash
npx cap add ios
```

**Or add both:**
```bash
npx cap add android
npx cap add ios
```

### 4. Update Native Dependencies
After adding platforms, update them:

```bash
# For Android
npx cap update android

# For iOS
npx cap update ios
```

### 5. Build Your Web App
```bash
npm run build
```

### 6. Sync to Native Platforms
This copies your web app to the native projects:
```bash
npx cap sync
```

**Important:** Run `npx cap sync` every time you:
- Pull new code from GitHub
- Make changes to native configurations
- Add new Capacitor plugins

### 7. Run on Device/Emulator

**For Android:**
```bash
npx cap run android
```
This will open Android Studio. You can then:
- Select an emulator or connected device
- Click the "Run" button

**For iOS (Mac only):**
```bash
npx cap run ios
```
This will open Xcode. You can then:
- Select a simulator or connected device
- Click the "Run" button

## 🔄 Development Workflow

### During Development
1. Make changes in Lovable
2. Pull latest code from GitHub:
   ```bash
   git pull
   ```
3. Sync changes to native platforms:
   ```bash
   npx cap sync
   ```
4. Run the app again

### Live Reload (Development Mode)
The app is configured to use hot-reload from the Lovable sandbox during development:
- URL: `https://517070c2-f905-43f6-b0ed-f3bfa86c86ca.lovableproject.com`
- This means you can make changes in Lovable and see them instantly on your device!

### For Production Build
When ready to publish, update `capacitor.config.ts`:
1. Remove the `server` section
2. Build and sync:
   ```bash
   npm run build
   npx cap sync
   ```

## 📱 App Configuration

Your app is configured with:
- **App ID**: `app.lovable.517070c2f90543f6b0edf3bfa86c86ca`
- **App Name**: `shine-cycle`
- **Live Reload**: Enabled (development only)

## 🛠 Common Commands

```bash
# Install dependencies
npm install

# Build web app
npm run build

# Sync web app to native
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios

# Run on Android
npx cap run android

# Run on iOS
npx cap run ios
```

## 📝 Important Notes

1. **After Git Pull**: Always run `npx cap sync`
2. **iOS Requires Mac**: You need a Mac with Xcode to build for iOS
3. **Android Studio**: Required for Android development
4. **Live Reload**: Only works during development with the sandbox URL
5. **Production**: Remove `server` config before publishing to stores

## 🎉 Next Steps

1. Test your app on emulators/devices
2. Add app icons and splash screens
3. Configure app permissions in native projects
4. Test all features work on mobile
5. Prepare for app store submission

## 🆘 Need Help?

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Setup Guide](https://capacitorjs.com/docs/ios)
- [Android Setup Guide](https://capacitorjs.com/docs/android)

## 📚 Additional Resources

Read the comprehensive blog post about Capacitor setup:
- [Lovable + Capacitor Guide](https://docs.lovable.dev/integrations/capacitor)

---

**Happy Mobile Development! 🚀**
