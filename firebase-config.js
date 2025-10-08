// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAblJR7rl9Br5xptD2QH_-7SVz5OgL3_kM",
  authDomain: "school-quiz-da3ff.firebaseapp.com",
  databaseURL: "https://school-quiz-da3ff-default-rtdb.firebaseio.com",
  projectId: "school-quiz-da3ff",
  storageBucket: "school-quiz-da3ff.firebasestorage.app",
  messagingSenderId: "979192541691",
  appId: "1:979192541691:web:d192a6db3bf4fc88a21b5e",
  measurementId: "G-0MYQXMDZ2X"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const database = firebase.database();

// Global variables for user management
let currentUser = null;
let isAuthenticated = false;