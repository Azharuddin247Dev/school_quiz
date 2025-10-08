# School Quiz App with Firebase Authentication

A comprehensive quiz application with Firebase authentication and global leaderboard system.

## 🚀 New Features

### ✅ Firebase Authentication
- **Email/Password Signup & Login**: Users must create an account to play
- **User Profile Management**: Automatic name and email handling
- **Secure Authentication**: Firebase handles all security aspects

### ✅ Global Leaderboard
- **Real-time Scoring**: All scores saved to Firebase Realtime Database
- **Global Rankings**: See how you compare with other players worldwide
- **Detailed Statistics**: Track performance across different quiz sets
- **No Local Storage**: Removed local scoreboard for global experience

### ✅ Enhanced User Experience
- **Authentication Required**: Must login to access quiz features
- **User Dashboard**: Welcome screen shows authenticated user info
- **Responsive Design**: Works perfectly on mobile and desktop
- **Bengali Language Support**: Full Bengali interface maintained

## 🛠️ Setup Instructions

1. **Clone the repository**
2. **Follow Firebase setup guide** in `FIREBASE_SETUP.md`
3. **Update configuration** in `firebase-config.js`
4. **Deploy or serve locally**

## 📱 How to Use

1. **Visit the app** - You'll see the login screen first
2. **Create Account** - Sign up with email and password (minimum 6 characters)
3. **Login** - Use your credentials to access the app
4. **Play Quiz** - Choose from various quiz types and compete globally
5. **View Leaderboard** - Check your ranking against other players
6. **Logout** - Securely logout when done

## 🎯 Quiz Features

- **Main Quiz**: Bengali questions from various subjects
- **English Puzzle**: Word completion challenges
- **Maths Puzzle**: Multiplication problems
- **Chemistry Quiz**: Chemical symbol identification

## 🔧 Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Authentication**: Firebase Auth
- **Database**: Firebase Realtime Database
- **Styling**: Custom CSS with Bengali font support
- **Responsive**: Mobile-first design approach

## 🔐 Security Features

- Firebase handles all authentication security
- Real-time database with proper access rules
- No sensitive data stored locally
- Secure user session management

## 📊 Data Structure

### Users Collection
```javascript
{
  "users": {
    "userId": {
      "name": "User Name",
      "email": "user@example.com",
      "totalScore": 150,
      "gamesPlayed": 5,
      "createdAt": timestamp,
      "lastPlayed": timestamp
    }
  }
}
```

### Leaderboard Collection
```javascript
{
  "leaderboard": {
    "scoreId": {
      "userId": "user123",
      "userName": "Player Name",
      "score": 18,
      "totalQuestions": 20,
      "percentage": 90,
      "setIndex": 0,
      "timestamp": timestamp,
      "date": "১৫/১২/২০২৪",
      "time": "১০:৩০:২৫"
    }
  }
}
```

## 🌟 Key Improvements

1. **Authentication First**: No anonymous play - builds user community
2. **Global Competition**: Players compete worldwide, not just locally
3. **Data Persistence**: Scores saved permanently in cloud
4. **User Profiles**: Track individual progress and statistics
5. **Real-time Updates**: Leaderboard updates instantly
6. **Mobile Optimized**: Perfect experience on all devices

## 📝 Credits

**Created by**: Azharuddin Sir  
**Enhanced with**: Firebase Authentication & Global Leaderboard  
**Language**: Bengali (বাংলা) with English support  
**Target Audience**: Students (Classes 5-8)

This quiz app now provides a complete learning platform with user accounts, global competition, and comprehensive progress tracking!