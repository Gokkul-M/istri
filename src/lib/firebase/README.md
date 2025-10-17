# Firebase Integration for Laundry Service Platform

## Quick Start

### 1. Setup Firebase Project
```bash
# Add your Firebase config to Replit Secrets or .env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=istri-82971.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=istri-82971
VITE_FIREBASE_STORAGE_BUCKET=istri-82971.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Enable Firebase Services
- Enable Phone Authentication
- Enable Email/Password Authentication
- Create Firestore Database
- Enable Firebase Storage

### 3. Deploy Security Rules
Copy `firestore.rules` and `storage.rules` to Firebase Console

### 4. Seed Data (Optional)
```typescript
import { seedFirebaseData } from '@/lib/firebase';
await seedFirebaseData();
```

## Architecture

### Services

#### `authService` - Authentication
- `sendOTP(phoneNumber, recaptchaContainerId)` - Send OTP to phone
- `verifyOTP(verificationId, code)` - Verify OTP code
- `signInWithEmail(email, password)` - Email/password sign in (admin)
- `createAccount(email, password)` - Create new account
- `signOut()` - Sign out current user
- `onAuthChange(callback)` - Listen to auth state changes
- `getUserProfile(uid)` - Get user profile from Firestore
- `createUserProfile(uid, userData)` - Create user profile in Firestore

#### `firestoreService` - Database Operations
**Users**
- `createUser(user)`
- `getUser(userId)`
- `getAllUsers()`
- `getUsersByRole(role)`
- `updateUser(userId, updates)`
- `deleteUser(userId)`

**Orders**
- `createOrder(order)`
- `getOrder(orderId)`
- `getAllOrders()`
- `getOrdersByCustomer(customerId)`
- `getOrdersByLaunderer(laundererId)`
- `getOrdersByStatus(status)`
- `updateOrder(orderId, updates)`
- `onOrdersChange(callback, constraints)` - Real-time listener

**Services**
- `createService(service)`
- `getAllServices()`
- `updateService(serviceId, updates)`
- `deleteService(serviceId)`

**Coupons**
- `createCoupon(coupon)`
- `getAllCoupons()`
- `getActiveCoupons()`
- `getCouponByCode(code)`
- `updateCoupon(couponId, updates)`
- `deleteCoupon(couponId)`

**Disputes**
- `createDispute(dispute)`
- `getAllDisputes()`
- `getDisputesByStatus(status)`
- `updateDispute(disputeId, updates)`

**Messages**
- `createMessage(message)`
- `getMessagesForUser(userId)`
- `markMessageAsRead(messageId)`
- `onMessagesChange(userId, callback)` - Real-time listener

#### `storageService` - File Storage
- `uploadFile(path, file, onProgress?)` - Upload any file
- `uploadUserAvatar(userId, file)` - Upload user avatar
- `uploadBusinessLogo(businessId, file)` - Upload business logo
- `deleteFile(url)` - Delete file
- `getFileURL(path)` - Get download URL

### React Hooks

#### `useAuth()`
```typescript
const { user, firebaseUser, loading, signOut, isAuthenticated } = useAuth();
```

#### `useFirestoreOrders(userId, role)`
```typescript
const { orders, loading, error } = useFirestoreOrders(userId, 'customer');
```

#### `useFirestoreMessages(userId)`
```typescript
const { messages, loading, error } = useFirestoreMessages(userId);
```

## Implementation Examples

### Phone Authentication Flow

```typescript
import { authService } from '@/lib/firebase';

function LoginPage() {
  const sendOTP = async () => {
    try {
      const result = await authService.sendOTP('+919876543210', 'recaptcha-container');
      setConfirmationResult(result);
    } catch (error) {
      console.error('Error sending OTP:', error);
    }
  };

  const verifyOTP = async (code: string) => {
    try {
      const user = await confirmationResult.confirm(code);
      // Check if user profile exists
      const profile = await authService.getUserProfile(user.uid);
      if (!profile) {
        // Redirect to profile setup
        navigate('/auth/select-role');
      } else {
        // User is logged in
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
    }
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      {/* Your UI */}
    </div>
  );
}
```

### Create Order with Real-time Updates

```typescript
import { firestoreService } from '@/lib/firebase';
import { useFirestoreOrders } from '@/hooks/useFirestoreOrders';

function CustomerDashboard() {
  const { user } = useAuth();
  const { orders, loading } = useFirestoreOrders(user?.id, 'customer');

  const createNewOrder = async (orderData) => {
    try {
      const orderId = await firestoreService.createOrder({
        ...orderData,
        customerId: user.id,
        status: 'pending',
        qrCode: `QR-${Date.now()}`,
      });
      console.log('Order created:', orderId);
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <div>
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Upload Profile Picture

```typescript
import { storageService } from '@/lib/firebase';
import { firestoreService } from '@/lib/firebase';

function ProfilePage() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  const handleAvatarUpload = async (file: File) => {
    setUploading(true);
    try {
      const avatarURL = await storageService.uploadUserAvatar(
        user.id,
        file,
        (progress) => console.log(`Upload: ${progress}%`)
      );
      
      await firestoreService.updateUser(user.id, {
        avatar: avatarURL
      });
      
      console.log('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleAvatarUpload(file);
        }}
      />
    </div>
  );
}
```

## Security Notes

1. **Phone Numbers**: Always use international format (+91XXXXXXXXXX)
2. **reCAPTCHA**: Required for phone auth, add `<div id="recaptcha-container"></div>`
3. **Role-Based Access**: All operations enforce security rules
4. **File Size**: Maximum 5MB per file in storage
5. **Real-time Listeners**: Remember to unsubscribe when component unmounts

## Migration from Zustand

The existing Zustand store can work alongside Firebase:
- Keep Zustand for UI state and optimistic updates
- Use Firebase hooks for data fetching and real-time updates
- Sync Zustand state with Firebase data

Example:
```typescript
const { orders } = useFirestoreOrders(userId, 'customer');

useEffect(() => {
  // Sync Firebase data to Zustand if needed
  if (orders) {
    updateLocalOrders(orders);
  }
}, [orders]);
```

## Troubleshooting

**Error: "reCAPTCHA not found"**
- Add `<div id="recaptcha-container"></div>` to your component
- Ensure it's rendered before calling `sendOTP()`

**Error: "Permission denied"**
- Check if Firestore/Storage rules are deployed
- Verify user has correct role in users collection
- Ensure user is authenticated

**Error: "Firebase not initialized"**
- Check environment variables are set
- Verify Firebase config in config.ts

## Additional Resources

See `FIREBASE_SETUP.md` in the root directory for complete setup guide.
