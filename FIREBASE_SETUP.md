# Firebase Backend Setup Guide

## ⚠️ URGENT: Fix Permission Denied Errors

If you're seeing **"Missing or insufficient permissions"** errors, you need to update your Firestore Security Rules:

### Quick Fix Steps:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **istri-82971**
3. Navigate to **Firestore Database** → **Rules** tab
4. Copy the entire content from `firestore.rules` file in this project
5. Paste into the Firebase Console rules editor
6. Click **Publish**
7. Wait 1-2 minutes for rules to propagate

**The issue**: The current rules were preventing profile creation during signup. The updated rules fix this by removing circular dependency checks.

---

## Overview
This laundry service platform now uses Firebase as its complete backend solution, providing:
- **Authentication**: Email/Password for all users (customers, launderers, admins)
- **Database**: Firestore for real-time data storage
- **Storage**: Firebase Storage for user avatars and business logos
- **Security**: Role-based access control with Firestore Security Rules

## 📁 Project Structure

```
src/
├── lib/
│   └── firebase/
│       ├── config.ts          # Firebase initialization
│       ├── auth.ts            # Authentication service
│       ├── firestore.ts       # Database operations
│       ├── storage.ts         # File storage operations
│       ├── seedData.ts        # Initial data seeding
│       └── index.ts           # Exports
├── hooks/
│   ├── useFirebaseAuth.ts     # Authentication hook
│   ├── useFirestoreOrders.ts  # Real-time orders hook
│   └── useFirestoreMessages.ts # Real-time messages hook
└── store/
    └── useStore.ts            # Zustand store (now Firebase-integrated)

firestore.rules                # Firestore security rules
storage.rules                  # Storage security rules
```

## 🔧 Setup Instructions

### 1. Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **istri-82971**
3. Click Settings (⚙️) → Project Settings
4. Scroll to "Your apps" → Click Web app (</>)
5. Copy the configuration object

### 2. Add Environment Variables

Add these to your Replit Secrets (or `.env` file):

```
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=istri-82971.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=istri-82971
VITE_FIREBASE_STORAGE_BUCKET=istri-82971.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Enable Firebase Services

In Firebase Console:

#### Enable Authentication
1. Go to **Authentication** → **Sign-in method**
2. Enable **Phone** authentication
3. Enable **Email/Password** authentication (for admin)
4. Configure reCAPTCHA settings

#### Create Firestore Database
1. Go to **Firestore Database** → **Create database**
2. Start in **Production mode**
3. Choose your preferred location
4. Click **Enable**

#### Enable Storage
1. Go to **Storage** → **Get started**
2. Start in **Production mode**
3. Click **Done**

### 4. Deploy Security Rules

#### Firestore Rules
1. Go to **Firestore Database** → **Rules**
2. Copy content from `firestore.rules`
3. Click **Publish**

#### Storage Rules
1. Go to **Storage** → **Rules**
2. Copy content from `storage.rules`
3. Click **Publish**

### 5. Seed Initial Data (Optional)

To populate your database with sample data, run in browser console:

```javascript
import { seedFirebaseData } from '@/lib/firebase';
await seedFirebaseData();
```

Or create a temporary page/button that calls this function once.

## 🏗️ Data Structure

### Collections

#### `users`
```typescript
{
  id: string;              // Firebase Auth UID
  role: 'customer' | 'launderer' | 'admin';
  name: string;
  email: string;
  phone: string;
  address: string;
  pinCode: string;
  isActive?: boolean;
  avatar?: string;
  
  // Launderer specific
  businessName?: string;
  businessDescription?: string;
  logo?: string;
  pricePerKg?: number;
  rating?: number;
  verified?: boolean;
  verificationDate?: string;
}
```

#### `orders`
```typescript
{
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  laundererId?: string;
  laundererName?: string;
  items: OrderItem[];
  totalAmount: number;
  discount?: number;
  finalAmount?: number;
  status: OrderStatus;
  pickupTime: string;
  deliveryTime: string;
  qrCode: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  rating?: number;
  feedback?: string;
}
```

#### `services`
```typescript
{
  id: string;
  name: string;
  icon: string;
  price: number;
  description: string;
}
```

#### `coupons`
```typescript
{
  id: string;
  code: string;
  discount: number;
  description: string;
  validFrom: string;
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  createdBy: string;
  assignedTo?: string[];
}
```

#### `disputes`
```typescript
{
  id: string;
  orderId: string;
  customerId: string;
  laundererId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  createdAt: Timestamp;
  resolvedAt?: Timestamp;
  adminNotes?: string;
  resolution?: string;
}
```

#### `messages`
```typescript
{
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
  read: boolean;
  type: 'admin_to_launderer' | 'launderer_to_admin' | 'system';
}
```

## 🔐 Security Rules Summary

### Users
- ✅ Read: All authenticated users
- ✅ Create: Own profile only
- ✅ Update: Own profile or admin
- ✅ Delete: Admin only

### Orders
- ✅ Read: Customer, assigned launderer, or admin
- ✅ Create: Customers only
- ✅ Update: Related customer, launderer, or admin
- ✅ Delete: Admin only

### Services
- ✅ Read: All authenticated users
- ✅ Create/Update: Admin or launderers
- ✅ Delete: Admin only

### Coupons
- ✅ Read: All authenticated users
- ✅ Create/Update/Delete: Admin only

### Disputes
- ✅ Read: Related customer, launderer, or admin
- ✅ Create: Customers and launderers
- ✅ Update/Delete: Admin only

## 📱 Usage Examples

### Authentication

```typescript
import { authService } from '@/lib/firebase';

// Phone OTP Login
const confirmationResult = await authService.sendOTP('+919876543210', 'recaptcha-container');
const user = await confirmationResult.confirm('123456');

// Admin Email Login
const user = await authService.signInWithEmail('admin@example.com', 'password');

// Create User Profile
await authService.createUserProfile(user.uid, {
  role: 'customer',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+919876543210',
  address: '123 Main St',
  pinCode: '560001',
});
```

### Firestore Operations

```typescript
import { firestoreService } from '@/lib/firebase';

// Create Order
const orderId = await firestoreService.createOrder({
  customerId: 'C1',
  customerName: 'John Doe',
  items: [...],
  totalAmount: 500,
  status: 'pending',
  // ... other fields
});

// Get Orders by Customer
const orders = await firestoreService.getOrdersByCustomer('C1');

// Update Order Status
await firestoreService.updateOrder('orderId', {
  status: 'confirmed',
  laundererId: 'L1',
});

// Real-time Order Updates
const unsubscribe = firestoreService.onOrdersChange((orders) => {
  console.log('Updated orders:', orders);
});
```

### Storage Operations

```typescript
import { storageService } from '@/lib/firebase';

// Upload User Avatar
const file = event.target.files[0];
const avatarURL = await storageService.uploadUserAvatar('userId', file);

// Upload with Progress
const url = await storageService.uploadFile('path/to/file', file, (progress) => {
  console.log(`Upload: ${progress}%`);
});
```

### React Hooks

```typescript
// Authentication Hook
const { user, loading, signOut } = useAuth();

// Real-time Orders
const { orders, loading } = useFirestoreOrders(userId, 'customer');

// Real-time Messages
const { messages, loading } = useFirestoreMessages(userId);
```

## 🚀 Deployment Checklist

- [ ] Add Firebase environment variables to Replit Secrets
- [ ] Enable Phone Authentication in Firebase Console
- [ ] Enable Email/Password Authentication for admin
- [ ] Create Firestore Database
- [ ] Deploy Firestore Security Rules
- [ ] Enable Firebase Storage
- [ ] Deploy Storage Security Rules
- [ ] (Optional) Seed initial data
- [ ] Test authentication flow
- [ ] Test order creation and updates
- [ ] Test real-time listeners
- [ ] Verify security rules work correctly

## 📝 Notes

1. **Phone Number Format**: Use international format (+91XXXXXXXXXX)
2. **reCAPTCHA**: Add `<div id="recaptcha-container"></div>` for phone auth
3. **Real-time Updates**: Orders and messages have real-time listeners
4. **File Uploads**: Maximum 5MB per file
5. **Security**: All operations enforce role-based access control

## 🐛 Troubleshooting

### "reCAPTCHA not found"
- Ensure you have a div with id="recaptcha-container" in your component
- Make sure it's visible (can be hidden with CSS)

### "Permission denied"
- Check Firestore/Storage rules are deployed
- Verify user role is correctly set in users collection
- Ensure user is authenticated

### "Firebase not initialized"
- Check all environment variables are set correctly
- Verify Firebase config in src/lib/firebase/config.ts

## 🔗 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firebase Storage](https://firebase.google.com/docs/storage)
