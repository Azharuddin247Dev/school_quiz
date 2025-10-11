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
                            <div class="stat-label">Rank</div>
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
    // Beginner Achievements
    { id: 'first_quiz', name: 'প্রথম কুইজ', desc: 'প্রথম কুইজ সম্পন্ন করুন', icon: '🎯', condition: (stats) => stats.totalGames >= 1, category: 'beginner' },
    { id: 'first_win', name: 'প্রথম জয়', desc: '৫০% এর বেশি স্কোর করুন', icon: '🥉', condition: (stats) => stats.bestScore >= 50, category: 'beginner' },
    { id: 'early_bird', name: 'প্রাথমিক পাখি', desc: '৩টি কুইজ সম্পন্ন করুন', icon: '🐦', condition: (stats) => stats.totalGames >= 3, category: 'beginner' },
    
    // Score Achievements
    { id: 'good_score', name: 'ভালো স্কোর', desc: '৭০% এর বেশি স্কোর করুন', icon: '👍', condition: (stats) => stats.bestScore >= 70, category: 'score' },
    { id: 'high_scorer', name: 'উচ্চ স্কোরার', desc: '৯০% এর বেশি স্কোর করুন', icon: '⭐', condition: (stats) => stats.bestScore >= 90, category: 'score' },
    { id: 'perfect_score', name: 'নিখুঁত স্কোর', desc: '১০০% স্কোর অর্জন করুন', icon: '💯', condition: (stats) => stats.bestScore >= 100, category: 'score' },
    { id: 'super_scorer', name: 'সুপার স্কোরার', desc: '৯৫% এর বেশি গড় স্কোর', icon: '🌟', condition: (stats) => stats.avgPercentage >= 95, category: 'score' },
    
    // Progress Achievements
    { id: 'quiz_player', name: 'কুইজ খেলোয়াড়', desc: '৫টি কুইজ সম্পন্ন করুন', icon: '🎮', condition: (stats) => stats.totalGames >= 5, category: 'progress' },
    { id: 'quiz_master', name: 'কুইজ মাস্টার', desc: '১০টি কুইজ সম্পন্ন করুন', icon: '🏆', condition: (stats) => stats.totalGames >= 10, category: 'progress' },
    { id: 'quiz_expert', name: 'কুইজ বিশেষজ্ঞ', desc: '২৫টি কুইজ সম্পন্ন করুন', icon: '🎓', condition: (stats) => stats.totalGames >= 25, category: 'progress' },
    { id: 'quiz_legend', name: 'কুইজ কিংবদন্তি', desc: '৫০টি কুইজ সম্পন্ন করুন', icon: '👑', condition: (stats) => stats.totalGames >= 50, category: 'progress' },
    { id: 'quiz_champion', name: 'কুইজ চ্যাম্পিয়ন', desc: '১০০টি কুইজ সম্পন্ন করুন', icon: '🏅', condition: (stats) => stats.totalGames >= 100, category: 'progress' },
    
    // Consistency Achievements
    { id: 'consistent', name: 'ধারাবাহিক', desc: '৫টি কুইজে পরপর ৮০%+ স্কোর', icon: '🔥', condition: (stats) => stats.streak >= 5, category: 'consistency' },
    { id: 'unstoppable', name: 'অপ্রতিরোধ্য', desc: '১০টি কুইজে পরপর ৮০%+ স্কোর', icon: '⚡', condition: (stats) => stats.streak >= 10, category: 'consistency' },
    { id: 'perfectionist', name: 'পূর্ণতাবাদী', desc: '৩টি কুইজে পরপর ১০০% স্কোর', icon: '💎', condition: (stats) => stats.perfectStreak >= 3, category: 'consistency' },
    
    // Ranking Achievements
    { id: 'top_50', name: 'শীর্ষ ৫০', desc: 'লিডারবোর্ডে শীর্ষ ৫০ এ থাকুন', icon: '🥇', condition: (stats) => stats.rank <= 50 && stats.rank > 0, category: 'ranking' },
    { id: 'top_20', name: 'শীর্ষ ২০', desc: 'লিডারবোর্ডে শীর্ষ ২০ এ থাকুন', icon: '🏆', condition: (stats) => stats.rank <= 20 && stats.rank > 0, category: 'ranking' },
    { id: 'top_10', name: 'শীর্ষ ১০', desc: 'লিডারবোর্ডে শীর্ষ ১০ এ থাকুন', icon: '👑', condition: (stats) => stats.rank <= 10 && stats.rank > 0, category: 'ranking' },
    { id: 'top_5', name: 'শীর্ষ ৫', desc: 'লিডারবোর্ডে শীর্ষ ৫ এ থাকুন', icon: '💫', condition: (stats) => stats.rank <= 5 && stats.rank > 0, category: 'ranking' },
    { id: 'number_one', name: 'এক নম্বর', desc: 'লিডারবোর্ডে ১ম স্থান অধিকার করুন', icon: '🌟', condition: (stats) => stats.rank === 1, category: 'ranking' },
    
    // Special Achievements
    { id: 'explorer', name: 'অভিযাত্রী', desc: 'সব ধরনের গেম খেলুন', icon: '🗺️', condition: (stats) => stats.gamesPlayed && Object.keys(stats.gamesPlayed).length >= 4, category: 'special' },
    { id: 'speed_demon', name: 'গতির দানব', desc: 'স্পিড চ্যালেঞ্জ সম্পন্ন করুন', icon: '🏃', condition: (stats) => stats.challengesCompleted && stats.challengesCompleted.speed > 0, category: 'special' },
    { id: 'marathon_runner', name: 'ম্যারাথন দৌড়বিদ', desc: 'ম্যারাথন চ্যালেঞ্জ সম্পন্ন করুন', icon: '🏃‍♂️', condition: (stats) => stats.challengesCompleted && stats.challengesCompleted.marathon > 0, category: 'special' },
    { id: 'daily_player', name: 'দৈনিক খেলোয়াড়', desc: '৭ দিন পরপর খেলুন', icon: '📅', condition: (stats) => stats.dailyStreak >= 7, category: 'special' },
    { id: 'night_owl', name: 'রাতের পেঁচা', desc: 'রাত ১২টার পর খেলুন', icon: '🦉', condition: (stats) => stats.nightGames >= 1, category: 'special' },
    { id: 'early_riser', name: 'ভোরের পাখি', desc: 'সকাল ৬টার আগে খেলুন', icon: '🌅', condition: (stats) => stats.morningGames >= 1, category: 'special' },
    
    // Score Milestones
    { id: 'score_100', name: '১০০ পয়েন্ট', desc: 'মোট ১০০ পয়েন্ট অর্জন করুন', icon: '💰', condition: (stats) => stats.totalScore >= 100, category: 'milestone' },
    { id: 'score_500', name: '৫০০ পয়েন্ট', desc: 'মোট ৫০০ পয়েন্ট অর্জন করুন', icon: '💎', condition: (stats) => stats.totalScore >= 500, category: 'milestone' },
    { id: 'score_1000', name: '১০০০ পয়েন্ট', desc: 'মোট ১০০০ পয়েন্ট অর্জন করুন', icon: '🏆', condition: (stats) => stats.totalScore >= 1000, category: 'milestone' },
    { id: 'score_2500', name: '২৫০০ পয়েন্ট', desc: 'মোট ২৫০০ পয়েন্ট অর্জন করুন', icon: '👑', condition: (stats) => stats.totalScore >= 2500, category: 'milestone' }
];

async function showAchievements() {
    if (!isAuthenticated) {
        showMessage('অর্জন দেখতে লগইন করুন!', 'error');
        return;
    }
    
    const userStats = await getUserStats();
    const unlockedAchievements = achievements.filter(a => a.condition(userStats));
    
    // Group achievements by category
    const categories = {
        beginner: { name: '🌱 শুরুর অর্জন', achievements: [] },
        score: { name: '🎯 স্কোর অর্জন', achievements: [] },
        progress: { name: '📈 অগ্রগতি অর্জন', achievements: [] },
        consistency: { name: '🔥 ধারাবাহিকতা অর্জন', achievements: [] },
        ranking: { name: '🏆 র‍্যাঙ্কিং অর্জন', achievements: [] },
        special: { name: '⭐ বিশেষ অর্জন', achievements: [] },
        milestone: { name: '💎 মাইলফলক অর্জন', achievements: [] }
    };
    
    achievements.forEach(achievement => {
        const unlocked = unlockedAchievements.includes(achievement);
        categories[achievement.category].achievements.push({...achievement, unlocked});
    });
    
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
                        <div class="summary-stats">
                            <div class="stat-item">
                                <span class="stat-number">${unlockedAchievements.length}</span>
                                <span class="stat-label">আনলক</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${achievements.length - unlockedAchievements.length}</span>
                                <span class="stat-label">বাকি</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">${Math.round((unlockedAchievements.length / achievements.length) * 100)}%</span>
                                <span class="stat-label">সম্পন্ন</span>
                            </div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${(unlockedAchievements.length / achievements.length) * 100}%"></div>
                        </div>
                    </div>
                    
                    <div class="achievement-categories">
                        ${Object.entries(categories).map(([key, category]) => `
                            <div class="achievement-category">
                                <h4 class="category-title">${category.name}</h4>
                                <div class="achievements-grid">
                                    ${category.achievements.map(achievement => `
                                        <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                                            <div class="achievement-icon">${achievement.icon}</div>
                                            <div class="achievement-info">
                                                <h5>${achievement.name}</h5>
                                                <p>${achievement.desc}</p>
                                            </div>
                                            ${achievement.unlocked ? '<div class="unlock-badge">✓</div>' : '<div class="lock-badge">🔒</div>'}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
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
                <div class="challenge-card" onclick="startSpeedChallenge()">
                    <div class="challenge-icon">⏱️</div>
                    <h3>স্পিড চ্যালেঞ্জ</h3>
                    <p>১০ সেকেন্ডে উত্তর দিন</p>
                    <div class="challenge-reward">🏆 ২x পয়েন্ট</div>
                </div>
                
                <div class="challenge-card" onclick="startPerfectChallenge()">
                    <div class="challenge-icon">💯</div>
                    <h3>পারফেক্ট চ্যালেঞ্জ</h3>
                    <p>একটি ভুল = গেম শেষ</p>
                    <div class="challenge-reward">🏆 ৩x পয়েন্ট</div>
                </div>
                
                <div class="challenge-card" onclick="startMarathonChallenge()">
                    <div class="challenge-icon">🏃</div>
                    <h3>ম্যারাথন চ্যালেঞ্জ</h3>
                    <p>৫০টি প্রশ্ন একসাথে</p>
                    <div class="challenge-reward">🏆 ৫x পয়েন্ট</div>
                </div>
            </div>
            
            <button onclick="backToWelcome()" class="btn btn-secondary">
                ফিরে যান
            </button>
        </div>
    `;
    
    document.querySelector('.main-content').appendChild(challengeScreen);
    challengeScreen.style.display = 'block';
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

function backToWelcome() {
    const screen = document.getElementById('challenge-screen');
    if (screen) screen.remove();
    hideAllScreens();
    document.getElementById('welcome-screen').style.display = 'block';
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

// Online Users
async function showOnlineUsers() {
    if (!isAuthenticated) {
        showMessage('অনলাইন ব্যবহারকারী দেখতে লগইন করুন!', 'error');
        return;
    }
    
    try {
        const snapshot = await database.ref('onlineUsers').once('value');
        const onlineUsers = [];
        const now = Date.now();
        
        snapshot.forEach(child => {
            const user = child.val();
            if (child.key !== currentUser.uid && user && user.timestamp && (now - user.timestamp < 300000)) {
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

// Make functions globally accessible
window.showOnlineUsers = showOnlineUsers;
window.showProfile = showProfile;
window.showAchievements = showAchievements;
window.showChallengeMode = showChallengeMode;

// Debug function to check variables
window.debugChallenge = function() {
    console.log('=== CHALLENGE DEBUG ===');
    console.log('currentUser (window):', window.currentUser?.uid);
    console.log('currentUser (global):', typeof currentUser !== 'undefined' ? currentUser?.uid : 'undefined');
    console.log('isAuthenticated (window):', window.isAuthenticated);
    console.log('isAuthenticated (global):', typeof isAuthenticated !== 'undefined' ? isAuthenticated : 'undefined');
    console.log('database (window):', typeof window.database);
    console.log('database (global):', typeof database);
    console.log('firebase:', typeof firebase);
    
    // Try to fix missing variables
    if (!window.currentUser && typeof currentUser !== 'undefined') {
        window.currentUser = currentUser;
        console.log('✅ Fixed window.currentUser');
    }
    if (!window.isAuthenticated && typeof isAuthenticated !== 'undefined') {
        window.isAuthenticated = isAuthenticated;
        console.log('✅ Fixed window.isAuthenticated');
    }
    if (!window.database && typeof database !== 'undefined') {
        window.database = database;
        console.log('✅ Fixed window.database');
    }
};

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners for header buttons
    const leaderboardBtn = document.querySelector('.leaderboard-btn');
    if (leaderboardBtn) leaderboardBtn.addEventListener('click', () => window.showGlobalLeaderboard());
    
    const profileBtn = document.querySelector('.profile-btn');
    if (profileBtn) profileBtn.addEventListener('click', showProfile);
    
    const achievementBtn = document.querySelector('.achievement-btn');
    if (achievementBtn) achievementBtn.addEventListener('click', showAchievements);
    
    const onlineUsersBtn = document.querySelector('.online-users-btn');
    if (onlineUsersBtn) onlineUsersBtn.addEventListener('click', showOnlineUsers);
    
    const authButton = document.querySelector('#auth-button span');
    if (authButton) authButton.addEventListener('click', () => window.showAuthScreen());
    
    const updateBtn = document.querySelector('.update-btn');
    if (updateBtn) updateBtn.addEventListener('click', () => window.showUpdates());
    
    // Add event listeners for navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            if (action && window[action]) {
                window[action]();
            }
        });
    });
    
    // Check authentication status periodically
    setInterval(() => {
        if (isAuthenticated && currentUser) {
            updateUserOnlineStatus(true);
        }
    }, 30000); // Update every 30 seconds
    
    // Start enhanced features when Firebase is ready
    setTimeout(() => {
        console.log('🚀 Starting enhanced features...');
        window.debugChallenge();
        
        if (firebase && firebase.auth && firebase.database) {
            const user = firebase.auth().currentUser;
            if (user) {
                console.log('✅ User authenticated');
                
                // Ensure global variables are set
                if (!window.currentUser) window.currentUser = user;
                if (!window.isAuthenticated) window.isAuthenticated = true;
                if (!window.database) window.database = firebase.database();
            } else {
                console.log('⚠️ No user authenticated yet');
            }
        }
    }, 2000);
    
    // Keep trying to set global variables
    setInterval(() => {
        if (firebase && firebase.auth) {
            const user = firebase.auth().currentUser;
            if (user) {
                // Ensure global variables are set
                if (!window.currentUser) window.currentUser = user;
                if (!window.isAuthenticated) window.isAuthenticated = true;
                if (!window.database) window.database = firebase.database();
            }
        }
    }, 5000);
    
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
    
    // Close popups when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('popup-overlay')) {
            const popup = e.target.closest('#profile-popup, #achievement-popup, #online-users-popup');
            if (popup) {
                popup.classList.remove('show');
                setTimeout(() => popup.remove(), 300);
            }
        }
    });
});
