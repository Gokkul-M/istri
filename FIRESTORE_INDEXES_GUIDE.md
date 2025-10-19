# Firestore Composite Indexes Required

## ⚠️ CRITICAL: You Need 5 Indexes Total

The app won't work until ALL of these indexes are created in Firebase Console.

---

## How to Create Indexes

### Option 1: Auto-Create from Error Link (Easiest)
1. Open your app and log in
2. When you see the error message, click **"Open Firebase Console"**
3. Firebase will auto-fill the index - just click **"Create"**
4. Wait 2-5 minutes for it to build
5. Refresh your app

### Option 2: Manual Creation
Go to: https://console.firebase.google.com/project/istri-82971/firestore/indexes

---

## Required Indexes List

### 1. Orders - Customer Query
**Collection ID**: `orders`  
**Query Scope**: Collection  
**Fields**:
- `customerId` | Ascending
- `createdAt` | Descending

**Why**: Allows customers to see their orders sorted by date

---

### 2. Orders - Launderer Query
**Collection ID**: `orders`  
**Query Scope**: Collection  
**Fields**:
- `laundererId` | Ascending
- `createdAt` | Descending

**Why**: Allows launderers to see their assigned orders sorted by date

---

### 3. Orders - Admin Query (Single Field)
**Collection ID**: `orders`  
**Query Scope**: Collection  
**Fields**:
- `createdAt` | Descending

**Why**: Allows admins to see all orders sorted by date

**Note**: This is automatically created by Firebase, no manual action needed

---

### 4. Disputes - Customer Query
**Collection ID**: `disputes`  
**Query Scope**: Collection  
**Fields**:
- `customerId` | Ascending
- `createdAt` | Descending

**Why**: Allows customers to see their disputes sorted by date

---

### 5. Disputes - Launderer Query
**Collection ID**: `disputes`  
**Query Scope**: Collection  
**Fields**:
- `laundererId` | Ascending
- `createdAt` | Descending

**Why**: Allows launderers to see disputes related to them

---

### 6. Addresses - Subcollection Index
**Collection ID**: `addresses` (NOT `users/{userId}/addresses`)  
**Query Scope**: **Collection group**  
**Fields**:
- `isDefault` | Descending
- `createdAt` | Descending

**Why**: Allows users to manage their saved addresses

---

## Step-by-Step Creation Process

1. **Go to Firebase Console**:
   - Visit: https://console.firebase.google.com/project/istri-82971/firestore/indexes
   - Make sure you're on the **"Composite"** tab

2. **Create Each Index**:
   - Click **"Create Index"**
   - Fill in Collection ID, Fields, and Order (as listed above)
   - Click **"Create"**
   - **Wait 2-5 minutes** for "Building..." to turn into a green checkmark

3. **Verify All Indexes Are Created**:
   You should see these in your indexes list:
   - ✅ orders: customerId + createdAt
   - ✅ orders: laundererId + createdAt
   - ✅ disputes: customerId + createdAt
   - ✅ disputes: laundererId + createdAt
   - ✅ addresses (collection group): isDefault + createdAt

4. **Refresh Your App**:
   - Once all show green checkmarks (enabled), refresh your app
   - All errors should disappear

---

## Troubleshooting

### "Index is still building"
- Wait a few more minutes
- Building time depends on data volume (usually 2-5 minutes for empty databases)

### "Error still shows after index is created"
- Make sure the index shows a **green checkmark** (not "Building...")
- **Hard refresh** your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check that you created the index with **exact field names and sort orders**

### "Collection ID is reserved" error
- For the addresses index, use just `addresses` (not the full path)
- Make sure to select **"Collection group"** scope

---

## Quick Checklist

Before testing, verify you have:
- [ ] orders: customerId (Asc) + createdAt (Desc)
- [ ] orders: laundererId (Asc) + createdAt (Desc)
- [ ] disputes: customerId (Asc) + createdAt (Desc)
- [ ] disputes: laundererId (Asc) + createdAt (Desc)
- [ ] addresses: isDefault (Desc) + createdAt (Desc) - COLLECTION GROUP scope
- [ ] All indexes show green checkmarks (enabled)
- [ ] App refreshed after all indexes are ready

---

## Still Having Issues?

If you've created all indexes and still see errors:
1. Check browser console for specific error messages
2. Verify you're logged in with the correct Firebase project (istri-82971)
3. Ensure Firebase security rules are deployed (see FIRESTORE_RULES.md)
4. Contact support with the specific error message
