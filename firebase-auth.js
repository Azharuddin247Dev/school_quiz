// Firebase Authentication System
// Variables declared in firebase-config.js
if (typeof studentName === 'undefined') {
    var studentName = '';
}

// Authentication state observer (with error handling)
try {
    auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        isAuthenticated = true;
        studentName = user.displayName || user.email.split('@')[0];
        updateUserUI();
        
        // Load user progress
        loadUserProgress();
        
        // Show welcome screen if on auth screen
        if (document.getElementById('auth-screen').style.display !== 'none') {
            const screens = ['auth-screen', 'start-screen', 'quiz-screen', 'result-screen', 'answer-screen', 'english-screen', 'maths-screen', 'chemistry-screen'];
            screens.forEach(id => {
                const element = document.getElementById(id);
                if (element) element.style.display = 'none';
            });
            document.getElementById('welcome-screen').style.display = 'block';
        }
        
        // Update user data in database
        updateUserData(user);
    } else {
        currentUser = null;
        isAuthenticated = false;
        studentName = '';
        updateUserUI();
        if (typeof showAuthScreen === 'function') {
            showAuthScreen();
        } else {
            showAuthScreenFallback();
        }
    }
    });
} catch (error) {
    console.error('Firebase auth error:', error);
    // Show auth screen as fallback
    setTimeout(() => {
        if (typeof showAuthScreen === 'function') {
            showAuthScreen();
        } else {
            showAuthScreenFallback();
        }
    }, 1000);
}

// Enhanced auth screen function (fallback version)
function showAuthScreenFallback() {
    const screens = ['welcome-screen', 'start-screen', 'quiz-screen', 'result-screen', 'answer-screen', 'english-screen', 'maths-screen', 'chemistry-screen'];
    screens.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.style.display = 'none';
    });
    document.getElementById('auth-screen').style.display = 'block';
}

// Auth form functions are defined in HTML head section

// Firebase signup
async function signUp() {
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const name = document.getElementById('signup-name').value.trim();
    
    if (!email || !password || !name) {
        showMessage('সব ফিল্ড পূরণ করুন!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showMessage('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!', 'error');
        return;
    }
    
    // Check if Firebase is loaded
    if (typeof auth === 'undefined' || typeof database === 'undefined') {
        showMessage('Firebase লোড হচ্ছে... আবার চেষ্টা করুন।', 'error');
        return;
    }
    
    try {
        console.log('Attempting signup with:', email);
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        console.log('Signup successful:', userCredential.user.email);
        
        await userCredential.user.updateProfile({ displayName: name });
        
        // Save user data to database
        await database.ref('users/' + userCredential.user.uid).set({
            name: name,
            email: email,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            totalScore: 0,
            gamesPlayed: 0
        });
        
        showMessage('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
    } catch (error) {
        console.error('Signup error:', error);
        showMessage(getErrorMessage(error.code), 'error');
    }
}

// Firebase signin
async function signIn() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showMessage('ইমেইল ও পাসওয়ার্ড দিন!', 'error');
        return;
    }
    
    // Check if Firebase is loaded
    if (typeof auth === 'undefined') {
        showMessage('Firebase লোড হচ্ছে... আবার চেষ্টা করুন।', 'error');
        return;
    }
    
    try {
        console.log('Attempting login with:', email);
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        console.log('Login successful:', userCredential.user.email);
        showMessage('সফলভাবে লগইন হয়েছে!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showMessage(getErrorMessage(error.code), 'error');
    }
}

// Sign out
async function signOut() {
    try {
        await auth.signOut();
        showMessage('সফলভাবে লগআউট হয়েছে!', 'success');
    } catch (error) {
        showMessage('লগআউট করতে সমস্যা হয়েছে!', 'error');
    }
}

// Update user data in database
async function updateUserData(user) {
    try {
        const userRef = database.ref('users/' + user.uid);
        await userRef.update({
            lastLogin: firebase.database.ServerValue.TIMESTAMP,
            name: user.displayName || user.email.split('@')[0],
            email: user.email
        });
    } catch (error) {
        console.error('Error updating user data:', error);
    }
}

// Update UI based on auth state
function updateUserUI() {
    const userInfo = document.getElementById('user-info');
    const authButton = document.getElementById('auth-button');
    
    if (isAuthenticated && currentUser) {
        const displayName = currentUser.displayName || currentUser.email.split('@')[0];
        userInfo.innerHTML = `<span class="user-name">স্বাগতম, ${displayName}!</span>`;
        authButton.innerHTML = '<span onclick="signOut()">লগআউট</span>';
    } else {
        userInfo.innerHTML = '';
        authButton.innerHTML = '<span onclick="showAuthScreen()">লগইন</span>';
    }
}

// Save score to Firebase
async function saveScoreToLeaderboard(score, totalQuestions, setIndex) {
    if (!isAuthenticated || !currentUser) {
        showMessage('স্কোর সেভ করতে লগইন করুন!', 'error');
        return;
    }
    
    const percentage = Math.round((score / totalQuestions) * 100);
    const now = new Date();
    const finalScore = (typeof challengeMode !== 'undefined' && challengeMode) ? score * (challengeMultiplier || 1) : score;
    
    const scoreData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email.split('@')[0],
        score: finalScore,
        originalScore: score,
        totalQuestions: totalQuestions,
        percentage: percentage,
        setIndex: setIndex,
        challengeMode: challengeMode || null,
        multiplier: challengeMultiplier || 1,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        date: now.toLocaleDateString('bn-BD'),
        time: now.toLocaleTimeString('bn-BD')
    };
    
    try {
        // Save to leaderboard
        await database.ref('leaderboard').push(scoreData);
        
        // Update user stats
        const userRef = database.ref('users/' + currentUser.uid);
        const userSnapshot = await userRef.once('value');
        const userData = userSnapshot.val() || {};
        
        await userRef.update({
            totalScore: (userData.totalScore || 0) + finalScore,
            gamesPlayed: (userData.gamesPlayed || 0) + 1,
            lastPlayed: firebase.database.ServerValue.TIMESTAMP
        });
        
        if (typeof challengeMode !== 'undefined' && challengeMode) {
            showMessage(`চ্যালেঞ্জ সম্পন্ন! ${challengeMultiplier || 1}x পয়েন্ট পেয়েছেন!`, 'success');
        } else {
            showMessage('স্কোর সেভ হয়েছে!', 'success');
        }
    } catch (error) {
        console.error('Error saving score:', error);
        showMessage('স্কোর সেভ করতে সমস্যা হয়েছে!', 'error');
    }
}

// Show global leaderboard
async function showGlobalLeaderboard() {
    if (!isAuthenticated) {
        showMessage('লিডারবোর্ড দেখতে লগইন করুন!', 'error');
        return;
    }
    
    try {
        const snapshot = await database.ref('leaderboard').orderByChild('percentage').limitToLast(50).once('value');
        const scores = [];
        
        snapshot.forEach((childSnapshot) => {
            scores.push(childSnapshot.val());
        });
        
        // Sort by percentage (desc) then by timestamp (desc)
        scores.sort((a, b) => {
            if (b.percentage !== a.percentage) {
                return b.percentage - a.percentage;
            }
            return b.timestamp - a.timestamp;
        });
        
        showLeaderboardPopup('🏆 গ্লোবাল লিডারবোর্ড', scores);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        showMessage('লিডারবোর্ড লোড করতে সমস্যা হয়েছে!', 'error');
    }
}

// Show user profile
async function showProfile() {
    if (!isAuthenticated) {
        showMessage('প্রোফাইল দেখতে লগইন করুন!', 'error');
        return;
    }
    
    try {
        const userSnapshot = await database.ref('users/' + currentUser.uid).once('value');
        const userData = userSnapshot.val() || {};
        
        const profileData = {
            name: currentUser.displayName || currentUser.email.split('@')[0],
            email: currentUser.email,
            totalScore: userData.totalScore || 0,
            gamesPlayed: userData.gamesPlayed || 0,
            averageScore: userData.gamesPlayed ? Math.round((userData.totalScore || 0) / userData.gamesPlayed) : 0,
            joinDate: userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('bn-BD') : 'N/A'
        };
        
        showProfilePopup(profileData);
    } catch (error) {
        console.error('Error fetching profile:', error);
        showMessage('প্রোফাইল লোড করতে সমস্যা হয়েছে!', 'error');
    }
}

// Show profile popup
function showProfilePopup(profileData) {
    const existingPopup = document.getElementById('profile-popup');
    if (existingPopup) existingPopup.remove();
    
    const popup = document.createElement('div');
    popup.id = 'profile-popup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content profile-content">
                <div class="popup-header">
                    <h3>👤 ব্যবহারকারী প্রোফাইল</h3>
                    <button class="popup-close">×</button>
                </div>
                <div class="popup-body">
                    <div class="profile-info">
                        <div class="profile-item">
                            <span class="profile-label">নাম:</span>
                            <span class="profile-value">${profileData.name}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">ইমেইল:</span>
                            <span class="profile-value">${profileData.email}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">মোট স্কোর:</span>
                            <span class="profile-value">${profileData.totalScore}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">খেলা সংখ্যা:</span>
                            <span class="profile-value">${profileData.gamesPlayed}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">গড় স্কোর:</span>
                            <span class="profile-value">${profileData.averageScore}</span>
                        </div>
                        <div class="profile-item">
                            <span class="profile-label">যোগদানের তারিখ:</span>
                            <span class="profile-value">${profileData.joinDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    popup.querySelector('.popup-close').addEventListener('click', closeProfilePopup);
    setTimeout(() => popup.classList.add('show'), 10);
}

function closeProfilePopup() {
    const popup = document.getElementById('profile-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// Show leaderboard popup
function showLeaderboardPopup(title, scores) {
    const existingPopup = document.getElementById('leaderboard-popup');
    if (existingPopup) existingPopup.remove();
    
    const popup = document.createElement('div');
    popup.id = 'leaderboard-popup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content leaderboard-content">
                <div class="popup-header">
                    <h3>${title}</h3>
                    <button class="popup-close">×</button>
                </div>
                <div class="popup-body">
                    ${scores.length === 0 
                        ? '<p class="no-scores">এখনো কেউ খেলেনি!</p>'
                        : scores.slice(0, 20).map((score, index) => `
                            <div class="score-item ${index === 0 ? 'top-score' : ''} ${score.userId === currentUser?.uid ? 'current-user' : ''}">
                                <div class="score-rank">${index + 1}</div>
                                <div class="score-info">
                                    <div class="score-name">${score.userName}</div>
                                    <div class="score-details">সেট ${score.setIndex + 1} - ${score.date} ${score.time}</div>
                                </div>
                                <div class="score-percentage">${score.percentage}%</div>
                            </div>
                        `).join('')
                    }
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    popup.querySelector('.popup-close').addEventListener('click', closeLeaderboardPopup);
    setTimeout(() => popup.classList.add('show'), 10);
}

function closeLeaderboardPopup() {
    const popup = document.getElementById('leaderboard-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// Error message helper
function getErrorMessage(errorCode) {
    switch (errorCode) {
        case 'auth/email-already-in-use':
            return 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে!';
        case 'auth/weak-password':
            return 'পাসওয়ার্ড খুবই দুর্বল!';
        case 'auth/invalid-email':
            return 'ভুল ইমেইল ফরম্যাট!';
        case 'auth/user-not-found':
            return 'এই ইমেইল দিয়ে কোন অ্যাকাউন্ট নেই!';
        case 'auth/wrong-password':
            return 'ভুল পাসওয়ার্ড!';
        case 'auth/too-many-requests':
            return 'অনেকবার চেষ্টা করেছেন! কিছুক্ষণ পর চেষ্টা করুন।';
        default:
            return 'কিছু সমস্যা হয়েছে! আবার চেষ্টা করুন।';
    }
}

// Show message helper
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        ${type === 'success' ? 'background: #28a745;' : 'background: #dc3545;'}
    `;
    
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Update user progress in Firebase
async function updateUserProgress(completedSetIndex) {
    if (!isAuthenticated || !currentUser) return;
    
    try {
        const progressRef = database.ref('users/' + currentUser.uid + '/progress');
        const snapshot = await progressRef.once('value');
        const currentProgress = snapshot.val() || { currentSet: 0, completedSets: [] };
        
        // Mark current set as completed
        if (!currentProgress.completedSets.includes(completedSetIndex)) {
            currentProgress.completedSets.push(completedSetIndex);
        }
        
        // Move to next set
        currentProgress.currentSet = completedSetIndex + 1;
        
        await progressRef.set(currentProgress);
        userProgress = currentProgress;
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// Load user progress from Firebase
async function loadUserProgress() {
    if (!isAuthenticated || !currentUser) {
        userProgress = { currentSet: 0, completedSets: [] };
        return;
    }
    
    try {
        const snapshot = await database.ref('users/' + currentUser.uid + '/progress').once('value');
        userProgress = snapshot.val() || { currentSet: 0, completedSets: [] };
    } catch (error) {
        console.error('Error loading progress:', error);
        userProgress = { currentSet: 0, completedSets: [] };
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Don't show auth screen immediately - let Firebase check auth state first
    updateUserUI();
});

// Check auth state after Firebase loads
window.addEventListener('load', function() {
    // Give Firebase time to check authentication state
    setTimeout(() => {
        // Show auth screen if user is not authenticated
        if (!isAuthenticated && !currentUser) {
            if (typeof showAuthScreen === 'function') {
                showAuthScreen();
            } else {
                showAuthScreenFallback();
            }
        }
    }, 1000);
});