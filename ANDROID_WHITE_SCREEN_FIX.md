# Android White Screen Fix

## Problem
After building your React + Capacitor app as an APK and installing it on Android, the app opens but shows only a white screen.

## Root Causes Fixed

### 1. ✅ Vite Base Path Issue (MAIN CAUSE)
**Problem:** Vite builds with absolute paths (`/assets/...`) but Capacitor needs relative paths (`./assets/...`)

**Fix:** Added `base: './'` to `vite.config.ts`

```typescript
export default defineConfig(({ mode }) => ({
  base: './',  // ← This is critical for Capacitor!
  // ... rest of config
}));
```

### 2. ✅ React Router Compatibility
**Problem:** `BrowserRouter` uses HTML5 History API which can fail in Android WebView

**Fix:** Changed to `HashRouter` in `src/App.tsx` for better mobile compatibility

```typescript
import { HashRouter } from "react-router-dom";

// URLs will now use hash format: 
// /#/login instead of /login
```

---

## How to Rebuild Your App

### On Your Local Machine (Windows)

1. **Pull the latest code from Replit:**
   ```powershell
   cd C:\Users\admin\AndroidStudioProjects\istri
   git pull origin main  # Or download as ZIP from Replit
   ```

2. **Rebuild the web app:**
   ```powershell
   npm run build
   ```

3. **Sync to Android:**
   ```powershell
   npx cap sync android
   ```

4. **Build APK (if you have JAVA_HOME set):**
   ```powershell
   npm run android:build:win
   ```
   
   **OR use Android Studio (easier):**
   - Open Android Studio
   - File → Open → Select `android` folder
   - Build → Generate Signed Bundle / APK
   - Follow wizard

5. **Install on your phone and test!**

---

## Verification Steps

After rebuilding, your app should:

✅ Open without white screen
✅ Show the ShineCycle welcome/login page
✅ Navigate between pages properly
✅ Load all images and assets
✅ Connect to Firebase (if google-services.json is configured)

---

## Still Seeing White Screen?

### Debug with Android Studio

1. **Connect your phone via USB**
2. **Enable USB Debugging** on your phone (Developer Options)
3. **Open Android Studio** → Bottom: `Logcat` tab
4. **Install and open your app**
5. **Look for errors** in red

Common errors to look for:
- `net::ERR_FILE_NOT_FOUND` → Asset path issue
- `Firebase error` → Missing google-services.json
- `Uncaught SyntaxError` → JavaScript error
- `Failed to load resource` → Build issue

### Check WebView Console (Chrome DevTools)

1. **On your computer:** Open Chrome browser
2. **Type:** `chrome://inspect`
3. **Connect phone via USB** with app running
4. **Click "Inspect"** on your app
5. **See JavaScript errors** in the console

---

## Firebase Configuration (Important!)

If you're using Firebase, you MUST add `google-services.json`:

1. **Go to:** [Firebase Console](https://console.firebase.google.com/)
2. **Select:** Project `istri-82971`
3. **Add Android app:** Package name `com.shinecycle.laundry`
4. **Download:** `google-services.json`
5. **Place in:** `android/app/google-services.json`
6. **Rebuild** the APK

Without this file, Firebase features won't work, but the app should still show the UI (not white screen).

---

## Summary of Changes

| File | Change | Why |
|------|--------|-----|
| `vite.config.ts` | Added `base: './'` | Fix asset paths for Capacitor |
| `src/App.tsx` | Changed to `HashRouter` | Better routing in Android WebView |
| `vite.config.ts` | Added mobile optimizations | Smaller build size, better performance |

---

## Next Steps

1. ✅ Pull latest code from Replit
2. ✅ Rebuild with `npm run build`
3. ✅ Sync with `npx cap sync android`
4. ✅ Build APK in Android Studio
5. ✅ Test on your phone
6. 🎉 Should work now!

If issues persist, use Android Studio's Logcat to see the actual error messages.
