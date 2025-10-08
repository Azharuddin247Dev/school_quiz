// Simplified Authentication and Leaderboard System
let currentUser = null;
let isAuthenticated = false;
let globalLeaderboard = JSON.parse(localStorage.getItem('globalLeaderboard') || '[]');

// Show auth screen
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

// Simple signup
function signUp() {
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
    
    // Save user
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
        showMessage('এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে!', 'error');
        return;
    }
    
    users[email] = { name, password, email, createdAt: Date.now() };
    localStorage.setItem('users', JSON.stringify(users));
    
    showMessage('অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!', 'success');
    showLoginForm();
}

// Simple signin
function signIn() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showMessage('ইমেইল ও পাসওয়ার্ড দিন!', 'error');
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    const user = users[email];
    
    if (!user || user.password !== password) {
        showMessage('ভুল ইমেইল বা পাসওয়ার্ড!', 'error');
        return;
    }
    
    // Login successful
    currentUser = { uid: email, email: email, displayName: user.name };
    isAuthenticated = true;
    studentName = user.name;
    
    hideAllScreens();
    document.getElementById('welcome-screen').style.display = 'block';
    updateUserUI();
    showMessage('সফলভাবে লগইন হয়েছে!', 'success');
}

// Sign out
function signOut() {
    currentUser = null;
    isAuthenticated = false;
    studentName = '';
    showAuthScreen();
    updateUserUI();
    showMessage('সফলভাবে লগআউট হয়েছে!', 'success');
}

// Update UI
function updateUserUI() {
    const userInfo = document.getElementById('user-info');
    const authButton = document.getElementById('auth-button');
    
    if (isAuthenticated && currentUser) {
        userInfo.innerHTML = `<span class="user-name">স্বাগতম, ${currentUser.displayName}!</span>`;
        authButton.innerHTML = '<span onclick="signOut()">লগআউট</span>';
    } else {
        userInfo.innerHTML = '';
        authButton.innerHTML = '<span onclick="showAuthScreen()">লগইন</span>';
    }
}

// Save score to global leaderboard
function saveScoreToLeaderboard(score, totalQuestions, setIndex) {
    if (!isAuthenticated || !currentUser) return;
    
    const percentage = Math.round((score / totalQuestions) * 100);
    const now = new Date();
    const finalScore = (typeof challengeMode !== 'undefined' && challengeMode) ? score * (challengeMultiplier || 1) : score;
    const scoreData = {
        userId: currentUser.uid,
        userName: currentUser.displayName,
        score: finalScore,
        originalScore: score,
        totalQuestions: totalQuestions,
        percentage: percentage,
        setIndex: setIndex,
        challengeMode: challengeMode || null,
        multiplier: challengeMultiplier || 1,
        timestamp: now.getTime(),
        date: now.toLocaleDateString('bn-BD'),
        time: now.toLocaleTimeString('bn-BD')
    };
    
    globalLeaderboard.push(scoreData);
    localStorage.setItem('globalLeaderboard', JSON.stringify(globalLeaderboard));
    
    if (typeof challengeMode !== 'undefined' && challengeMode) {
        showMessage(`চ্যালেঞ্জ সম্পন্ন! ${challengeMultiplier || 1}x পয়েন্ট পেয়েছেন!`, 'success');
    } else {
        showMessage('স্কোর সেভ হয়েছে!', 'success');
    }
}

// Show global leaderboard
function showGlobalLeaderboard() {
    if (!isAuthenticated) {
        showMessage('লিডারবোর্ড দেখতে লগইন করুন!', 'error');
        return;
    }
    
    const scores = [...globalLeaderboard].sort((a, b) => {
        if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
        }
        return b.timestamp - a.timestamp;
    });
    
    showLeaderboardPopup('🏆 গ্লোবাল লিডারবোর্ড', scores);
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
                        : scores.slice(0, 20).map((score, index) => `
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

function closeLeaderboardPopup() {
    const popup = document.getElementById('leaderboard-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

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

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if user was logged in
    const lastUser = localStorage.getItem('lastUser');
    if (lastUser) {
        const users = JSON.parse(localStorage.getItem('users') || '{}');
        const user = users[lastUser];
        if (user) {
            currentUser = { uid: lastUser, email: lastUser, displayName: user.name };
            isAuthenticated = true;
            studentName = user.name;
            updateUserUI();
            return;
        }
    }
    
    // Show auth screen if not logged in
    showAuthScreen();
    updateUserUI();
});

// Save last user on login
function saveLastUser() {
    if (currentUser) {
        localStorage.setItem('lastUser', currentUser.email);
    }
}