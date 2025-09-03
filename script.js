// গ্লোবাল ভেরিয়েবল
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let studentName = '';
let selectedClass = '';
let selectedSubject = '';
let totalQuestions = 10;
let timer = 30;
let timerInterval = null;
let userAnswers = [];
let subjectScores = {};

// পার্টিকেল সিস্টেম ইনিশিয়ালাইজেশন
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// পেজ লোড হলে পার্টিকেল সিস্টেম চালু করা
document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    
    // বাটনে রিপল ইফেক্ট যোগ করা
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-primary')) {
            const ripple = e.target.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.width = '0';
                ripple.style.height = '0';
                setTimeout(() => {
                    ripple.style.width = '300px';
                    ripple.style.height = '300px';
                }, 10);
            }
        }
    });
});

// কুইজ শুরু করার ফাংশন
function startQuiz() {
    // Check if questionBank is loaded
    if (typeof questionBank === 'undefined') {
        alert('প্রশ্ন লোড হচ্ছে না! পেজ রিফ্রেশ করুন।');
        return;
    }
    
    // ইনপুট ভ্যালিডেশন
    studentName = document.getElementById('student-name').value.trim();
    totalQuestions = parseInt(document.getElementById('question-count').value);
    
    if (!studentName) {
        // কাস্টম অ্যালার্ট ইফেক্ট
        const nameInput = document.getElementById('student-name');
        nameInput.style.borderColor = '#ff6b6b';
        nameInput.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            nameInput.style.borderColor = '';
            nameInput.style.animation = '';
        }, 500);
        alert('দয়া করে আপনার নাম লিখুন!');
        return;
    }
    
    // সব বিষয় মিশ্রিত মোড সেট করা
    selectedSubject = 'mixed';
    selectedClass = 'all'; // সব শ্রেণীর প্রশ্ন
    
    // প্রশ্ন প্রস্তুত করা
    prepareQuestions();
    
    if (currentQuestions.length === 0) {
        alert('কোনো প্রশ্ন পাওয়া যায়নি!');
        return;
    }
    
    // স্ক্রিন পরিবর্তন
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    
    // প্রথম প্রশ্ন লোড
    loadQuestion();
}

// প্রশ্ন প্রস্তুত করার ফাংশন
function prepareQuestions() {
    currentQuestions = [];
    subjectScores = {};
    
    // Check if questionBank exists
    if (typeof questionBank === 'undefined') {
        console.error('questionBank is not defined');
        return;
    }
    
    // সব বিষয় ও সব শ্রেণী থেকে প্রশ্ন নেওয়া
    const subjects = ['history', 'geography', 'physical_science', 'life_science', 'english', 'bengali'];
    const classes = [5, 6, 7, 8];
    
    subjects.forEach(subject => {
        subjectScores[subject] = { correct: 0, total: 0 };
        
        classes.forEach(classNum => {
            if (questionBank[subject] && questionBank[subject][classNum]) {
                const subjectQuestions = questionBank[subject][classNum];
                subjectQuestions.forEach(q => {
                    q.subject = subject;
                    q.class = classNum;
                    currentQuestions.push(q);
                });
            }
        });
    });
    
    console.log('Total questions found:', currentQuestions.length);
    
    // প্রশ্ন শাফল করা এবং নির্দিষ্ট সংখ্যক নেওয়া
    currentQuestions = shuffleArray(currentQuestions).slice(0, totalQuestions);
    totalQuestions = currentQuestions.length;
    
    console.log('Questions prepared:', totalQuestions);
}

// র‍্যান্ডম প্রশ্ন নির্বাচন
function getRandomQuestions(questions, count) {
    const shuffled = shuffleArray([...questions]);
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// অ্যারে শাফল করার ফাংশন
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// প্রশ্ন লোড করার ফাংশন
function loadQuestion() {
    if (currentQuestionIndex >= currentQuestions.length) {
        showResults();
        return;
    }
    
    const question = currentQuestions[currentQuestionIndex];
    
    // প্রশ্ন আপডেট
    document.getElementById('question').textContent = question.question;
    
    // প্রগ্রেস আপডেট
    updateProgress();
    
    // অপশন তৈরি
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.textContent = option;
        optionDiv.onclick = () => selectOption(index);
        
        // স্ট্যাগার্ড অ্যানিমেশন
        optionDiv.style.opacity = '0';
        optionDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            optionDiv.style.transition = 'all 0.3s ease';
            optionDiv.style.opacity = '1';
            optionDiv.style.transform = 'translateY(0)';
        }, index * 100);
        
        optionsContainer.appendChild(optionDiv);
    });
    
    // টাইমার শুরু
    startTimer();
}

// অপশন নির্বাচন
function selectOption(selectedIndex) {
    clearInterval(timerInterval);
    
    const question = currentQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.option');
    
    // ক্লিক ইফেক্ট যোগ করা
    options[selectedIndex].style.transform = 'scale(0.95)';
    setTimeout(() => {
        options[selectedIndex].style.transform = '';
    }, 150);
    
    // সঠিক উত্তর দেখানো
    options[question.correct].classList.add('correct');
    
    // ভুল উত্তর দেখানো
    if (selectedIndex !== question.correct) {
        options[selectedIndex].classList.add('incorrect');
    }
    
    // স্কোর আপডেট
    const isCorrect = selectedIndex === question.correct;
    if (isCorrect) {
        score++;
        if (subjectScores[question.subject]) {
            subjectScores[question.subject].correct++;
        }
    }
    
    if (subjectScores[question.subject]) {
        subjectScores[question.subject].total++;
    }
    
    // উত্তর সংরক্ষণ
    userAnswers.push({
        question: question.question,
        options: question.options,
        correctAnswer: question.correct,
        userAnswer: selectedIndex,
        isCorrect: isCorrect,
        explanation: question.explanation,
        subject: question.subject
    });
    
    // পরবর্তী প্রশ্নে যাওয়া
    setTimeout(() => {
        currentQuestionIndex++;
        loadQuestion();
    }, 2000);
}

// প্রশ্ন এড়িয়ে যাওয়া
function skipQuestion() {
    clearInterval(timerInterval);
    
    const question = currentQuestions[currentQuestionIndex];
    
    // স্কোর আপডেট (এড়িয়ে গেলে ভুল হিসেবে গণ্য)
    if (subjectScores[question.subject]) {
        subjectScores[question.subject].total++;
    }
    
    // উত্তর সংরক্ষণ
    userAnswers.push({
        question: question.question,
        options: question.options,
        correctAnswer: question.correct,
        userAnswer: -1, // -1 মানে এড়িয়ে গেছে
        isCorrect: false,
        explanation: question.explanation,
        subject: question.subject
    });
    
    currentQuestionIndex++;
    loadQuestion();
}

// টাইমার শুরু
function startTimer() {
    timer = 30;
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timer--;
        updateTimerDisplay();
        
        if (timer <= 0) {
            clearInterval(timerInterval);
            skipQuestion(); // সময় শেষ হলে এড়িয়ে যাওয়া
        }
    }, 1000);
}

// টাইমার ডিসপ্লে আপডেট
function updateTimerDisplay() {
    document.getElementById('timer-text').textContent = timer;
    const percentage = (timer / 30) * 100;
    document.getElementById('timer-bar').style.setProperty('--width', percentage + '%');
    
    // রঙ পরিবর্তন
    const timerBar = document.getElementById('timer-bar');
    if (timer <= 10) {
        timerBar.style.background = `conic-gradient(#ff6b6b ${percentage}%, #e1e5e9 0)`;
    } else if (timer <= 20) {
        timerBar.style.background = `conic-gradient(#ffc107 ${percentage}%, #e1e5e9 0)`;
    } else {
        timerBar.style.background = `conic-gradient(#28a745 ${percentage}%, #e1e5e9 0)`;
    }
}

// প্রগ্রেস আপডেট
function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = progress + '%';
    
    // বাংলা সংখ্যায় কাউন্টার
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const currentNum = (currentQuestionIndex + 1).toString().split('').map(d => bengaliNumbers[parseInt(d)]).join('');
    const totalNum = totalQuestions.toString().split('').map(d => bengaliNumbers[parseInt(d)]).join('');
    
    document.getElementById('question-counter').textContent = `${currentNum} / ${totalNum}`;
}

// ফলাফল দেখানো
function showResults() {
    clearInterval(timerInterval);
    
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
    
    const percentage = Math.round((score / totalQuestions) * 100);
    
    // স্কোর সার্কেল অ্যানিমেশন
    const scoreCircle = document.getElementById('score-circle');
    setTimeout(() => {
        scoreCircle.style.setProperty('--score', percentage + '%');
    }, 500);
    
    // বাংলা সংখ্যায় পার্সেন্টেজ
    const bengaliPercentage = percentage.toString().split('').map(d => {
        const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return bengaliNumbers[parseInt(d)] || d;
    }).join('');
    
    document.getElementById('score-percentage').textContent = bengaliPercentage + '%';
    document.getElementById('student-info').textContent = `অভিনন্দন, ${studentName}!`;
    
    const bengaliScore = score.toString().split('').map(d => {
        const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return bengaliNumbers[parseInt(d)];
    }).join('');
    
    const bengaliTotal = totalQuestions.toString().split('').map(d => {
        const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return bengaliNumbers[parseInt(d)];
    }).join('');
    
    document.getElementById('score-details').textContent = `আপনি ${bengaliTotal}টি প্রশ্নের মধ্যে ${bengaliScore}টি সঠিক উত্তর দিয়েছেন`;
    
    // পারফরম্যান্স ব্যাজ
    const badge = document.getElementById('performance-badge');
    if (percentage >= 90) {
        badge.textContent = '🏆 চমৎকার!';
        badge.className = 'performance-badge badge-excellent';
    } else if (percentage >= 70) {
        badge.textContent = '👍 ভালো!';
        badge.className = 'performance-badge badge-good';
    } else if (percentage >= 50) {
        badge.textContent = '👌 মন্দ নয়!';
        badge.className = 'performance-badge badge-average';
    } else {
        badge.textContent = '💪 আরো চেষ্টা করুন!';
        badge.className = 'performance-badge badge-poor';
    }
    
    // বিষয়ভিত্তিক ফলাফল
    showSubjectBreakdown();
    
    // Track player
    trackPlayer();
}

// বিষয়ভিত্তিক ফলাফল দেখানো
function showSubjectBreakdown() {
    const container = document.getElementById('subject-breakdown');
    let html = '<h3>বিষয়ভিত্তিক ফলাফল:</h3>';
    
    // বিষয়ের নাম ম্যাপিং (যদি questions.js থেকে লোড না হয়)
    const localSubjectNames = {
        history: "ইতিহাস",
        geography: "ভূগোল", 
        physical_science: "ভৌত বিজ্ঞান",
        life_science: "জীবন বিজ্ঞান",
        english: "ইংরেজি",
        bengali: "বাংলা"
    };
    
    const subjectNamesMap = (typeof subjectNames !== 'undefined') ? subjectNames : localSubjectNames;
    
    Object.keys(subjectScores).forEach(subject => {
        const subjectData = subjectScores[subject];
        if (subjectData.total > 0) {
            const subjectPercentage = Math.round((subjectData.correct / subjectData.total) * 100);
            html += `
                <div class="subject-score">
                    <span class="subject-name">${subjectNamesMap[subject] || subject}:</span>
                    <span class="subject-result">${subjectData.correct}/${subjectData.total} (${subjectPercentage}%)</span>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
}

// উত্তর দেখানো
function showAnswers() {
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'block';
    
    const container = document.getElementById('answer-list');
    let html = '';
    
    userAnswers.forEach((answer, index) => {
        const questionNum = (index + 1).toString().split('').map(d => {
            const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            return bengaliNumbers[parseInt(d)];
        }).join('');
        
        html += `
            <div class="answer-item ${answer.isCorrect ? 'correct-answer' : 'incorrect-answer'}">
                <div class="answer-header">
                    <span class="question-number">প্রশ্ন ${questionNum}</span>
                    <span class="subject-tag">${(typeof subjectNames !== 'undefined' ? subjectNames[answer.subject] : answer.subject) || 'অজানা বিষয়'}</span>
                </div>
                <div class="question-text">${answer.question}</div>
                <div class="answer-options">
                    ${answer.options.map((option, i) => `
                        <div class="answer-option ${i === answer.correctAnswer ? 'correct-option' : ''} ${i === answer.userAnswer ? 'user-option' : ''}">
                            ${option} ${i === answer.correctAnswer ? '✓' : ''} ${i === answer.userAnswer && i !== answer.correctAnswer ? '✗' : ''}
                        </div>
                    `).join('')}
                </div>
                <div class="explanation">
                    <strong>ব্যাখ্যা:</strong> ${answer.explanation}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ফলাফলে ফিরে যাওয়া
function backToResults() {
    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'block';
}

// কুইজ পুনরায় শুরু
function restartQuiz() {
    // সব ভেরিয়েবল রিসেট
    currentQuestions = [];
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    subjectScores = {};
    clearInterval(timerInterval);
    
    // স্ক্রিন রিসেট
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    
    // ফর্ম রিসেট
    document.getElementById('student-name').value = '';
    document.getElementById('question-count').value = '10';
}

// কুইজ বন্ধ করা
function quitQuiz() {
    if (confirm('আপনি কি সত্যিই কুইজ বন্ধ করতে চান?')) {
        restartQuiz();
    }
}

// Track who played
function trackPlayer() {
    const players = JSON.parse(localStorage.getItem('allPlayers') || '[]');
    players.push({
        name: studentName,
        score: score,
        total: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString()
    });
    localStorage.setItem('allPlayers', JSON.stringify(players));
}

// Show all players (double-click footer)
function showAllPlayers() {
    const players = JSON.parse(localStorage.getItem('allPlayers') || '[]');
    if (players.length === 0) {
        showDynamicPopup('কেউ এখনো খেলেনি!', []);
        return;
    }
    
    showDynamicPopup('খেলোয়াড়দের তালিকা', players);
}

// Dynamic popup function
function showDynamicPopup(title, players) {
    // Remove existing popup
    const existingPopup = document.getElementById('dynamic-popup');
    if (existingPopup) existingPopup.remove();
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'dynamic-popup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content">
                <div class="popup-header">
                    <h3>${title}</h3>
                    <button class="popup-close" onclick="closeDynamicPopup()">×</button>
                </div>
                <div class="popup-body">
                    ${players.length === 0 ? '<p class="no-players">কেউ এখনো খেলেনি!</p>' : 
                      players.map((p, i) => `
                        <div class="player-item ${i === 0 ? 'top-player' : ''}">
                            <div class="player-rank">${i + 1}</div>
                            <div class="player-info">
                                <div class="player-name">${p.name}</div>
                                <div class="player-details">${p.date} ${p.time}</div>
                            </div>
                            <div class="player-score">${p.percentage}%</div>
                        </div>
                      `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add animation
    setTimeout(() => popup.classList.add('show'), 10);
}

// Close popup
function closeDynamicPopup() {
    const popup = document.getElementById('dynamic-popup');
    if (popup) {
        popup.classList.remove('show');
        setTimeout(() => popup.remove(), 300);
    }
}

// English Puzzle Game
const englishWords = [
    {word: 'COMPUTER', clue: 'Electronic device for processing data', blank: 'C_MP_T_R'},
    {word: 'ELEPHANT', clue: 'Large mammal with trunk', blank: '_L_PH_NT'},
    {word: 'RAINBOW', clue: 'Colorful arc in sky after rain', blank: 'R_INB_W'},
    {word: 'BICYCLE', clue: 'Two-wheeled vehicle', blank: 'B_CY_LE'},
    {word: 'KITCHEN', clue: 'Room for cooking', blank: 'K_TCH_N'}
];

let currentEnglishWord = null;

function startEnglishPuzzle() {
    hideAllScreens();
    document.getElementById('english-screen').style.display = 'block';
    nextEnglishWord();
}

function nextEnglishWord() {
    currentEnglishWord = englishWords[Math.floor(Math.random() * englishWords.length)];
    document.getElementById('english-clue').textContent = currentEnglishWord.clue;
    document.getElementById('english-word').textContent = currentEnglishWord.blank;
    document.getElementById('english-answer').value = '';
    document.getElementById('english-result').textContent = '';
    document.getElementById('english-result').className = 'result-message';
}

function checkEnglishAnswer() {
    const answer = document.getElementById('english-answer').value.trim().toUpperCase();
    const resultDiv = document.getElementById('english-result');
    
    if (answer === currentEnglishWord.word) {
        resultDiv.textContent = '🎉 Correct! Well done!';
        resultDiv.className = 'result-message result-correct';
    } else {
        resultDiv.textContent = `❌ Wrong! The correct answer is: ${currentEnglishWord.word}`;
        resultDiv.className = 'result-message result-incorrect';
    }
}

function exitEnglishPuzzle() {
    hideAllScreens();
    document.getElementById('welcome-screen').style.display = 'block';
}

// Maths Puzzle Game
let currentMathsProblem = null;

function startMathsPuzzle() {
    hideAllScreens();
    document.getElementById('maths-screen').style.display = 'block';
    nextMathsProblem();
}

function nextMathsProblem() {
    const num1 = Math.floor(Math.random() * 16) + 5; // 5-20
    const num2 = Math.floor(Math.random() * 16) + 5; // 5-20
    currentMathsProblem = {num1, num2, answer: num1 * num2};
    
    document.getElementById('maths-problem').textContent = `${num1} × ${num2} = ?`;
    document.getElementById('maths-answer').value = '';
    document.getElementById('maths-result').textContent = '';
    document.getElementById('maths-result').className = 'result-message';
}

function checkMathsAnswer() {
    const answer = parseInt(document.getElementById('maths-answer').value);
    const resultDiv = document.getElementById('maths-result');
    
    if (answer === currentMathsProblem.answer) {
        resultDiv.textContent = '🎉 Correct! Great job!';
        resultDiv.className = 'result-message result-correct';
    } else {
        resultDiv.textContent = `❌ Wrong! The correct answer is: ${currentMathsProblem.answer}`;
        resultDiv.className = 'result-message result-incorrect';
    }
}

function exitMathsPuzzle() {
    hideAllScreens();
    document.getElementById('welcome-screen').style.display = 'block';
}

// Chemistry Quiz Game
const elements = [
    {name: 'Oxygen', symbol: 'O'},
    {name: 'Carbon', symbol: 'C'},
    {name: 'Hydrogen', symbol: 'H'},
    {name: 'Nitrogen', symbol: 'N'},
    {name: 'Iron', symbol: 'Fe'},
    {name: 'Gold', symbol: 'Au'},
    {name: 'Silver', symbol: 'Ag'},
    {name: 'Sodium', symbol: 'Na'},
    {name: 'Calcium', symbol: 'Ca'},
    {name: 'Helium', symbol: 'He'}
];

let currentElement = null;

function startChemistryQuiz() {
    hideAllScreens();
    document.getElementById('chemistry-screen').style.display = 'block';
    nextChemistryElement();
}

function nextChemistryElement() {
    currentElement = elements[Math.floor(Math.random() * elements.length)];
    document.getElementById('chemistry-element').textContent = currentElement.name;
    document.getElementById('chemistry-answer').value = '';
    document.getElementById('chemistry-result').textContent = '';
    document.getElementById('chemistry-result').className = 'result-message';
}

function checkChemistryAnswer() {
    const answer = document.getElementById('chemistry-answer').value.trim();
    const resultDiv = document.getElementById('chemistry-result');
    
    if (answer === currentElement.symbol) {
        resultDiv.textContent = '🎉 Correct! Excellent!';
        resultDiv.className = 'result-message result-correct';
    } else {
        resultDiv.textContent = `❌ Wrong! The correct symbol for ${currentElement.name} is: ${currentElement.symbol} (Case sensitive!)`;
        resultDiv.className = 'result-message result-incorrect';
    }
}

function exitChemistryQuiz() {
    hideAllScreens();
    document.getElementById('welcome-screen').style.display = 'block';
}

// Helper function
function hideAllScreens() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('english-screen').style.display = 'none';
    document.getElementById('maths-screen').style.display = 'none';
    document.getElementById('chemistry-screen').style.display = 'none';
}

function showStartScreen() {
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    document.getElementById('quiz-screen').style.display = 'none';
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'none';
}

// Add double-click to footer
document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('.footer-creator-name');
    if (footer) footer.addEventListener('dblclick', showAllPlayers);
});

// শেক অ্যানিমেশন CSS যোগ করা
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
