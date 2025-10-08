# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name (e.g., "school-quiz-app")
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Enable Realtime Database

1. In Firebase Console, go to "Realtime Database"
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location
5. Click "Done"

## Step 4: Get Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Web" icon (</>) to add web app
4. Enter app nickname (e.g., "Quiz App")
5. Copy the configuration object

## Step 5: Update firebase-config.js

Replace the configuration in `firebase-config.js` with your actual values:

```javascript
const firebaseConfig = {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    databaseURL: "https://your-project-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-actual-app-id"
};
```

## Step 6: Set Database Rules (Optional - for production)

In Realtime Database, go to "Rules" tab and update:

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
      ".write": "auth != null"
    }
  }
}
```

## Step 7: Test the Application

1. Open the web app
2. Try signing up with a new email
3. Login with the created account
4. Play a quiz and check if scores appear in the global leaderboard
5. Verify data is saved in Firebase Console

## Features Implemented

✅ Email/Password Authentication
✅ Global Leaderboard with Firebase Realtime Database
✅ User Profile Management
✅ Real-time Score Tracking
✅ Responsive Design
✅ Bengali Language Support

## Security Notes

- The current setup uses test mode for development
- For production, implement proper security rules
- Consider adding email verification
- Add password reset functionality if needed

## Troubleshooting

1. **Authentication not working**: Check if Email/Password is enabled in Firebase Console
2. **Database not saving**: Verify database URL and rules
3. **Configuration errors**: Double-check all config values match your Firebase project
4. **CORS issues**: Make sure you're serving the app from a web server, not opening HTML directly

## Next Steps

- Deploy to Firebase Hosting
- Add more authentication providers (Google, Facebook)
- Implement admin panel for quiz management
- Add real-time multiplayer features