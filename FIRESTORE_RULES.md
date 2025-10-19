# Firestore Security Rules for Custom ID System

## New Collections

The custom ID system introduces three new collections that need security rules:

### 1. counters collection
Stores auto-incrementing counters for generating custom IDs.

### 2. userMapping collection  
Maps Firebase Authentication UIDs to custom user IDs (CUST-0001, LAUN-0001, etc.)

### 3. customIdMapping collection
Reverse mapping from custom IDs back to Firebase UIDs for quick lookups.

## Security Rules to Add

Add these rules to your Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Existing rules for users, orders, etc. need to be updated
    // See complete example below for secure implementation
    
    // Counter for generating custom IDs
    match /counters/{counterId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // User mapping: Firebase UID -> Custom ID
    // SECURITY: Only owner can create their own mapping during signup
    match /userMapping/{firebaseUid} {
      allow read: if request.auth != null && 
                     request.auth.uid == firebaseUid;
      // Only allow creation by the owner
      allow create: if request.auth != null && 
                       request.auth.uid == firebaseUid;
      // Mappings are immutable - no updates or deletes
      allow update, delete: if false;
    }
    
    // Reverse mapping: Custom ID -> Firebase UID
    // SECURITY: Must match Firebase UID creating it
    match /customIdMapping/{customId} {
      allow read: if request.auth != null;
      // Only allow creation with matching Firebase UID
      allow create: if request.auth != null && 
                       request.resource.data.firebaseUid == request.auth.uid;
      // Mappings are immutable - no updates or deletes
      allow update, delete: if false;
    }
  }
}
```

## Important Notes

1. **Before Migration**: Update these security rules in Firebase Console before running the migration tool
2. **After Migration**: Once all users are migrated, you may want to restrict write access to these collections more tightly
3. **Admin Access**: Admins should be able to read all mappings for user management

## Example Complete Rules Structure

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Get custom ID from Firebase UID
    function getCustomId() {
      return get(/databases/$(database)/documents/userMapping/$(request.auth.uid)).data.customId;
    }
    
    // Check if user is admin using custom ID mapping
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(getCustomId())).data.role == 'admin';
    }
    
    // Check if user owns this document by Firebase UID
    function isOwnerByFirebaseUid(firebaseUid) {
      return request.auth != null && request.auth.uid == firebaseUid;
    }
    
    // Check if user owns this document by custom ID
    function isOwnerByCustomId(customId) {
      return request.auth != null && getCustomId() == customId;
    }
    
    // Validate custom ID format matches the role
    function customIdMatchesRole(customId, role) {
      return (role == 'customer' && customId.matches('^CUST-[0-9]{4}$')) ||
             (role == 'launderer' && customId.matches('^LAUN-[0-9]{4}$')) ||
             (role == 'admin' && customId.matches('^ADMIN-[0-9]{4}$'));
    }
    
    // Extract role from custom ID prefix
    function getRoleFromCustomId(customId) {
      return customId.matches('^CUST-.*') ? 'customer' :
             customId.matches('^LAUN-.*') ? 'launderer' :
             customId.matches('^ADMIN-.*') ? 'admin' : null;
    }
    
    // Users collection - now uses custom IDs as document IDs
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow update: if isAuthenticated() && 
                      (isOwnerByCustomId(userId) || isAdmin()) &&
                      // Prevent role changes except by admin
                      (request.resource.data.role == resource.data.role || isAdmin());
      allow delete: if isAdmin();
      // Create is handled during signup
      allow create: if isAuthenticated() && 
                       // Must match Firebase UID
                       request.resource.data.firebaseUid == request.auth.uid &&
                       // Custom ID must match document ID
                       request.resource.data.id == userId &&
                       // Role must match custom ID prefix
                       customIdMatchesRole(userId, request.resource.data.role) &&
                       // Only existing admins can create admin users
                       (request.resource.data.role != 'admin' || isAdmin());
      
      // User addresses subcollection
      match /addresses/{addressId} {
        allow read, write: if isAuthenticated() && 
                             (isOwnerByCustomId(userId) || isAdmin());
      }
    }
    
    // Counters for ID generation
    match /counters/{counterId} {
      allow read: if isAuthenticated();
      // Only allow write during signup/migration - transactions handle concurrency
      allow write: if isAuthenticated();
    }
    
    // User mapping: Firebase UID -> Custom ID
    // CRITICAL: Only the user can create their own mapping during signup
    match /userMapping/{firebaseUid} {
      allow read: if isAuthenticated() && 
                     (isOwnerByFirebaseUid(firebaseUid) || isAdmin());
      // Only allow creation by owner with valid format
      allow create: if isAuthenticated() && 
                       isOwnerByFirebaseUid(firebaseUid) &&
                       // Custom ID must have valid format (CUST/LAUN/ADMIN-####)
                       (request.resource.data.customId.matches('^CUST-[0-9]{4}$') ||
                        request.resource.data.customId.matches('^LAUN-[0-9]{4}$') ||
                        request.resource.data.customId.matches('^ADMIN-[0-9]{4}$')) &&
                       // Only existing admins can create ADMIN-* mappings
                       (!request.resource.data.customId.matches('^ADMIN-.*') || isAdmin());
      // Updates/deletes forbidden (mappings are immutable)
      allow update, delete: if false;
    }
    
    // Reverse mapping: Custom ID -> Firebase UID
    // CRITICAL: Must match the corresponding userMapping entry
    match /customIdMapping/{customId} {
      allow read: if isAuthenticated();
      // Only allow creation with valid format and matching Firebase UID
      allow create: if isAuthenticated() && 
                       request.resource.data.firebaseUid == request.auth.uid &&
                       // Custom ID (doc ID) must have valid format
                       (customId.matches('^CUST-[0-9]{4}$') ||
                        customId.matches('^LAUN-[0-9]{4}$') ||
                        customId.matches('^ADMIN-[0-9]{4}$')) &&
                       // Only existing admins can create ADMIN-* mappings
                       (!customId.matches('^ADMIN-.*') || isAdmin());
      // Updates/deletes forbidden (mappings are immutable)
      allow update, delete: if false;
    }
    
    // Orders - use custom IDs in customerId/laundererId fields
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                       (isOwnerByCustomId(resource.data.customerId) || 
                        isOwnerByCustomId(resource.data.laundererId) ||
                        isAdmin());
      allow delete: if isAdmin();
    }
    
    // Disputes
    match /disputes/{disputeId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                       (isOwnerByCustomId(resource.data.customerId) || 
                        isOwnerByCustomId(resource.data.laundererId) ||
                        isAdmin());
      allow delete: if isAdmin();
    }
    
    // Messages
    match /messages/{messageId} {
      allow read: if isAuthenticated() && 
                     (isOwnerByCustomId(resource.data.senderId) || 
                      isOwnerByCustomId(resource.data.receiverId) ||
                      isAdmin());
      allow create: if isAuthenticated();
      allow update, delete: if isAdmin();
    }
    
    // Services - global, admin managed
    match /services/{serviceId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Coupons - admin managed
    match /coupons/{couponId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // User settings
    match /userSettings/{userId} {
      allow read, write: if isAuthenticated() && 
                           (isOwnerByCustomId(userId) || isAdmin());
    }
  }
}
```

## First Admin Bootstrapping

**IMPORTANT**: Before deploying these security rules, you must create the first admin user manually because the rules prevent users from self-promoting to admin.

### Option 1: Using Firebase Console (Recommended)

1. **Create Firebase Auth user**:
   - Go to Firebase Console → Authentication → Users → Add User
   - Create user with admin email/password
   - Note the Firebase UID (e.g., `abc123xyz...`)

2. **Create counter document** (if doesn't exist):
   - Go to Firestore Database → Start collection: `counters`
   - Document ID: `userIdCounters`
   - Fields: `admin: 0`, `customer: 0`, `launderer: 0`

3. **Create admin user document**:
   - Collection: `users`
   - Document ID: `ADMIN-0001`
   - Fields:
     ```
     id: "ADMIN-0001"
     firebaseUid: "<paste Firebase UID from step 1>"
     role: "admin"
     name: "Admin Name"
     email: "admin@example.com"
     phone: "+1234567890"
     address: "Admin Address"
     pinCode: "12345"
     isActive: true
     ```

4. **Create mapping documents**:
   - Collection: `userMapping`
   - Document ID: `<paste Firebase UID>`
   - Fields: `customId: "ADMIN-0001"`, `createdAt: <current timestamp>`
   
   - Collection: `customIdMapping`
   - Document ID: `ADMIN-0001`
   - Fields: `firebaseUid: "<paste Firebase UID>"`, `createdAt: <current timestamp>`

5. **Update counter**:
   - Edit `counters/userIdCounters`
   - Set `admin: 1`

### Option 2: Using Firebase Admin SDK

```javascript
// Run this once with Firebase Admin SDK
const admin = require('firebase-admin');
admin.initializeApp();

async function createFirstAdmin() {
  const auth = admin.auth();
  const db = admin.firestore();
  
  // Create Firebase Auth user
  const userRecord = await auth.createUser({
    email: 'admin@example.com',
    password: 'securePassword123',
  });
  
  const customId = 'ADMIN-0001';
  
  // Create user document
  await db.collection('users').doc(customId).set({
    id: customId,
    firebaseUid: userRecord.uid,
    role: 'admin',
    name: 'Admin Name',
    email: 'admin@example.com',
    phone: '+1234567890',
    address: 'Admin Address',
    pinCode: '12345',
    isActive: true,
  });
  
  // Create mappings
  await db.collection('userMapping').doc(userRecord.uid).set({
    customId: customId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  await db.collection('customIdMapping').doc(customId).set({
    firebaseUid: userRecord.uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  
  // Update counter
  await db.collection('counters').doc('userIdCounters').set({
    admin: 1,
    customer: 0,
    launderer: 0,
  });
  
  console.log('First admin created successfully!');
}
```

## Migration Workflow

1. **Create First Admin** (if needed) - Use one of the methods above
2. **Update Security Rules** in Firebase Console with the rules from this document
3. **Access Admin Panel** → Login with admin credentials, navigate to `/admin/migration`
4. **Check Status** - View how many users need migration
5. **Run Migration** - Click "Start Migration" button
6. **Verify Results** - Check that all users were migrated successfully
7. **Test Authentication** - Try logging in and creating orders with the new IDs

## Troubleshooting

### "Permission Denied" errors
- Make sure you've updated the Firestore security rules in Firebase Console
- Verify the rules are published (not in draft mode)

### "No custom ID mapping found"
- This is normal for existing users before migration
- Run the migration tool to assign custom IDs to all users

### New signups failing
- Check that counters collection has write permissions
- Verify userMapping and customIdMapping collections allow creation
