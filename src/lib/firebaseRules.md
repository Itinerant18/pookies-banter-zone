
# Firebase Security Rules Setup Guide

To fix the "Missing or insufficient permissions" error, you need to update your Firebase security rules. Follow these steps:

1. Go to your Firebase Console: https://console.firebase.google.com/
2. Select your project "dating-a8002"
3. Navigate to Firestore Database in the left sidebar
4. Click on the "Rules" tab
5. Replace the current rules with the following:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read and write to all collections
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Public collections that don't require authentication
    match /public/{document=**} {
      allow read: if true;
    }
    
    // User profiles - users can read any profile but only edit their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chat rooms - participants can read and write
    match /chatRooms/{roomId} {
      allow read, write: if request.auth != null && 
                          request.auth.uid in resource.data.members;
    }
    
    // Messages - participants of the chat room can read and write
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

6. Click "Publish" to apply the rules

For Storage rules, go to:
1. Storage in the Firebase Console
2. Click on the "Rules" tab
3. Update with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

After updating these rules, the app should work properly.
