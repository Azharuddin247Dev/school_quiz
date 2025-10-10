// Enhanced Features for Quiz App

// User Profile System
async function showProfile() {
    if (!isAuthenticated) {
        showMessage('প্রোফাইল দেখতে লগইন করুন!', 'error');
        return;
    }
    
    const userStats = await getUserStats();
    const popup = document.createElement('div');
    popup.id = 'profile-popup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content profile-content">
                <div class="popup-header">
                    <h3>👤 আপনার প্রোফাইল</h3>
                    <button class="popup-close" onclick="closeProfilePopup()">×</button>
                </div>
                <div class="popup-body">
                    <div class="profile-info">
                        <div class="profile-avatar">👤</div>
                        <h4>${currentUser.displayName}</h4>
                        <p>${currentUser.email}</p>
                    </div>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value">${userStats.totalGames}</div>
                            <div class="stat-label">মোট খেলা</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${userStats.totalScore}</div>
                            <div class="stat-label">মোট স্কোর</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${userStats.avgPercentage}%</div>
                            <div class="stat-label">গড় স্কোর</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${userStats.bestScore}%</div>
                            <div class="stat-label">সেরা স্কোর</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${userStats.streak}</div>
                            <div class="stat-label">ধারাবাহিক জয়</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${userStats.rank || 'N/A'}</div>
                            <div class="stat-label">র‍্যাঙ্ক</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${userStats.battles?.won || 0}</div>
                            <div class="stat-label">ব্যাটল জিত</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${userStats.battles?.played || 0}</div>
                            <div class="stat-label">মোট ব্যাটল</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 10);
}

function closeProfilePopup() {
    const popup = document.getElementById('profile-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// Achievement System
const achievements = [
    { id: 'first_quiz', name: 'প্রথম কুইজ', desc: 'প্রথম কুইজ সম্পন্ন করুন', icon: '🎯', condition: (stats) => stats.totalGames >= 1 },
    { id: 'perfect_score', name: 'নিখুঁত স্কোর', desc: '১০০% স্কোর অর্জন করুন', icon: '💯', condition: (stats) => stats.bestScore >= 100 },
    { id: 'quiz_master', name: 'কুইজ মাস্টার', desc: '১০টি কুইজ সম্পন্ন করুন', icon: '🏆', condition: (stats) => stats.totalGames >= 10 },
    { id: 'high_scorer', name: 'উচ্চ স্কোরার', desc: '৯০% এর বেশি স্কোর করুন', icon: '⭐', condition: (stats) => stats.bestScore >= 90 },
    { id: 'consistent', name: 'ধারাবাহিক', desc: '৫টি কুইজে পরপর ৮০%+ স্কোর', icon: '🔥', condition: (stats) => stats.streak >= 5 },
    { id: 'explorer', name: 'অভিযাত্রী', desc: 'সব ধরনের গেম খেলুন', icon: '🗺️', condition: (stats) => stats.gamesPlayed && Object.keys(stats.gamesPlayed).length >= 4 }
];

async function showAchievements() {
    if (!isAuthenticated) {
        showMessage('অর্জন দেখতে লগইন করুন!', 'error');
        return;
    }
    
    const userStats = await getUserStats();
    const unlockedAchievements = achievements.filter(a => a.condition(userStats));
    
    const popup = document.createElement('div');
    popup.id = 'achievement-popup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content achievement-content">
                <div class="popup-header">
                    <h3>🏅 আপনার অর্জনসমূহ</h3>
                    <button class="popup-close" onclick="closeAchievementPopup()">×</button>
                </div>
                <div class="popup-body">
                    <div class="achievement-summary">
                        <p>${unlockedAchievements.length}/${achievements.length} অর্জন আনলক হয়েছে</p>
                    </div>
                    <div class="achievements-grid">
                        ${achievements.map(achievement => {
                            const unlocked = unlockedAchievements.includes(achievement);
                            return `
                                <div class="achievement-item ${unlocked ? 'unlocked' : 'locked'}">
                                    <div class="achievement-icon">${achievement.icon}</div>
                                    <div class="achievement-info">
                                        <h4>${achievement.name}</h4>
                                        <p>${achievement.desc}</p>
                                    </div>
                                    ${unlocked ? '<div class="unlock-badge">✓</div>' : '<div class="lock-badge">🔒</div>'}
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 10);
}

function closeAchievementPopup() {
    const popup = document.getElementById('achievement-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// Practice Mode
function showPracticeMode() {
    if (!isAuthenticated) {
        showMessage('প্র্যাকটিস মোড ব্যবহার করতে লগইন করুন!', 'error');
        return;
    }
    
    hideAllScreens();
    const practiceScreen = document.createElement('div');
    practiceScreen.id = 'practice-screen';
    practiceScreen.className = 'screen';
    practiceScreen.innerHTML = `
        <div class="practice-section">
            <h2>🎯 প্র্যাকটিস মোড</h2>
            <p>নির্দিষ্ট বিষয় বা শ্রেণী নির্বাচন করে অনুশীলন করুন</p>
            
            <div class="practice-options">
                <div class="option-group">
                    <h3>বিষয় নির্বাচন করুন:</h3>
                    <div class="subject-grid">
                        <button onclick="startPractice('history')" class="subject-btn">📜 ইতিহাস</button>
                        <button onclick="startPractice('geography')" class="subject-btn">🌍 ভূগোল</button>
                        <button onclick="startPractice('physical_science')" class="subject-btn">⚗️ ভৌত বিজ্ঞান</button>
                        <button onclick="startPractice('life_science')" class="subject-btn">🧬 জীবন বিজ্ঞান</button>
                        <button onclick="startPractice('english')" class="subject-btn">🇬🇧 ইংরেজি</button>
                        <button onclick="startPractice('bengali')" class="subject-btn">🇧🇩 বাংলা</button>
                    </div>
                </div>
                
                <div class="option-group">
                    <h3>শ্রেণী নির্বাচন করুন:</h3>
                    <div class="class-grid">
                        <button onclick="setPracticeClass(5)" class="class-btn">৫ম শ্রেণী</button>
                        <button onclick="setPracticeClass(6)" class="class-btn">৬ষ্ঠ শ্রেণী</button>
                        <button onclick="setPracticeClass(7)" class="class-btn">৭ম শ্রেণী</button>
                        <button onclick="setPracticeClass(8)" class="class-btn">৮ম শ্রেণী</button>
                    </div>
                </div>
            </div>
            
            <button class="btn btn-secondary practice-back-btn">
                ফিরে যান
            </button>
        </div>
    `;
    
    document.querySelector('.main-content').appendChild(practiceScreen);
    practiceScreen.style.display = 'block';
    
    // Add event listener for back button
    practiceScreen.querySelector('.practice-back-btn').addEventListener('click', function() {
        const screen = document.getElementById('practice-screen');
        if (screen) screen.remove();
        hideAllScreens();
        document.getElementById('welcome-screen').style.display = 'block';
    });
}

let practiceSubject = null;
let practiceClass = null;

function startPractice(subject) {
    practiceSubject = subject;
    if (practiceClass) {
        initializePracticeQuiz();
    } else {
        showMessage('প্রথমে একটি শ্রেণী নির্বাচন করুন!', 'error');
    }
}

function setPracticeClass(classNum) {
    practiceClass = classNum;
    if (practiceSubject) {
        initializePracticeQuiz();
    } else {
        showMessage('প্রথমে একটি বিষয় নির্বাচন করুন!', 'error');
    }
}

function initializePracticeQuiz() {
    if (!questionBank[practiceSubject] || !questionBank[practiceSubject][practiceClass]) {
        showMessage('এই বিষয় ও শ্রেণীর জন্য প্রশ্ন পাওয়া যায়নি!', 'error');
        return;
    }
    
    currentQuestions = [...questionBank[practiceSubject][practiceClass]];
    currentQuestions = shuffleArray(currentQuestions).slice(0, 10);
    totalQuestions = currentQuestions.length;
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    // Remove practice screen and start quiz
    const practiceScreen = document.getElementById('practice-screen');
    if (practiceScreen) practiceScreen.remove();
    
    hideAllScreens();
    document.getElementById('quiz-screen').style.display = 'block';
    loadQuestion();
}

// Challenge Mode
function showChallengeMode() {
    if (!isAuthenticated) {
        showMessage('চ্যালেঞ্জ মোড ব্যবহার করতে লগইন করুন!', 'error');
        return;
    }
    
    hideAllScreens();
    const challengeScreen = document.createElement('div');
    challengeScreen.id = 'challenge-screen';
    challengeScreen.className = 'screen';
    challengeScreen.innerHTML = `
        <div class="challenge-section">
            <h2>⚡ চ্যালেঞ্জ মোড</h2>
            <p>কঠিন চ্যালেঞ্জে অংশ নিন এবং বিশেষ পুরস্কার জিতুন!</p>
            
            <div class="challenge-options">
                <div class="challenge-card">
                    <div class="challenge-icon">⏱️</div>
                    <h3>স্পিড চ্যালেঞ্জ</h3>
                    <p>১০ সেকেন্ডে উত্তর দিন</p>
                    <div class="challenge-reward">🏆 ২x পয়েন্ট</div>
                </div>
                
                <div class="challenge-card">
                    <div class="challenge-icon">💯</div>
                    <h3>পারফেক্ট চ্যালেঞ্জ</h3>
                    <p>একটি ভুল = গেম শেষ</p>
                    <div class="challenge-reward">🏆 ৩x পয়েন্ট</div>
                </div>
                
                <div class="challenge-card">
                    <div class="challenge-icon">🏃</div>
                    <h3>ম্যারাথন চ্যালেঞ্জ</h3>
                    <p>৫০টি প্রশ্ন একসাথে</p>
                    <div class="challenge-reward">🏆 ৫x পয়েন্ট</div>
                </div>
            </div>
            
            <button class="btn btn-secondary">
                ফিরে যান
            </button>
        </div>
    `;
    
    document.querySelector('.main-content').appendChild(challengeScreen);
    challengeScreen.style.display = 'block';
    
    // Add event listeners
    challengeScreen.querySelector('.challenge-card:nth-child(1)').addEventListener('click', startSpeedChallenge);
    challengeScreen.querySelector('.challenge-card:nth-child(2)').addEventListener('click', startPerfectChallenge);
    challengeScreen.querySelector('.challenge-card:nth-child(3)').addEventListener('click', startMarathonChallenge);
    challengeScreen.querySelector('.btn-secondary').addEventListener('click', function() {
        const screen = document.getElementById('challenge-screen');
        if (screen) screen.remove();
        hideAllScreens();
        document.getElementById('welcome-screen').style.display = 'block';
    });
}

let challengeMode = null;
let challengeMultiplier = 1;

function startSpeedChallenge() {
    challengeMode = 'speed';
    challengeMultiplier = 2;
    timer = 10; // Reduced time
    initializeChallengeQuiz();
}

function startPerfectChallenge() {
    challengeMode = 'perfect';
    challengeMultiplier = 3;
    initializeChallengeQuiz();
}

function startMarathonChallenge() {
    challengeMode = 'marathon';
    challengeMultiplier = 5;
    initializeChallengeQuiz(50); // 50 questions
}

function initializeChallengeQuiz(questionCount = 20) {
    // Mix questions from all subjects and classes
    const allQuestions = [];
    Object.keys(questionBank).forEach(subject => {
        Object.keys(questionBank[subject]).forEach(classNum => {
            questionBank[subject][classNum].forEach(q => {
                q.subject = subject;
                q.class = classNum;
                allQuestions.push(q);
            });
        });
    });
    
    currentQuestions = shuffleArray(allQuestions).slice(0, questionCount);
    totalQuestions = currentQuestions.length;
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    
    // Remove challenge screen and start quiz
    const challengeScreen = document.getElementById('challenge-screen');
    if (challengeScreen) challengeScreen.remove();
    
    hideAllScreens();
    document.getElementById('quiz-screen').style.display = 'block';
    loadQuestion();
}

// Enhanced Statistics (Firebase-based)
async function getUserStats() {
    if (!isAuthenticated || !currentUser) {
        return { totalGames: 0, totalScore: 0, avgPercentage: 0, bestScore: 0, streak: 0, rank: 0 };
    }
    
    try {
        // Get user data from Firebase
        const userSnapshot = await database.ref('users/' + currentUser.uid).once('value');
        const userData = userSnapshot.val() || {};
        
        // Get user scores from leaderboard
        const leaderboardSnapshot = await database.ref('leaderboard').orderByChild('userId').equalTo(currentUser.uid).once('value');
        const userScores = [];
        leaderboardSnapshot.forEach(child => {
            userScores.push(child.val());
        });
        
        const totalGames = userScores.length;
        const totalScore = userScores.reduce((sum, s) => sum + s.score, 0);
        const avgPercentage = totalGames > 0 ? Math.round(userScores.reduce((sum, s) => sum + s.percentage, 0) / totalGames) : 0;
        const bestScore = totalGames > 0 ? Math.max(...userScores.map(s => s.percentage)) : 0;
        
        // Calculate streak
        let streak = 0;
        const sortedScores = userScores.sort((a, b) => b.timestamp - a.timestamp);
        for (let score of sortedScores) {
            if (score.percentage >= 80) {
                streak++;
            } else {
                break;
            }
        }
        
        // Calculate rank based on best score
        let rank = 'N/A';
        if (totalGames > 0 && bestScore > 0) {
            // Get all users' best scores for ranking
            const allScoresSnapshot = await database.ref('leaderboard').once('value');
            const userBestScores = {};
            
            // Find each user's best score
            allScoresSnapshot.forEach(child => {
                const score = child.val();
                if (!userBestScores[score.userId] || userBestScores[score.userId] < score.percentage) {
                    userBestScores[score.userId] = score.percentage;
                }
            });
            
            // Get unique scores and sort them
            const uniqueScores = [...new Set(Object.values(userBestScores))].sort((a, b) => b - a);
            
            // Find rank based on score (users with same score get same rank)
            rank = uniqueScores.indexOf(bestScore) + 1;
        }
        
        // Get battle stats
        const battleStats = await getBattleStats();
        
        return { totalGames, totalScore, avgPercentage, bestScore, streak, rank, battles: battleStats };
    } catch (error) {
        console.error('Error getting user stats:', error);
        return { totalGames: 0, totalScore: 0, avgPercentage: 0, bestScore: 0, streak: 0, rank: 0 };
    }
}

// Daily Challenge System (Firebase-based)
async function checkDailyChallenge() {
    if (!isAuthenticated || !currentUser) return;
    
    const today = new Date().toDateString();
    try {
        const snapshot = await database.ref('users/' + currentUser.uid + '/lastDailyChallenge').once('value');
        const lastChallenge = snapshot.val();
        
        if (lastChallenge !== today) {
            showDailyChallengeNotification();
        }
    } catch (error) {
        console.error('Error checking daily challenge:', error);
    }
}

function showDailyChallengeNotification() {
    const notification = document.createElement('div');
    notification.className = 'daily-challenge-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>🎯 দৈনিক চ্যালেঞ্জ!</h4>
            <p>আজকের বিশেষ চ্যালেঞ্জে অংশ নিন</p>
            <button onclick="startDailyChallenge()" class="btn btn-primary">শুরু করুন</button>
            <button onclick="closeDailyChallenge()" class="btn btn-secondary">পরে</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
}

async function startDailyChallenge() {
    if (isAuthenticated && currentUser) {
        try {
            await database.ref('users/' + currentUser.uid + '/lastDailyChallenge').set(new Date().toDateString());
        } catch (error) {
            console.error('Error saving daily challenge:', error);
        }
    }
    closeDailyChallenge();
    challengeMode = 'daily';
    challengeMultiplier = 4;
    initializeChallengeQuiz(15);
}

function closeDailyChallenge() {
    const notification = document.querySelector('.daily-challenge-notification');
    if (notification) notification.remove();
}

// Challenge Battles System
async function showChallengeBattles() {
    if (!isAuthenticated) {
        showMessage('চ্যালেঞ্জ দেখতে লগইন করুন!', 'error');
        return;
    }
    
    const battleStats = await getBattleStats();
    const popup = document.createElement('div');
    popup.id = 'battle-popup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content battle-content">
                <div class="popup-header">
                    <h3>⚔️ চ্যালেঞ্জ ব্যাটল</h3>
                    <button class="popup-close">×</button>
                </div>
                <div class="popup-body">
                    <div class="battle-stats">
                        <div class="stat-card">
                            <div class="stat-value">${battleStats.played}</div>
                            <div class="stat-label">খেলা</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${battleStats.won}</div>
                            <div class="stat-label">জিত</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${battleStats.lost}</div>
                            <div class="stat-label">হার</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">${battleStats.tied}</div>
                            <div class="stat-label">বরাবর</div>
                        </div>
                    </div>
                    <div class="battle-actions">
                        <button onclick="sendChallengeRequest()" class="btn btn-primary">চ্যালেঞ্জ পাঠান</button>
                        <button onclick="showChallengeRequests()" class="btn btn-secondary">অনুরোধ দেখুন</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    popup.querySelector('.popup-close').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    });
    setTimeout(() => popup.classList.add('show'), 10);
}

async function sendChallengeRequest() {
    // Close battle popup first
    const battlePopup = document.getElementById('battle-popup');
    if (battlePopup) battlePopup.remove();
    
    try {
        const onlineSnapshot = await database.ref('onlineUsers').once('value');
        const onlineUsers = [];
        onlineSnapshot.forEach(child => {
            if (child.key !== currentUser.uid) {
                onlineUsers.push({id: child.key, ...child.val()});
            }
        });
        
        if (onlineUsers.length === 0) {
            showMessage('কেউ অনলাইনে নেই!', 'error');
            return;
        }
        
        const popup = document.createElement('div');
        popup.id = 'challenge-popup';
        popup.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content">
                    <div class="popup-header">
                        <h3>চ্যালেঞ্জ পাঠান</h3>
                        <button class="popup-close">×</button>
                    </div>
                    <div class="popup-body">
                        ${onlineUsers.map(user => `
                            <div class="user-item" onclick="challengeUser('${user.id}', '${user.name}')">
                                <span>👤 ${user.name}</span>
                                <span>⚔️</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        popup.querySelector('.popup-close').addEventListener('click', () => popup.remove());
        setTimeout(() => popup.classList.add('show'), 10);
    } catch (error) {
        console.error('Error fetching online users:', error);
        showMessage('অনলাইন ব্যবহারকারী লোড করতে সমস্যা!', 'error');
    }
}

async function challengeUser(userId, userName) {
    try {
        await database.ref('challengeRequests').push({
            from: currentUser.uid,
            fromName: currentUser.displayName || currentUser.email.split('@')[0],
            to: userId,
            toName: userName,
            status: 'pending',
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        showMessage(`${userName} কে চ্যালেঞ্জ পাঠানো হয়েছে!`, 'success');
        document.getElementById('challenge-popup').remove();
    } catch (error) {
        showMessage('চ্যালেঞ্জ পাঠাতে সমস্যা!', 'error');
    }
}

async function showChallengeRequests() {
    // Close battle popup first
    const battlePopup = document.getElementById('battle-popup');
    if (battlePopup) battlePopup.remove();
    
    try {
        const snapshot = await database.ref('challengeRequests').orderByChild('to').equalTo(currentUser.uid).once('value');
        const requests = [];
        snapshot.forEach(child => {
            if (child.val().status === 'pending') {
                requests.push({id: child.key, ...child.val()});
            }
        });
        
        const popup = document.createElement('div');
        popup.id = 'requests-popup';
        popup.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content">
                    <div class="popup-header">
                        <h3>চ্যালেঞ্জ অনুরোধ</h3>
                        <button class="popup-close">×</button>
                    </div>
                    <div class="popup-body">
                        ${requests.length === 0 ? '<p>কোন অনুরোধ নেই!</p>' : 
                            requests.map(req => `
                                <div class="request-item">
                                    <span>${req.fromName} চ্যালেঞ্জ করেছেন</span>
                                    <div>
                                        <button onclick="acceptChallenge('${req.id}', '${req.from}')" class="btn btn-success">গ্রহণ</button>
                                        <button onclick="rejectChallenge('${req.id}')" class="btn btn-danger">প্রত্যাখ্যান</button>
                                    </div>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        popup.querySelector('.popup-close').addEventListener('click', () => popup.remove());
        setTimeout(() => popup.classList.add('show'), 10);
    } catch (error) {
        console.error('Error fetching challenge requests:', error);
        showMessage('অনুরোধ লোড করতে সমস্যা!', 'error');
    }
}

async function acceptChallenge(requestId, opponentId) {
    try {
        await database.ref('challengeRequests/' + requestId).update({status: 'accepted'});
        await database.ref('activeBattles').push({
            player1: currentUser.uid,
            player2: opponentId,
            status: 'active',
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        showMessage('চ্যালেঞ্জ গ্রহণ করা হয়েছে!', 'success');
        document.getElementById('requests-popup').remove();
    } catch (error) {
        showMessage('সমস্যা হয়েছে!', 'error');
    }
}

async function rejectChallenge(requestId) {
    await database.ref('challengeRequests/' + requestId).update({status: 'rejected'});
    showMessage('চ্যালেঞ্জ প্রত্যাখ্যান করা হয়েছে!', 'success');
    document.getElementById('requests-popup').remove();
}

async function getBattleStats() {
    try {
        const snapshot = await database.ref('battleResults').orderByChild('player').equalTo(currentUser.uid).once('value');
        let played = 0, won = 0, lost = 0, tied = 0;
        
        snapshot.forEach(child => {
            const result = child.val();
            played++;
            if (result.result === 'won') won++;
            else if (result.result === 'lost') lost++;
            else if (result.result === 'tied') tied++;
        });
        
        return {played, won, lost, tied};
    } catch (error) {
        return {played: 0, won: 0, lost: 0, tied: 0};
    }
}

// Online Users Tracking
async function updateUserOnlineStatus(isOnline) {
    if (!isAuthenticated || !currentUser) return;
    
    try {
        const userRef = database.ref('onlineUsers/' + currentUser.uid);
        if (isOnline) {
            await userRef.set({
                name: currentUser.displayName || currentUser.email.split('@')[0],
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                status: 'online'
            });
            // Remove user when they disconnect
            userRef.onDisconnect().remove();
        } else {
            await userRef.remove();
        }
    } catch (error) {
        console.error('Error updating online status:', error);
    }
}

async function showOnlineUsers() {
    if (!isAuthenticated) {
        showMessage('অনলাইন ব্যবহারকারী দেখতে লগইন করুন!', 'error');
        return;
    }
    
    try {
        const snapshot = await database.ref('onlineUsers').once('value');
        const onlineUsers = [];
        
        snapshot.forEach(child => {
            const user = child.val();
            const now = Date.now();
            // Consider users online if they were active in last 5 minutes and not current user
            if (now - user.timestamp < 300000 && child.key !== currentUser.uid) {
                onlineUsers.push({...user, id: child.key});
            }
        });
        
        const popup = document.createElement('div');
        popup.id = 'online-users-popup';
        popup.innerHTML = `
            <div class="popup-overlay">
                <div class="popup-content">
                    <div class="popup-header">
                        <h3>🟢 অনলাইন ব্যবহারকারী (${onlineUsers.length})</h3>
                        <button class="popup-close">×</button>
                    </div>
                    <div class="popup-body">
                        ${onlineUsers.length === 0 
                            ? '<p class="no-users">কেউ অনলাইনে নেই!</p>'
                            : onlineUsers.map(user => `
                                <div class="online-user-item">
                                    <span class="online-indicator">🟢</span>
                                    <span class="user-name">${user.name}</span>
                                    <button onclick="window.showGameSelection('${user.id}', '${user.name}')" class="challenge-user-btn">⚔️ চ্যালেঞ্জ</button>
                                </div>
                            `).join('')
                        }
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(popup);
        popup.querySelector('.popup-close').addEventListener('click', () => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        });
        setTimeout(() => popup.classList.add('show'), 10);
        
    } catch (error) {
        console.error('Error fetching online users:', error);
        showMessage('অনলাইন ব্যবহারকারী লোড করতে সমস্যা!', 'error');
    }
}

// Game Selection for Challenge
window.showGameSelection = function(userId, userName) {
    console.log('showGameSelection called with:', userId, userName);
    alert('Challenge button clicked for: ' + userName);
    
    // Close online users popup first
    const onlinePopup = document.getElementById('online-users-popup');
    if (onlinePopup) onlinePopup.remove();
    
    const popup = document.createElement('div');
    popup.id = 'game-selection-popup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <div class="popup-header">
                    <h3>${userName} কে চ্যালেঞ্জ করুন</h3>
                    <button class="popup-close">×</button>
                </div>
                <div class="popup-body">
                    <div class="game-options">
                        <button onclick="window.sendGameChallenge('${userId}', '${userName}', 'main-quiz')" class="game-option-btn">
                            📚 মেইন কুইজ
                        </button>
                        <button onclick="window.sendGameChallenge('${userId}', '${userName}', 'english-puzzle')" class="game-option-btn">
                            🧩 ইংরেজি পাজল
                        </button>
                        <button onclick="window.sendGameChallenge('${userId}', '${userName}', 'maths-puzzle')" class="game-option-btn">
                            🔢 গণিত পাজল
                        </button>
                        <button onclick="window.sendGameChallenge('${userId}', '${userName}', 'chemistry-quiz')" class="game-option-btn">
                            ⚗️ রসায়ন কুইজ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    popup.querySelector('.popup-close').addEventListener('click', () => popup.remove());
    setTimeout(() => popup.classList.add('show'), 10);
}

window.sendGameChallenge = async function(userId, userName, gameType) {
    alert('Game button clicked: ' + gameType + ' for ' + userName);
    console.log('Sending challenge:', {userId, userName, gameType});
    
    if (!isAuthenticated || !currentUser) {
        showMessage('লগইন করুন!', 'error');
        return;
    }
    
    try {
        console.log('Current user:', currentUser.uid);
        const challengeData = {
            from: currentUser.uid,
            fromName: currentUser.displayName || currentUser.email.split('@')[0],
            to: userId,
            toName: userName,
            gameType: gameType,
            status: 'pending',
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };
        
        console.log('Challenge data:', challengeData);
        const challengeRef = await database.ref('gameChallenge').push(challengeData);
        console.log('Challenge sent with ID:', challengeRef.key);
        
        showMessage(`${userName} কে ${getGameName(gameType)} চ্যালেঞ্জ পাঠানো হয়েছে!`, 'success');
        
        // Close popups
        const gamePopup = document.getElementById('game-selection-popup');
        if (gamePopup) gamePopup.remove();
        
        // Listen for acceptance
        listenForChallengeResponse(challengeRef.key, gameType);
    } catch (error) {
        console.error('Error sending challenge:', error);
        showMessage('চ্যালেঞ্জ পাঠাতে সমস্যা: ' + error.message, 'error');
    }
}

function getGameName(gameType) {
    const names = {
        'main-quiz': 'মেইন কুইজ',
        'english-puzzle': 'ইংরেজি পাজল',
        'maths-puzzle': 'গণিত পাজল',
        'chemistry-quiz': 'রসায়ন কুইজ'
    };
    return names[gameType] || gameType;
}

function listenForChallengeResponse(challengeId, gameType) {
    database.ref('gameChallenge/' + challengeId).on('value', (snapshot) => {
        const challenge = snapshot.val();
        if (challenge && challenge.status === 'accepted') {
            showMessage('চ্যালেঞ্জ গ্রহণ করা হয়েছে! গেম শুরু হচ্ছে...', 'success');
            startBattleGame(challengeId, gameType, 'challenger');
            database.ref('gameChallenge/' + challengeId).off();
        }
    });
}

// Listen for incoming challenges
function listenForIncomingChallenges() {
    if (!isAuthenticated || !currentUser) {
        console.log('Not listening for challenges - not authenticated');
        return;
    }
    
    console.log('Setting up challenge listener for user:', currentUser.uid);
    
    database.ref('gameChallenge').orderByChild('to').equalTo(currentUser.uid).on('child_added', (snapshot) => {
        console.log('Challenge received:', snapshot.val());
        const challenge = snapshot.val();
        if (challenge && challenge.status === 'pending') {
            console.log('Showing challenge notification');
            showChallengeNotification(snapshot.key, challenge);
        }
    });
}

function showChallengeNotification(challengeId, challenge) {
    alert('Challenge notification: ' + challenge.fromName + ' challenged you to ' + challenge.gameType);
    console.log('Creating challenge notification for:', challenge);
    
    const notification = document.createElement('div');
    notification.className = 'challenge-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>⚔️ গেম চ্যালেঞ্জ!</h4>
            <p>${challenge.fromName} আপনাকে ${getGameName(challenge.gameType)} এ চ্যালেঞ্জ করেছেন</p>
            <div class="notification-actions">
                <button onclick="acceptGameChallenge('${challengeId}', '${challenge.gameType}')" class="btn btn-success">গ্রহণ</button>
                <button onclick="rejectGameChallenge('${challengeId}')" class="btn btn-danger">প্রত্যাখ্যান</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 100);
}

window.acceptGameChallenge = async function(challengeId, gameType) {
    try {
        await database.ref('gameChallenge/' + challengeId).update({status: 'accepted'});
        document.querySelector('.challenge-notification').remove();
        showMessage('চ্যালেঞ্জ গ্রহণ! গেম শুরু হচ্ছে...', 'success');
        startBattleGame(challengeId, gameType, 'opponent');
    } catch (error) {
        showMessage('সমস্যা হয়েছে!', 'error');
    }
}

window.rejectGameChallenge = async function(challengeId) {
    await database.ref('gameChallenge/' + challengeId).update({status: 'rejected'});
    document.querySelector('.challenge-notification').remove();
    showMessage('চ্যালেঞ্জ প্রত্যাখ্যান করা হয়েছে!', 'success');
}

let currentBattleId = null;
let battleRole = null;

function startBattleGame(challengeId, gameType, role) {
    currentBattleId = challengeId;
    battleRole = role;
    isBattleMode = true;
    
    hideAllScreens();
    
    // Start the appropriate game
    switch(gameType) {
        case 'main-quiz':
            document.getElementById('start-screen').style.display = 'block';
            document.getElementById('student-name').value = currentUser.displayName || currentUser.email.split('@')[0];
            break;
        case 'english-puzzle':
            document.getElementById('english-screen').style.display = 'block';
            if (typeof initializeEnglishPuzzle === 'function') initializeEnglishPuzzle();
            break;
        case 'maths-puzzle':
            document.getElementById('maths-screen').style.display = 'block';
            if (typeof initializeMathsPuzzle === 'function') initializeMathsPuzzle();
            break;
        case 'chemistry-quiz':
            document.getElementById('chemistry-screen').style.display = 'block';
            if (typeof initializeChemistryQuiz === 'function') initializeChemistryQuiz();
            break;
    }
}



let isBattleMode = false;

// Override quiz completion to handle battle results
const originalSaveScore = window.saveScoreToLeaderboard;
window.saveScoreToLeaderboard = async function(score, totalQuestions, setIndex) {
    if (isBattleMode && currentBattleId) {
        await saveBattleResult(score, totalQuestions);
        isBattleMode = false;
    } else if (originalSaveScore) {
        return originalSaveScore(score, totalQuestions, setIndex);
    }
};

async function saveBattleResult(score, totalQuestions) {
    const percentage = Math.round((score / totalQuestions) * 100);
    
    try {
        // Save battle result
        await database.ref('battleResults').push({
            challengeId: currentBattleId,
            player: currentUser.uid,
            playerName: currentUser.displayName || currentUser.email.split('@')[0],
            score: score,
            percentage: percentage,
            totalQuestions: totalQuestions,
            role: battleRole,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        });
        
        // Check if opponent finished
        setTimeout(() => checkBattleCompletion(), 2000);
        
    } catch (error) {
        console.error('Error saving battle result:', error);
    }
}

async function checkBattleCompletion() {
    try {
        const snapshot = await database.ref('battleResults').orderByChild('challengeId').equalTo(currentBattleId).once('value');
        const results = [];
        snapshot.forEach(child => results.push(child.val()));
        
        if (results.length === 2) {
            // Both players finished
            showBattleResults(results);
        } else {
            showMessage('অপেক্ষা করুন... প্রতিপক্ষ খেলছেন', 'info');
            // Wait and check again
            setTimeout(() => checkBattleCompletion(), 3000);
        }
    } catch (error) {
        console.error('Error checking battle completion:', error);
    }
}

function showBattleResults(results) {
    const myResult = results.find(r => r.player === currentUser.uid);
    const opponentResult = results.find(r => r.player !== currentUser.uid);
    
    let winner = 'tie';
    if (myResult.percentage > opponentResult.percentage) winner = 'me';
    else if (opponentResult.percentage > myResult.percentage) winner = 'opponent';
    
    const popup = document.createElement('div');
    popup.id = 'battle-result-popup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <div class="popup-header">
                    <h3>⚔️ ব্যাটল ফলাফল</h3>
                </div>
                <div class="popup-body">
                    <div class="battle-result ${winner}">
                        <h2>${winner === 'me' ? '🏆 আপনি জিতেছেন!' : winner === 'opponent' ? '😔 আপনি হেরেছেন!' : '🤝 বরাবর!'}</h2>
                        <div class="result-comparison">
                            <div class="player-result">
                                <h4>আপনি</h4>
                                <div class="score">${myResult.percentage}%</div>
                                <p>${myResult.score}/${myResult.totalQuestions}</p>
                            </div>
                            <div class="vs">VS</div>
                            <div class="player-result">
                                <h4>${opponentResult.playerName}</h4>
                                <div class="score">${opponentResult.percentage}%</div>
                                <p>${opponentResult.score}/${opponentResult.totalQuestions}</p>
                            </div>
                        </div>
                        <button onclick="closeBattleResult()" class="btn btn-primary">ঠিক আছে</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    setTimeout(() => popup.classList.add('show'), 10);
    
    // Update battle stats
    updateBattleStats(winner);
}

window.closeBattleResult = function() {
    document.getElementById('battle-result-popup').remove();
    currentBattleId = null;
    battleRole = null;
    hideAllScreens();
    document.getElementById('welcome-screen').style.display = 'block';
}

async function updateBattleStats(result) {
    try {
        const userRef = database.ref('users/' + currentUser.uid + '/battleStats');
        const snapshot = await userRef.once('value');
        const stats = snapshot.val() || {played: 0, won: 0, lost: 0, tied: 0};
        
        stats.played++;
        if (result === 'me') stats.won++;
        else if (result === 'opponent') stats.lost++;
        else stats.tied++;
        
        await userRef.set(stats);
    } catch (error) {
        console.error('Error updating battle stats:', error);
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (isAuthenticated) {
            checkDailyChallenge();
            updateUserOnlineStatus(true);
            listenForIncomingChallenges();
        }
    }, 2000);
    
    // Update online status when user becomes active/inactive
    document.addEventListener('visibilitychange', () => {
        if (isAuthenticated) {
            updateUserOnlineStatus(!document.hidden);
        }
    });
    
    // Update status on page unload
    window.addEventListener('beforeunload', () => {
        if (isAuthenticated) {
            updateUserOnlineStatus(false);
        }
    });
});
