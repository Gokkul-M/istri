# 🔥 Firebase Firestore Indexes Setup

## ⚠️ IMPORTANT: Required Indexes

Your app uses Firestore queries that require **composite indexes**. Without these, you'll get errors like:
```
Error opening workspace: Request contains an invalid argument
FirebaseError: The query requires an index
```

## 🚀 Quick Fix - Auto-Create Indexes

The **easiest way** is to let Firebase create the indexes automatically:

### Method 1: Click the Error Links (Recommended)

1. **Open your browser console** (F12 or Right-click → Inspect)
2. Look for errors that say: `The query requires an index. You can create it here:`
3. **Click the provided link** - it will take you directly to Firebase Console with the index pre-configured
4. Click **"Create Index"**
5. Wait 1-2 minutes for the index to build
6. Refresh your app

### Method 2: Use These Direct Links

Click these links to create indexes automatically:

#### For Orders (Customer View)
```
https://console.firebase.google.com/v1/r/project/istri-82971/firestore/indexes?create_composite=Ckpwcm9qZWN0cy9pc3RyaS04Mjk3MS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb3JkZXJzL2luZGV4ZXMvXxABGg4KCmN1c3RvbWVySWQQARoNCgljcmVhdGVkQXQQAhoMCghfX25hbWVfXxAC
```

#### For Orders (Launderer View)
Create manually (see instructions below) with:
- Collection: `orders`
- Fields: `laundererId` (Ascending), `createdAt` (Descending)

#### For Addresses (if needed)
```
https://console.firebase.google.com/v1/r/project/istri-82971/firestore/indexes?create_composite=Ck1wcm9qZWN0cy9pc3RyaS04Mjk3MS9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvYWRkcmVzc2VzL2luZGV4ZXMvXxABGg0KCWlzRGVmYXVsdBACGg0KCWNyZWF0ZWRBdBACGgwKCF9fbmFtZV9fEAI
```

---

## 🔧 Manual Index Creation

If the links don't work, create indexes manually:

### Step 1: Go to Firebase Console

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **istri-82971**
3. Go to **Firestore Database**
4. Click on the **Indexes** tab

### Step 2: Create Required Indexes

#### Index 1: Orders by Customer ID
- Click **"Create Index"**
- Collection ID: `orders`
- Add fields:
  1. Field: `customerId` | Order: **Ascending**
  2. Field: `createdAt` | Order: **Descending**
- Query scope: **Collection**
- Click **Create**

#### Index 2: Orders by Launderer ID
- Click **"Create Index"**
- Collection ID: `orders`
- Add fields:
  1. Field: `laundererId` | Order: **Ascending**
  2. Field: `createdAt` | Order: **Descending**
- Query scope: **Collection**
- Click **Create**

#### Index 3: Addresses by User (Optional - if using addresses)
- Click **"Create Index"**
- Collection ID: `addresses`
- Add fields:
  1. Field: `isDefault` | Order: **Ascending**
  2. Field: `createdAt` | Order: **Ascending**
- Query scope: **Collection group**
- Click **Create**

### Step 3: Wait for Index Build

- Indexes take **1-2 minutes** to build
- Status will show "Building..." then "Enabled"
- Once all show "Enabled", refresh your app

---

## ✅ Verification

After creating the indexes:

1. **Refresh your app** (Ctrl+R or Cmd+R)
2. **Check browser console** - errors should be gone
3. **Test the features**:
   - Customer dashboard should load orders
   - Order history should display
   - No "invalid argument" errors

---

## 📋 Index Summary

Here's what each index does:

| Collection | Fields | Purpose |
|------------|--------|---------|
| `orders` | `customerId` + `createdAt` | Load customer's orders sorted by date |
| `orders` | `laundererId` + `createdAt` | Load launderer's orders sorted by date |
| `addresses` | `isDefault` + `createdAt` | Find default address efficiently |

---

## 🐛 Troubleshooting

### Issue: Index creation fails
**Solution:** Make sure you have the correct permissions (Owner or Editor role) in Firebase

### Issue: "Index already exists"
**Solution:** That's fine! The index is already created. Just wait for it to finish building.

### Issue: Still getting errors after creating indexes
**Solution:**
1. Wait 2-3 minutes for indexes to fully propagate
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache and reload

### Issue: Don't see the Indexes tab
**Solution:** Make sure you're in **Firestore Database** (not Realtime Database)

---

## 🎯 Quick Checklist

- [ ] Created index for `orders` with `customerId` + `createdAt`
- [ ] Created index for `orders` with `laundererId` + `createdAt`
- [ ] Waited 1-2 minutes for indexes to build
- [ ] All indexes show "Enabled" status
- [ ] Refreshed the application
- [ ] Verified no console errors

---

## 💡 Pro Tips

1. **Always use the error links** - Firebase provides direct links in error messages
2. **Check index status** - Green checkmark = ready to use
3. **Plan queries first** - Design your queries, then create indexes
4. **Use composite indexes** - Only for queries with multiple conditions
5. **Monitor performance** - Check the Firebase Console's Usage tab

---

## 📚 Additional Resources

- [Firestore Index Documentation](https://firebase.google.com/docs/firestore/query-data/indexing)
- [Understanding Composite Indexes](https://firebase.google.com/docs/firestore/query-data/index-overview)
- [Index Best Practices](https://firebase.google.com/docs/firestore/best-practices)

---

## 🚨 Important Notes

⚠️ **Your app WILL NOT work properly without these indexes!**

The queries in `useFirebaseOrders.ts` use:
- `where('customerId', '==', userId)` + `orderBy('createdAt', 'desc')` → Requires Index
- `where('laundererId', '==', userId)` + `orderBy('createdAt', 'desc')` → Requires Index

These are **not optional** - they are **required** for the app to function.

✅ Once you create these indexes, the "Request contains an invalid argument" error will be fixed!
