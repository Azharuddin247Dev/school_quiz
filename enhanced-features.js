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
            
            // Sort all best scores in descending order
            const sortedScores = Object.values(userBestScores).sort((a, b) => b - a);
            
            // Find current user's rank (1-based)
            rank = sortedScores.indexOf(bestScore) + 1;
        }
        
        return { totalGames, totalScore, avgPercentage, bestScore, streak, rank };
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

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        if (isAuthenticated) {
            checkDailyChallenge();
        }
    }, 2000);
});
