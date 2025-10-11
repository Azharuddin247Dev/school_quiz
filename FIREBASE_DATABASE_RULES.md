# Firebase Database Rules Setup

## 🔥 Required Firebase Database Rules

Your Firebase Realtime Database needs proper rules to work. Go to Firebase Console and set these rules:

### 1. **Firebase Console Steps:**
1. Go to https://console.firebase.google.com/
2. Select your project: `school-quiz-da3ff`
3. Click "Realtime Database" in left menu
4. Click "Rules" tab
5. Replace the rules with the code below

### 2. **Database Rules (Copy & Paste):**

```json
{
  "rules": {
    "users": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "leaderboard": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["percentage", "userId", "timestamp"],
      "$scoreId": {
        ".validate": "newData.hasChildren(['userId', 'userName', 'score', 'percentage', 'timestamp'])"
      }
    },
    "onlineUsers": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$uid": {
        ".validate": "newData.hasChildren(['name', 'timestamp', 'status'])"
      }
    },
    "challengeRequests": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["to", "from", "status"]
    },
    "activeBattles": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "battleResults": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["player", "timestamp", "challengeId"]
    },
    "gameChallenge": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["to", "from", "status"],
      "$challengeId": {
        ".validate": "newData.hasChildren(['from', 'to', 'gameType', 'status', 'timestamp'])"
      }
    }
  }
}
```

### 3. **Authentication Setup:**
1. Go to "Authentication" in Firebase Console
2. Click "Sign-in method" tab
3. Enable "Email/Password" provider
4. Click "Save"

### 4. **Test Connection:**
After setting up rules, your app should:
- ✅ Allow user signup/login
- ✅ Save scores to database
- ✅ Show global leaderboard
- ✅ Maintain login sessions

### 5. **Common Issues:**
- **Permission denied**: Check database rules
- **Auth not working**: Enable Email/Password in Authentication
- **Connection failed**: Check internet connection
- **Invalid project**: Verify project ID in firebase-config.js

## 🎯 Expected Behavior:
Once properly configured, your app will have real-time Firebase functionality with global leaderboards and user authentication.