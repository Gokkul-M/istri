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
    
    // Existing rules for users, orders, etc. remain the same
    
    // Counter for generating custom IDs
    // Only authenticated users can read, only system can write
    match /counters/{counterId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Needed for ID generation during signup
    }
    
    // User mapping: Firebase UID -> Custom ID
    // Users can only read their own mapping
    match /userMapping/{firebaseUid} {
      allow read: if request.auth != null && request.auth.uid == firebaseUid;
      allow write: if request.auth != null && request.auth.uid == firebaseUid; // Needed during signup
      allow create: if request.auth != null; // Allow creation during signup
    }
    
    // Reverse mapping: Custom ID -> Firebase UID
    // Users can read mappings to resolve custom IDs
    match /customIdMapping/{customId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null; // Needed during signup
      allow create: if request.auth != null; // Allow creation during signup
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
    
    function isAdmin() {
      return isAuthenticated() && 
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Users collection - now uses custom IDs as document IDs
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated() && 
                     (request.auth.uid == resource.data.firebaseUid || isAdmin());
      allow create: if isAuthenticated();
    }
    
    // Counters for ID generation
    match /counters/{counterId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // User mapping collections
    match /userMapping/{firebaseUid} {
      allow read: if isAuthenticated() && 
                     (request.auth.uid == firebaseUid || isAdmin());
      allow write: if isAuthenticated() && request.auth.uid == firebaseUid;
      allow create: if isAuthenticated();
    }
    
    match /customIdMapping/{customId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
      allow create: if isAuthenticated();
    }
    
    // Orders - already use custom IDs in customerId/laundererId fields
    match /orders/{orderId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && 
                       (resource.data.customerId == request.auth.uid || 
                        resource.data.laundererId == request.auth.uid ||
                        isAdmin());
    }
    
    // Other collections remain the same...
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
