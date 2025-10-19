# Real-Time Updates Documentation

## Overview

ShineCycle uses Firebase Firestore's real-time listeners (`onSnapshot`) to ensure all CRUD operations (Create, Read, Update, Delete) reflect **instantly** across all pages without requiring manual refresh.

---

## How It Works

### Real-Time Listeners

Firebase Firestore provides real-time synchronization through `onSnapshot()` listeners. When data changes in the database:

1. **Instant Detection**: Firebase detects the change immediately
2. **Push Notification**: Firebase pushes the update to all active listeners
3. **Automatic Re-render**: React components automatically re-render with new data
4. **No Refresh Needed**: Users see changes instantly without page reload

---

## Real-Time Features by Collection

### 📍 Addresses (Subcollection)

**Hook**: `useAddresses()`  
**File**: `src/hooks/useAddresses.ts`  
**Listener**: `firestoreService.onAddressesChange()`

**Operations**:
- ✅ **Create**: New address appears instantly in all pages
- ✅ **Update**: Address changes reflect immediately
- ✅ **Delete**: Deleted address disappears instantly
- ✅ **Set Default**: Default badge updates in real-time

**Pages Affected**:
1. **AddressManagement** (`/customer/addresses`)
   - Address list updates instantly
   - Default badge changes in real-time
   - Delete operations reflect immediately

2. **NewOrder** (`/customer/new-order`)
   - Pickup address dropdown updates automatically
   - New addresses appear immediately in selection
   - Deleted addresses removed instantly
   - **Auto-selects default address** on page load
   - If default address changes elsewhere, selection doesn't change (preserves user choice)

3. **Profile/Settings** (Any page using addresses)
   - All address-related components update in real-time

**Technical Details**:
```typescript
// Real-time listener setup
onAddressesChange(userId: string, callback: (addresses: Address[]) => void) {
  const q = query(
    collection(db, 'users', userId, 'addresses'),
    orderBy('isDefault', 'desc'),  // Default addresses first
    orderBy('createdAt', 'desc')    // Newest first
  );
  return onSnapshot(q, (snapshot) => {
    const addresses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(addresses);  // Triggers React re-render
  });
}
```

**Performance**:
- Sorted query: Default addresses always appear first
- Optimized: Only listens when user is authenticated
- Cleanup: Unsubscribes when component unmounts
- No memory leaks: Proper listener cleanup on unmount

---

### 📦 Orders

**Hook**: `useFirebaseOrders()`  
**File**: `src/hooks/useFirebaseOrders.ts`  
**Listener**: `onSnapshot()` with query filters

**Operations**:
- ✅ **Create**: New order appears instantly in all views
- ✅ **Update**: Status changes reflect immediately (pending → confirmed → in_progress → completed)
- ✅ **Assign Launderer**: Assignment updates in real-time
- ✅ **Delete**: Removed orders disappear instantly

**Pages Affected**:
1. **CustomerDashboard** (`/customer`)
   - Active orders section updates in real-time
   - Total orders count changes instantly
   - Total spent recalculates immediately

2. **OrderHistory** (`/customer/orders`)
   - Active orders tab updates instantly
   - History tab shows completed orders in real-time
   - Order status badges change immediately

3. **OrderDetails** (`/customer/order/:orderId`)
   - Status timeline updates in real-time
   - Launderer assignment appears instantly
   - All order fields reflect changes immediately

4. **LaundererDashboard** (`/launderer`)
   - New assigned orders appear instantly
   - Status updates from other users reflect immediately
   - Order list stays synchronized

5. **AdminDashboard** (`/admin`)
   - All orders from all users update in real-time
   - Assignment operations reflect instantly
   - Order management changes appear immediately

**Technical Details**:
```typescript
// Different queries for different user roles
if (user.role === 'customer') {
  query(
    collection(db, 'orders'),
    where('customerId', '==', user.id),  // Only user's orders
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
} else if (user.role === 'launderer') {
  query(
    collection(db, 'orders'),
    where('laundererId', '==', user.id),  // Only assigned orders
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
} else if (user.role === 'admin') {
  query(
    collection(db, 'orders'),
    orderBy('createdAt', 'desc'),  // All orders
    limit(limitCount)
  );
}
```

**Performance**:
- Role-based queries: Only fetches relevant orders
- Limit applied: Prevents loading too many orders at once
- Indexed queries: Requires composite indexes for performance
- Retry logic: 1 automatic retry on errors

---

### 🎫 Coupons

**Hook**: `useFirebaseCoupons()`  
**File**: `src/hooks/useFirebaseCoupons.ts`  
**Listener**: `onSnapshot()` with active filter

**Operations**:
- ✅ **Create**: New coupons appear instantly
- ✅ **Update**: Active/inactive status changes in real-time
- ✅ **Delete**: Removed coupons disappear instantly
- ✅ **Usage Count**: Increments reflect immediately

**Pages Affected**:
1. **NewOrder** (`/customer/new-order`)
   - Available coupons update in real-time
   - Active/inactive status reflects instantly
   - Usage limits update immediately

2. **Offers** (`/customer/offers`)
   - Coupon list updates in real-time
   - New promotions appear instantly

3. **AdminDashboard** (`/admin/coupons`)
   - All coupon management operations reflect immediately
   - Usage statistics update in real-time

---

### 🛠️ Services

**Hook**: `useFirebaseServices()`  
**File**: `src/hooks/useFirebaseServices.ts`  
**Listener**: `onSnapshot()` on services collection

**Operations**:
- ✅ **Create**: New services appear instantly
- ✅ **Update**: Price/description changes reflect immediately
- ✅ **Delete**: Removed services disappear instantly
- ✅ **Availability**: Status changes in real-time

**Pages Affected**:
1. **NewOrder** (`/customer/new-order`)
   - Service selection updates in real-time
   - Price changes reflect immediately
   - New services appear instantly

2. **AdminDashboard** (`/admin/services`)
   - All service management operations reflect immediately
   - Global service changes synchronized

---

### 🎯 Disputes

**Hook**: `useFirebaseDisputes()`  
**File**: `src/hooks/useFirebaseDisputes.ts`  
**Listener**: `onSnapshot()` with role-based filters

**Operations**:
- ✅ **Create**: New disputes appear instantly
- ✅ **Update**: Status/response changes reflect immediately
- ✅ **Resolve**: Resolution updates in real-time

**Pages Affected**:
1. **Customer/Launderer Dispute Pages**
   - New disputes appear instantly
   - Admin responses update in real-time
   - Status changes reflect immediately

2. **AdminDashboard** (`/admin/disputes`)
   - All disputes update in real-time
   - Response updates reflect instantly

---

## User Experience

### Instant Feedback

Users see changes **immediately** when:

1. **Creating an Address**:
   - User clicks "Add Address" in AddressManagement
   - Address saved to Firestore
   - **Instantly** appears in address list
   - **Immediately** available in NewOrder pickup selection
   - No page refresh needed

2. **Updating an Order**:
   - Launderer updates order status
   - Customer sees status change **instantly** on OrderDetails page
   - Status badge updates in **real-time** on OrderHistory page
   - Dashboard reflects change **immediately**

3. **Setting Default Address**:
   - User clicks "Set as Default"
   - Old default loses badge **instantly**
   - New default gains badge **immediately**
   - NewOrder page sees change **in real-time**

### Auto-Selection Features

**NewOrder Page Address Selection**:
- On page load, **automatically selects** default address
- If no default, selects first address
- If user manually changes selection, respects their choice
- If addresses update (new/deleted), selection stays unless selected address is deleted

---

## Performance Optimizations

### 1. Conditional Listeners
Listeners only activate when:
- User is authenticated
- User has appropriate role
- Component is mounted

### 2. Automatic Cleanup
All listeners are cleaned up when:
- Component unmounts
- User logs out
- Route changes

### 3. Error Recovery
- Automatic retry (1 attempt) on listener errors
- Graceful degradation on permission errors
- Clear error messages with actionable guidance

### 4. Query Optimization
- Indexed queries for fast performance
- Limited result sets (default: 50 items)
- Sorted by relevant fields (createdAt, isDefault)
- Role-based filtering to reduce data transfer

---

## Testing Real-Time Updates

### Address Updates Test

1. **Open Two Browser Windows**:
   - Window A: `/customer/addresses`
   - Window B: `/customer/new-order`

2. **Add Address in Window A**:
   - Click "Add New Address"
   - Fill form and save
   - **Observe**: Address appears instantly in both windows

3. **Set Default in Window A**:
   - Click "Set as Default" on any address
   - **Observe**: Badge changes instantly in both windows

4. **Delete Address in Window A**:
   - Delete an address
   - **Observe**: Removed instantly from both windows

### Order Updates Test

1. **Open Three Browser Windows**:
   - Window A: Customer dashboard
   - Window B: Launderer dashboard
   - Window C: Admin dashboard

2. **Create Order as Customer** (Window A):
   - Create new order
   - **Observe**: Order appears instantly in Window A
   - **Observe**: Order appears in Window C (admin view)

3. **Assign Launderer as Admin** (Window C):
   - Assign order to launderer
   - **Observe**: Order appears instantly in Window B (launderer)
   - **Observe**: Assignment reflects in Window A (customer)

4. **Update Status as Launderer** (Window B):
   - Change status to "in_progress"
   - **Observe**: Status updates instantly in Windows A and C

---

## Troubleshooting

### Updates Not Appearing

**Issue**: Changes don't appear in real-time

**Possible Causes**:
1. **Firestore indexes missing**: Create required composite indexes
2. **Permission denied**: Check Firestore security rules
3. **User not authenticated**: Ensure user is logged in
4. **Network issues**: Check internet connection

**Solutions**:
1. Create all required Firestore indexes (see `FIRESTORE_INDEXES_GUIDE.md`)
2. Deploy Firestore security rules from `FIRESTORE_RULES.md`
3. Verify user authentication status
4. Check browser console for errors

### Delayed Updates

**Issue**: Updates appear but with delay (>1 second)

**Possible Causes**:
1. **Slow network**: Network latency affecting Firebase sync
2. **Large datasets**: Too many documents without proper limits
3. **Missing indexes**: Queries running without indexes

**Solutions**:
1. Check network connection
2. Reduce query limits or add pagination
3. Ensure all composite indexes are created and enabled

### Duplicate Items Appearing

**Issue**: Same item appears multiple times

**Possible Causes**:
1. **Multiple listeners**: Component mounting multiple times
2. **Missing cleanup**: Listeners not unsubscribed
3. **React strict mode**: Development mode double-rendering

**Solutions**:
1. Check component mounting behavior
2. Verify `useEffect` cleanup functions
3. This is normal in development, won't happen in production

---

## Developer Notes

### Adding New Real-Time Features

To add real-time updates to a new feature:

1. **Create Firestore Listener**:
```typescript
onMyDataChange(userId: string, callback: (data: MyData[]) => void) {
  const q = query(
    collection(db, 'myCollection'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });
}
```

2. **Create Custom Hook**:
```typescript
export function useMyData() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const unsubscribe = firestoreService.onMyDataChange(
      user.id,
      (updatedData) => {
        setData(updatedData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.id]);

  return { data, loading };
}
```

3. **Use in Component**:
```typescript
const MyComponent = () => {
  const { data, loading } = useMyData();
  
  return (
    <div>
      {loading ? <Skeleton /> : data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
};
```

4. **Create Required Indexes**:
- Go to Firebase Console → Firestore → Indexes
- Create composite index if query uses multiple fields
- Wait for index to build (green checkmark)

---

## Summary

✅ **Addresses**: Update instantly across AddressManagement and NewOrder pages  
✅ **Orders**: Real-time synchronization across all user roles  
✅ **Coupons**: Instant availability updates  
✅ **Services**: Real-time price and availability changes  
✅ **Disputes**: Immediate status and response updates  

**Performance**: Optimized with indexes, limits, and cleanup  
**Reliability**: Automatic retry and error recovery  
**User Experience**: No manual refresh needed, instant feedback  

All CRUD operations reflect **instantly** without page reload!
