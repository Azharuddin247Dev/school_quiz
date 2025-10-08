// Authentication functions
function showAuthScreen() {
    hideAllScreens();
    document.getElementById('auth-screen').style.display = 'block';
}

function showSignupForm() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('signup-form').style.display = 'block';
    document.getElementById('auth-title').textContent = 'নতুন অ্যাকাউন্ট তৈরি করুন';
}

function showLoginForm() {
    document.getElementById('signup-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('auth-title').textContent = 'লগইন করুন';
}

// Sign up with email and password
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
    
    try {
        showLoading(true);
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        // Update user profile with name
        await user.updateProfile({
            displayName: name
        });
        
        // Save user data to database
        await database.ref('users/' + user.uid).set({
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
    } finally {
        showLoading(false);
    }
}

// Sign in with email and password
async function signIn() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showMessage('ইমেইল ও পাসওয়ার্ড দিন!', 'error');
        return;
    }
    
    try {
        showLoading(true);
        await auth.signInWithEmailAndPassword(email, password);
        showMessage('সফলভাবে লগইন হয়েছে!', 'success');
        
    } catch (error) {
        console.error('Login error:', error);
        showMessage(getErrorMessage(error.code), 'error');
    } finally {
        showLoading(false);
    }
}

// Sign out
async function signOut() {
    try {
        await auth.signOut();
        showMessage('সফলভাবে লগআউট হয়েছে!', 'success');
    } catch (error) {
        console.error('Logout error:', error);
        showMessage('লগআউট করতে সমস্যা হয়েছে!', 'error');
    }
}

// Auth state observer
auth.onAuthStateChanged((user) => {
    console.log('Auth state changed:', user);
    if (user) {
        currentUser = user;
        isAuthenticated = true;
        studentName = user.displayName || user.email;
        
        // Show main app
        setTimeout(() => {
            hideAllScreens();
            document.getElementById('welcome-screen').style.display = 'block';
            updateUserUI();
        }, 100);
        
    } else {
        currentUser = null;
        isAuthenticated = false;
        studentName = '';
        
        // Show auth screen
        setTimeout(() => {
            showAuthScreen();
            updateUserUI();
        }, 100);
    }
});

// Update user interface based on auth state
function updateUserUI() {
    const userInfo = document.getElementById('user-info');
    const authButton = document.getElementById('auth-button');
    
    if (isAuthenticated && currentUser) {
        userInfo.innerHTML = `
            <span class="user-name">স্বাগতম, ${currentUser.displayName || currentUser.email}!</span>
        `;
        authButton.innerHTML = '<span onclick="signOut()">লগআউট</span>';
    } else {
        userInfo.innerHTML = '';
        authButton.innerHTML = '<span onclick="showAuthScreen()">লগইন</span>';
    }
}

// Save score to global leaderboard
async function saveScoreToLeaderboard(score, totalQuestions, setIndex) {
    if (!isAuthenticated || !currentUser) {
        console.log('Not authenticated, skipping score save');
        return;
    }
    
    const percentage = Math.round((score / totalQuestions) * 100);
    const now = new Date();
    const scoreData = {
        userId: currentUser.uid,
        userName: currentUser.displayName || currentUser.email,
        score: score,
        totalQuestions: totalQuestions,
        percentage: percentage,
        setIndex: setIndex,
        timestamp: now.getTime(),
        date: now.toLocaleDateString('bn-BD'),
        time: now.toLocaleTimeString('bn-BD')
    };
    
    console.log('Saving score:', scoreData);
    
    try {
        // Save to global leaderboard
        const result = await database.ref('leaderboard').push(scoreData);
        console.log('Score saved successfully:', result.key);
        
        // Update user stats
        const userRef = database.ref('users/' + currentUser.uid);
        const userSnapshot = await userRef.once('value');
        const userData = userSnapshot.val() || {};
        
        await userRef.update({
            name: currentUser.displayName || currentUser.email,
            email: currentUser.email,
            totalScore: (userData.totalScore || 0) + score,
            gamesPlayed: (userData.gamesPlayed || 0) + 1,
            lastPlayed: now.getTime()
        });
        
        showMessage('স্কোর সেভ হয়েছে!', 'success');
        
    } catch (error) {
        console.error('Error saving score:', error);
        showMessage('স্কোর সেভ করতে সমস্যা: ' + error.message, 'error');
    }
}

// Show global leaderboard
async function showGlobalLeaderboard() {
    if (!isAuthenticated) {
        showMessage('লিডারবোর্ড দেখতে লগইন করুন!', 'error');
        return;
    }
    
    try {
        showLoading(true);
        console.log('Loading leaderboard...');
        
        const snapshot = await database.ref('leaderboard').once('value');
        console.log('Snapshot exists:', snapshot.exists());
        
        const scores = [];
        if (snapshot.exists()) {
            snapshot.forEach((child) => {
                scores.push(child.val());
            });
        }
        
        console.log('Loaded scores:', scores.length);
        
        // Sort by percentage (descending) then by timestamp (recent first)
        scores.sort((a, b) => {
            if (b.percentage !== a.percentage) {
                return b.percentage - a.percentage;
            }
            return (b.timestamp || 0) - (a.timestamp || 0);
        });
        
        showLeaderboardPopup('🏆 গ্লোবাল লিডারবোর্ড', scores);
        
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showMessage('লিডারবোর্ড লোড করতে সমস্যা হয়েছে: ' + error.message, 'error');
    } finally {
        showLoading(false);
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
                    <button class="popup-close" onclick="closeLeaderboardPopup()">×</button>
                </div>
                <div class="popup-body">
                    ${scores.length === 0 
                        ? '<p class="no-scores">এখনো কেউ খেলেনি!</p>'
                        : scores.map((score, index) => `
                            <div class="score-item ${index === 0 ? 'top-score' : ''}">
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
    setTimeout(() => popup.classList.add('show'), 10);
}

// Close leaderboard popup
function closeLeaderboardPopup() {
    const popup = document.getElementById('leaderboard-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// Utility functions
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
    
    setTimeout(() => {
        messageDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

function showLoading(show) {
    let loader = document.getElementById('loading-overlay');
    
    if (show) {
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'loading-overlay';
            loader.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>অপেক্ষা করুন...</p>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    } else {
        if (loader) {
            loader.style.display = 'none';
        }
    }
}

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে!',
        'auth/weak-password': 'পাসওয়ার্ড খুবই দুর্বল!',
        'auth/invalid-email': 'ভুল ইমেইল ফরম্যাট!',
        'auth/user-not-found': 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট নেই!',
        'auth/wrong-password': 'ভুল পাসওয়ার্ড!',
        'auth/too-many-requests': 'অনেকবার চেষ্টা করেছেন! একটু পরে চেষ্টা করুন।'
    };
    
    return errorMessages[errorCode] || 'কিছু সমস্যা হয়েছে! আবার চেষ্টা করুন।';
}