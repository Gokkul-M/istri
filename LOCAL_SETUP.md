# 🚀 ShineCycle Local Setup Guide

This guide will help you set up and run the ShineCycle laundry service platform locally on your machine using VS Code.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)
- **VS Code** - [Download here](https://code.visualstudio.com/)
- **Firebase Account** - [Sign up here](https://firebase.google.com/)

## 🔧 Step 1: Clone the Repository

```bash
git clone <your-repository-url>
cd shinecycle
```

## 🔥 Step 2: Set Up Firebase

### 2.1 Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or use your existing project: `istri-82971`
3. Follow the setup wizard

### 2.2 Enable Firebase Services

1. **Authentication**
   - Go to **Build > Authentication**
   - Click **Get Started**
   - Enable **Email/Password** sign-in method

2. **Firestore Database**
   - Go to **Build > Firestore Database**
   - Click **Create database**
   - Start in **test mode** (or production mode with rules)
   - Choose your region (closest to your location)

3. **Storage**
   - Go to **Build > Storage**
   - Click **Get Started**
   - Start in **test mode** (or production mode with rules)

### 2.3 Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. Click on the **Web app** icon `</>` or select your existing web app
4. Copy the `firebaseConfig` object values

### 2.4 Create Required Firestore Indexes (CRITICAL!)

**⚠️ IMPORTANT:** Your app will not work without these indexes!

1. Go to **Firestore Database > Indexes** tab
2. Click **"Create Index"**
3. Create these two indexes:

**Index 1: Orders by Customer ID**
- Collection ID: `orders`
- Fields:
  - `customerId` → Ascending
  - `createdAt` → Descending
- Click **Create**

**Index 2: Orders by Launderer ID**
- Collection ID: `orders`
- Fields:
  - `laundererId` → Ascending
  - `createdAt` → Descending
- Click **Create**

**Alternative:** When you run the app, Firebase will show error links in the browser console. Click those links to auto-create the indexes!

Wait 1-2 minutes for indexes to build (status will change from "Building" to "Enabled").

📖 **See [FIREBASE_INDEXES.md](./FIREBASE_INDEXES.md) for detailed instructions.**

### 2.5 Set Up Firestore Security Rules

Go to **Firestore Database > Rules** and paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profile access
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      
      match /addresses/{addressId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    
    // User settings
    match /userSettings/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders
    match /orders/{orderId} {
      allow read: if request.auth != null && 
        (resource.data.customerId == request.auth.uid || 
         resource.data.laundererId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (resource.data.customerId == request.auth.uid || 
         resource.data.laundererId == request.auth.uid ||
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Services
    match /services/{serviceId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Coupons
    match /coupons/{couponId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Messages
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Disputes
    match /disputes/{disputeId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 2.6 Set Up Storage Security Rules

Go to **Storage > Rules** and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-images/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 🗃️ Step 3: Add Initial Data to Firebase

### 3.1 Add Services (Required)

1. Go to **Firestore Database**
2. Click **Start collection**
3. Collection ID: `services`
4. Add these three documents:

**Document 1:**
```
Field name: name          | Type: string | Value: Ironing
Field name: price         | Type: number | Value: 12
Field name: description   | Type: string | Value: Professional ironing service for all your clothes
Field name: icon          | Type: string | Value: iron
```

**Document 2:**
```
Field name: name          | Type: string | Value: Washing
Field name: price         | Type: number | Value: 20
Field name: description   | Type: string | Value: Complete washing service with premium detergents
Field name: icon          | Type: string | Value: washing-machine
```

**Document 3:**
```
Field name: name          | Type: string | Value: Dry Cleaning
Field name: price         | Type: number | Value: 30
Field name: description   | Type: string | Value: Professional dry cleaning for delicate garments
Field name: icon          | Type: string | Value: sparkles
```

### 3.2 Add Promotional Coupons (Optional)

Create a `coupons` collection with documents like:

```
Field name: code          | Type: string | Value: IRON40
Field name: discount      | Type: number | Value: 40
Field name: description   | Type: string | Value: Get 40% off on Ironing service
Field name: serviceType   | Type: string | Value: Ironing
Field name: validUntil    | Type: string | Value: 2025-12-31
Field name: minOrder      | Type: number | Value: 100
Field name: active        | Type: boolean| Value: true
```

## ⚙️ Step 4: Configure Environment Variables

1. **Copy the example environment file:**

```bash
cp .env.example .env
```

2. **Open `.env` file and fill in your Firebase configuration:**

```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=istri-82971.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=istri-82971
VITE_FIREBASE_STORAGE_BUCKET=istri-82971.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**⚠️ Important:** Never commit the `.env` file to version control. It's already added to `.gitignore`.

## 📦 Step 5: Install Dependencies

```bash
npm install
```

## 🏃 Step 6: Run the Development Server

```bash
npm run dev
```

The application will start on **http://localhost:5000**

## 🔐 Step 7: Create Test Accounts

### Create Customer Account
1. Go to http://localhost:5000
2. Click **Sign Up**
3. Select **Customer** role
4. Fill in details:
   - Name: Test Customer
   - Email: customer@test.com
   - Phone: +919876543210
   - Password: Test@123
5. Complete profile setup

### Create Launderer Account
1. Open a new incognito/private window
2. Go to http://localhost:5000
3. Click **Sign Up**
4. Select **Launderer** role
5. Fill in details:
   - Name: Test Launderer
   - Email: launderer@test.com
   - Phone: +919876543211
   - Password: Test@123
6. Complete business profile setup

### Create Admin Account (Manually in Firebase)
1. Create a regular account first through the UI
2. Go to Firebase Console > Authentication
3. Copy the User UID
4. Go to Firestore Database > users collection
5. Find the document with that UID
6. Change `role` field to `admin`
7. Log out and log back in

## 📱 Step 8: Test the Application

### Customer Flow
1. Login as customer
2. Create a new order:
   - Select multiple services (Ironing + Washing)
   - Add 10 clothes
   - See total: (₹12 + ₹20) × 10 = ₹320
3. View order history
4. Apply coupon code

### Launderer Flow
1. Login as launderer
2. View pending orders
3. Accept/reject orders
4. Scan QR codes
5. Update order status

### Admin Flow
1. Login as admin
2. View dashboard with metrics
3. Manage services and coupons
4. Assign orders to launderers
5. Handle disputes

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📂 Project Structure

```
shinecycle/
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ui/         # shadcn/ui components
│   ├── hooks/          # Custom React hooks
│   │   ├── useFirebaseAuth.ts
│   │   ├── useFirebaseOrders.ts
│   │   └── useFirebaseServices.ts
│   ├── lib/            # Utility functions
│   │   ├── firebase/   # Firebase configuration
│   │   └── utils.ts    # Helper functions
│   ├── pages/          # Page components
│   │   ├── customer/   # Customer pages
│   │   ├── launderer/  # Launderer pages
│   │   └── admin/      # Admin pages
│   ├── App.tsx         # Main app component
│   └── main.tsx        # Entry point
├── .env.example        # Environment variables template
├── .env               # Your environment variables (not committed)
├── package.json       # Dependencies
└── vite.config.ts     # Vite configuration
```

## ⚠️ Common Issue: "Request contains an invalid argument"

**This error means Firestore indexes are missing!**

**Quick Fix:**
1. Open browser console (F12)
2. Look for Firebase error with a link
3. Click the link to auto-create the index
4. Wait 1-2 minutes
5. Refresh the app

📖 **See [FIREBASE_INDEXES.md](./FIREBASE_INDEXES.md) for detailed fix!**

## 🔍 Troubleshooting

### Issue: Firebase Authentication Error
**Solution:** 
- Verify your API key in `.env` is correct
- Ensure Email/Password is enabled in Firebase Console

### Issue: Firestore Permission Denied
**Solution:**
- Check Firestore Security Rules are properly set
- Ensure user is authenticated
- Verify user role is correct in Firestore

### Issue: Port 5000 Already in Use
**Solution:**
```bash
# Kill the process using port 5000
npx kill-port 5000

# Or change the port in vite.config.ts
```

### Issue: Environment Variables Not Loading
**Solution:**
- Ensure `.env` file is in the root directory
- All variables must start with `VITE_`
- Restart the development server after changing `.env`

### Issue: Services Not Showing
**Solution:**
- Verify you've added the three services to Firestore
- Check browser console for errors
- Ensure Firestore rules allow reading services

## 🔒 Security Notes

- ⚠️ **Never commit `.env` file** - It contains sensitive credentials
- ⚠️ **Use test mode only for development** - Enable proper security rules for production
- ⚠️ **Keep Firebase API keys secure** - They should never be exposed in public repositories
- ⚠️ **Change default passwords** - Use strong passwords for production accounts

## 📚 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Review Firebase Console for authentication/database issues
3. Ensure all environment variables are set correctly
4. Verify Firebase services are enabled

## 🎉 You're All Set!

Your ShineCycle application should now be running locally. Happy coding! 🚀
