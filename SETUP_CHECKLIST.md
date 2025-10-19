# ShineCycle Setup Checklist

## ✅ Completed Steps

- [x] Firebase project created (istri-82971)
- [x] Firebase credentials configured in Replit Secrets
- [x] Application code deployed and running
- [x] Custom ID system implemented (CUST-0001, LAUN-0001, ADMIN-0001)

---

## 🔴 Required Steps (Do These Now)

### 1. Create Firestore Composite Indexes

**Why**: Without these indexes, users can't view their orders, addresses, or disputes.

**How**: Follow the guide in `FIRESTORE_INDEXES_GUIDE.md` or:

1. Go to: https://console.firebase.google.com/project/istri-82971/firestore/indexes
2. Click "Composite" tab
3. Create these 5 indexes:

| Collection | Fields | Order |
|------------|--------|-------|
| `orders` | customerId + createdAt | Asc + Desc |
| `orders` | laundererId + createdAt | Asc + Desc |
| `disputes` | customerId + createdAt | Asc + Desc |
| `disputes` | laundererId + createdAt | Asc + Desc |
| `addresses` (collection group) | isDefault + createdAt | Desc + Desc |

**Time**: 5-10 minutes (including build time)

---

### 2. Deploy Firestore Security Rules

**Why**: Current default rules are insecure and will expire after 30 days.

**How**:
1. Open Firebase Console: https://console.firebase.google.com/project/istri-82971/firestore/rules
2. Copy content from `FIRESTORE_RULES.md` (the full rules section)
3. Replace the existing rules with the new ones
4. Click "Publish"

**Important**: These rules enforce custom ID validation and prevent privilege escalation.

---

### 3. Create First Admin User (Bootstrap)

**Why**: Security rules prevent admin creation through normal signup after they're deployed.

**How**:

**Option A: Before Deploying Security Rules (Easiest)**
1. Sign up through the app at `/auth` with role "admin"
2. Note your custom ID (will be ADMIN-0001)
3. Now deploy security rules (step 2 above)

**Option B: After Deploying Security Rules (Manual)**
1. Go to: https://console.firebase.google.com/project/istri-82971/firestore/data
2. Create these documents manually:

**Document 1**: `users/ADMIN-0001`
```json
{
  "id": "ADMIN-0001",
  "firebaseUid": "YOUR_FIREBASE_AUTH_UID",
  "email": "admin@shinecycle.com",
  "role": "admin",
  "name": "Admin User",
  "phone": "+1234567890",
  "createdAt": "2025-10-19T20:00:00.000Z",
  "updatedAt": "2025-10-19T20:00:00.000Z"
}
```

**Document 2**: `counters/userIdCounters`
```json
{
  "admin": 1,
  "customer": 0,
  "launderer": 0
}
```

**Document 3**: `userMapping/YOUR_FIREBASE_AUTH_UID`
```json
{
  "customId": "ADMIN-0001",
  "createdAt": "2025-10-19T20:00:00.000Z"
}
```

**Document 4**: `customIdMapping/ADMIN-0001`
```json
{
  "firebaseUid": "YOUR_FIREBASE_AUTH_UID",
  "createdAt": "2025-10-19T20:00:00.000Z"
}
```

---

### 4. Configure Storage Security Rules

**Why**: Allow users to upload profile images and business logos.

**How**:
1. Go to: https://console.firebase.google.com/project/istri-82971/storage/rules
2. Add these rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-images/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid != null;
    }
  }
}
```

3. Click "Publish"

---

## 🟡 Optional but Recommended

### 5. Enable Authentication Methods

1. Go to: https://console.firebase.google.com/project/istri-82971/authentication/providers
2. Enable "Email/Password" if not already enabled
3. (Optional) Enable other methods like Google Sign-In

---

### 6. Set Up Email Templates

Customize the email templates for:
- Email verification
- Password reset
- Email change

Go to: https://console.firebase.google.com/project/istri-82971/authentication/emails

---

### 7. Configure App Check (Production Security)

Protect your Firebase resources from abuse:
1. Go to: https://console.firebase.google.com/project/istri-82971/appcheck
2. Register your web app
3. Enable reCAPTCHA v3

---

## 🧪 Testing Checklist

After completing the required steps, test these flows:

### Customer Flow
- [ ] Sign up as customer (should get CUST-0001 ID)
- [ ] Log in successfully
- [ ] View dashboard (no index errors)
- [ ] Add new address
- [ ] Create new order
- [ ] View order history

### Launderer Flow
- [ ] Sign up as launderer (should get LAUN-0001 ID)
- [ ] Log in successfully
- [ ] Complete business profile
- [ ] View dashboard (no index errors)
- [ ] View assigned orders

### Admin Flow
- [ ] Log in as admin (ADMIN-0001)
- [ ] View admin dashboard
- [ ] See all orders, users, and disputes
- [ ] Assign order to launderer
- [ ] Manage coupons and services

---

## 🚨 Common Issues

### "Database Index Required" Error
- **Cause**: Firestore composite indexes not created
- **Fix**: Complete Step 1 above and wait for indexes to build (2-5 minutes)

### "Permission Denied" Error
- **Cause**: Security rules not deployed or admin not bootstrapped
- **Fix**: Complete Steps 2 and 3 above

### "Invalid Credential" Error
- **Cause**: Incorrect email/password or user doesn't exist
- **Fix**: Try signup first, then login

### Addresses Don't Load
- **Cause**: Subcollection index missing
- **Fix**: Create the `addresses` collection group index (Step 1)

---

## 📚 Documentation Files

- `FIRESTORE_INDEXES_GUIDE.md` - Detailed index creation guide
- `FIRESTORE_RULES.md` - Complete security rules
- `replit.md` - Project architecture and recent changes

---

## 🚀 Ready for Production?

Before going live, ensure:
- [ ] All required indexes created and enabled
- [ ] Security rules deployed and tested
- [ ] Admin user created and tested
- [ ] Storage rules deployed
- [ ] All test flows passing
- [ ] App Check enabled (optional but recommended)
- [ ] Custom domain configured (optional)
- [ ] Email templates customized (optional)

---

## Need Help?

1. Check browser console for specific error codes
2. Review `FIRESTORE_INDEXES_GUIDE.md` for index issues
3. Check Firebase Console for rule validation errors
4. Verify all environment variables are set correctly
