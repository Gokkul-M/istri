# Backend Connectivity Testing Guide

## ✅ Current Status

### Firebase Configuration
- **Status**: ✅ Connected
- **Project ID**: istri-82971
- **Environment Variables**: All 6 Firebase credentials configured
- **Authentication**: Email/Password enabled and working

### Application Status
- **Frontend**: ✅ Running on port 5000
- **Routes**: ✅ All routes configured correctly
- **Components**: ✅ Loading without errors

---

## 🔴 Blocking Issues (Must Fix Before Testing)

### 1. Firestore Composite Indexes Missing

**Current Error**: `failed-precondition` 

**Impact**: Users cannot view orders, addresses, or disputes

**Fix**: Create these 5 indexes in Firebase Console

Go to: https://console.firebase.google.com/project/istri-82971/firestore/indexes

| # | Collection | Fields | Order | Status |
|---|------------|--------|-------|--------|
| 1 | orders | customerId + createdAt | Asc + Desc | ❌ Required |
| 2 | orders | laundererId + createdAt | Asc + Desc | ❌ Required |
| 3 | disputes | customerId + createdAt | Asc + Desc | ❌ Required |
| 4 | disputes | laundererId + createdAt | Asc + Desc | ❌ Required |
| 5 | addresses (collection group) | isDefault + createdAt | Desc + Desc | ❌ Required |

**Time to fix**: 5-10 minutes (including index build time)

---

## 🧪 Step-by-Step Testing Plan

### Phase 1: Create Indexes
1. Open Firebase Console indexes page
2. Create all 5 composite indexes (see table above)
3. Wait for all indexes to show green checkmark (not "Building...")
4. Proceed to Phase 2

---

### Phase 2: Authentication Testing

#### Test 2.1: Customer Signup
1. Navigate to: `/signup`
2. Fill in form:
   - Email: `customer@test.com`
   - Password: `Test123456`
   - Role: Customer
3. Click "Create Account"
4. **Expected Result**: 
   - ✅ Redirected to `/customer-setup`
   - ✅ User gets ID: `CUST-0001`
   - ✅ Toast shows "Account created successfully"

#### Test 2.2: Customer Profile Setup
1. Complete profile form with name and phone
2. Click "Complete Setup"
3. **Expected Result**:
   - ✅ Redirected to `/customer` dashboard
   - ✅ No errors in browser console
   - ✅ Profile data saved to Firestore

#### Test 2.3: Customer Dashboard Load
1. Should see customer dashboard
2. **Expected Result**:
   - ✅ No "Database Index Required" error
   - ✅ "No orders yet" message (since new user)
   - ✅ Quick actions visible
   - ✅ No console errors

#### Test 2.4: Customer Logout and Login
1. Click logout (if available in UI)
2. Navigate to `/login`
3. Login with `customer@test.com` / `Test123456`
4. **Expected Result**:
   - ✅ Successfully logged in
   - ✅ Redirected to `/customer`
   - ✅ Same user ID (CUST-0001)

---

### Phase 3: Address Management Testing

#### Test 3.1: Add Address
1. Navigate to `/customer/addresses`
2. Click "Add New Address"
3. Fill form with complete address
4. Save address
5. **Expected Result**:
   - ✅ Address saved to `users/CUST-0001/addresses`
   - ✅ No "failed-precondition" error
   - ✅ Address appears in list

#### Test 3.2: Set Default Address
1. Click "Set as Default" on an address
2. **Expected Result**:
   - ✅ Address marked as default
   - ✅ Other addresses unmarked
   - ✅ No console errors

---

### Phase 4: Order Creation Testing

#### Test 4.1: Create New Order
1. Navigate to `/customer/new-order`
2. Select service (Laundry)
3. Add items
4. Select pickup address
5. Choose schedule
6. Submit order
7. **Expected Result**:
   - ✅ Order created in Firestore `orders` collection
   - ✅ Order gets unique Firebase doc ID
   - ✅ QR code generated
   - ✅ Redirected to order tracking

#### Test 4.2: View Order History
1. Navigate to `/customer/orders`
2. **Expected Result**:
   - ✅ Created order appears in "Active Orders"
   - ✅ No "failed-precondition" error
   - ✅ Order details displayed correctly

---

### Phase 5: Launderer Testing

#### Test 5.1: Launderer Signup
1. Logout from customer account
2. Navigate to `/signup`
3. Create launderer account: `launderer@test.com` / `Test123456`
4. **Expected Result**:
   - ✅ User gets ID: `LAUN-0001`
   - ✅ Redirected to `/launderer-setup`

#### Test 5.2: Business Profile Setup
1. Complete business profile form
2. Upload business logo (optional)
3. **Expected Result**:
   - ✅ Profile saved
   - ✅ Redirected to `/launderer` dashboard

#### Test 5.3: View Orders (Empty State)
1. Check launderer dashboard
2. **Expected Result**:
   - ✅ No "failed-precondition" error
   - ✅ "No orders assigned" message
   - ✅ Dashboard loads without errors

---

### Phase 6: Admin Testing

#### Test 6.1: Create First Admin (Manual)
**Before deploying security rules**, create admin via signup:
1. Navigate to `/signup`
2. Create admin account: `admin@shinecycle.com` / `Admin123456`
3. Select role: Admin
4. **Expected Result**:
   - ✅ User gets ID: `ADMIN-0001`
   - ✅ Account created successfully

**OR** Create admin manually in Firestore (if rules already deployed):
See `SETUP_CHECKLIST.md` Section 3 for manual creation steps

#### Test 6.2: Admin Login
1. Navigate to `/admin/login`
2. Login with admin credentials
3. **Expected Result**:
   - ✅ Successfully logged in
   - ✅ Redirected to `/admin` dashboard
   - ✅ Admin panel loads

#### Test 6.3: View All Orders
1. Navigate to `/admin/orders`
2. **Expected Result**:
   - ✅ See all orders (from all users)
   - ✅ No "failed-precondition" error
   - ✅ Can filter and sort orders

#### Test 6.4: Assign Order to Launderer
1. Find the customer order (CUST-0001's order)
2. Click "Assign Launderer"
3. Select LAUN-0001
4. **Expected Result**:
   - ✅ Order assigned
   - ✅ Order status changes to "confirmed"
   - ✅ Launderer can now see this order

---

### Phase 7: End-to-End Order Flow

#### Test 7.1: Complete Order Lifecycle
1. **Customer**: Create order → Status: "pending"
2. **Admin**: Assign to launderer → Status: "confirmed"
3. **Launderer**: Scan QR code → Status: "picked_up"
4. **Launderer**: Mark in progress → Status: "in_progress"
5. **Launderer**: Mark ready → Status: "ready"
6. **Launderer**: Mark out for delivery → Status: "out_for_delivery"
7. **Launderer**: Complete order → Status: "completed"
8. **Customer**: View completed order and rate

**Expected Result**:
- ✅ Each status change persists in real-time
- ✅ All users see updates immediately
- ✅ QR code verification works
- ✅ Rating can be submitted

---

## 🐛 Common Errors and Solutions

### Error: "Database Index Required"
**Cause**: Composite index not created  
**Fix**: Create the specific index mentioned in the error  
**Verify**: Refresh app after index shows green checkmark

### Error: "Permission Denied"
**Cause**: Firestore security rules not deployed  
**Fix**: Deploy rules from `FIRESTORE_RULES.md`  
**Note**: Create admin BEFORE deploying rules

### Error: "Invalid Credential" on Login
**Cause**: User doesn't exist or wrong password  
**Fix**: Try signup first, then login  
**Verify**: Check Firebase Authentication console for user

### Error: "User profile not found"
**Cause**: User created in Auth but not in Firestore  
**Fix**: Complete signup flow properly  
**Verify**: Check Firestore `users` collection

### Addresses Don't Load
**Cause**: Subcollection index missing  
**Fix**: Create `addresses` collection group index  
**Remember**: Use just "addresses", not full path

### Orders Not Appearing
**Cause**: Missing `customerId + createdAt` index  
**Fix**: Create orders composite index  
**Wait**: 2-5 minutes for index to build

---

## 📊 Backend Connectivity Checklist

Before declaring the app "working":

### Firebase Console Checks
- [ ] All 5 composite indexes created and enabled (green checkmark)
- [ ] Security rules deployed from FIRESTORE_RULES.md
- [ ] Storage rules deployed for profile images
- [ ] Email/Password auth enabled
- [ ] At least one admin user exists

### Application Checks
- [ ] Customer can signup and login
- [ ] Customer can add addresses
- [ ] Customer can create orders
- [ ] Customer can view order history without errors
- [ ] Launderer can signup and login
- [ ] Launderer can view dashboard without errors
- [ ] Admin can login
- [ ] Admin can view all orders
- [ ] Admin can assign orders to launderers

### Real-Time Features
- [ ] Order status updates appear immediately
- [ ] New orders appear in real-time
- [ ] Address changes reflect instantly
- [ ] No console errors during real-time updates

### QR Code Flow
- [ ] QR code displays on order details
- [ ] QR scanner opens on launderer device
- [ ] Scanning updates order status
- [ ] Invalid QR shows error message

---

## 🎯 Success Criteria

The backend is fully connected when:
1. ✅ No "failed-precondition" errors anywhere
2. ✅ All user roles can signup/login
3. ✅ Real-time data sync works
4. ✅ Orders flow through complete lifecycle
5. ✅ QR codes work end-to-end
6. ✅ No permission denied errors
7. ✅ All CRUD operations work
8. ✅ Browser console shows no Firebase errors

---

## 🚀 Next Steps After Testing

Once all tests pass:
1. Deploy security rules (if not done)
2. Set up production environment
3. Configure custom domain
4. Enable App Check for security
5. Set up monitoring and analytics
6. Create backup strategy
7. Document admin procedures

---

## 📞 Support

If you encounter errors not listed here:
1. Check browser console for detailed error
2. Check Firebase Console for quota limits
3. Verify all environment variables are set
4. Review `FIRESTORE_RULES.md` for security rule issues
5. Check `FIRESTORE_INDEXES_GUIDE.md` for index details
