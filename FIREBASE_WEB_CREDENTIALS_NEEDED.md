# Firebase Web Credentials Required

## ⚠️ Action Needed: Get Firebase Web App Configuration

You've provided the Firebase **Service Account** credentials, but the web app needs **Web App** credentials instead.

## How to Get Web App Credentials

### Step 1: Access Firebase Console
1. Go to https://console.firebase.google.com/
2. Select your project: **istri-82971**

### Step 2: Get Web App Config
1. Click the **Settings gear ⚙️** in the left sidebar
2. Select **Project Settings**
3. Scroll down to **Your apps** section
4. You should see a **Web app** (icon: `</>`)
   - If no web app exists, click "Add app" → Select Web
   - Enter nickname: "ShineCycle Web"
   - Click "Register app"

### Step 3: Copy Configuration
You'll see a `firebaseConfig` object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "istri-82971.firebaseapp.com",
  projectId: "istri-82971",
  storageBucket: "istri-82971.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

## What We Need

Please provide these 6 values:

1. **API Key** (`apiKey`)
2. **Auth Domain** (`authDomain`) 
3. **Project ID** (`projectId`) - We know this is `istri-82971`
4. **Storage Bucket** (`storageBucket`)
5. **Messaging Sender ID** (`messagingSenderId`)
6. **App ID** (`appId`)

## How to Add Them

You can either:

### Option 1: Add to Replit Secrets (Recommended)
1. Click the lock icon 🔒 in the left sidebar (Secrets)
2. Add each value with these exact names:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=istri-82971.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=istri-82971
   VITE_FIREBASE_STORAGE_BUCKET=istri-82971.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Option 2: Share the Config Object
Just copy and share the entire `firebaseConfig` object and I'll extract the values.

## Why Service Account Doesn't Work

The service account JSON you provided is for:
- ✅ Server-side operations
- ✅ Admin SDK access
- ✅ Backend automation

But our React web app needs:
- ✅ Client-side Firebase SDK configuration
- ✅ Web app credentials for browser access
- ✅ Authentication with Firebase services from frontend

## Next Steps

1. ✅ Get the Firebase web app config (instructions above)
2. ✅ Add credentials to Replit Secrets or share them
3. ✅ I'll verify the Firebase connection works
4. ✅ Then we'll proceed with Android app setup

---

**Note**: Once you provide the web credentials, your app will be able to:
- Authenticate users with Phone OTP
- Store data in Firestore
- Upload images to Firebase Storage
- Work as a complete functional app
