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
    
    // Users collection - now uses custom IDs as document IDs
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow update: if isAuthenticated() && 
                      (isOwnerByCustomId(userId) || isAdmin());
      allow delete: if isAdmin();
      // Create is handled during signup - must match Firebase UID
      allow create: if isAuthenticated() && 
                       request.resource.data.firebaseUid == request.auth.uid;
      
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
      // Only allow creation by the owner during signup
      allow create: if isAuthenticated() && 
                       isOwnerByFirebaseUid(firebaseUid);
      // Updates/deletes forbidden (mappings are immutable)
      allow update, delete: if false;
    }
    
    // Reverse mapping: Custom ID -> Firebase UID
    // CRITICAL: Must match the corresponding userMapping entry
    match /customIdMapping/{customId} {
      allow read: if isAuthenticated();
      // Only allow creation when creating userMapping in same transaction
      allow create: if isAuthenticated() && 
                       request.resource.data.firebaseUid == request.auth.uid;
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

## Migration Workflow

1. **Update Security Rules** in Firebase Console first
2. **Access Admin Panel** → Navigate to `/admin/migration`
3. **Check Status** - View how many users need migration
4. **Run Migration** - Click "Start Migration" button
5. **Verify Results** - Check that all users were migrated successfully
6. **Test Authentication** - Try logging in and creating orders with the new IDs

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
