// গ্লোবাল ভেরিয়েবল
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let studentName = '';
let selectedClass = '';
let selectedSubject = '';
let totalQuestions = 20;
let timer = 30;
let timerInterval = null;
let userAnswers = [];
let subjectScores = {};

// Quiz set management
let allQuestions = [];
let questionSets = [];
let currentSetIndex = 0;
let userProgress = JSON.parse(localStorage.getItem('quizProgress')) || {};

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
    initDynamicMessages();
    
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

// Dynamic Messages System
let currentMessageIndex = 0;
let messageInterval = null;

function initDynamicMessages() {
    if (typeof runningMessages === 'undefined' || runningMessages.length === 0) {
        return; // Use default message if no dynamic messages
    }
    
    // Filter active messages and sort by priority
    const activeMessages = runningMessages
        .filter(msg => msg.active)
        .sort((a, b) => a.priority - b.priority);
    
    if (activeMessages.length === 0) {
        return; // Use default message if no active messages
    }
    
    // Start cycling through messages
    cycleMessages(activeMessages);
}

function cycleMessages(messages) {
    const messageElement = document.getElementById('dynamic-message');
    
    function updateMessage() {
        if (messages.length > 0) {
            messageElement.textContent = messages[currentMessageIndex].text;
            currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        }
    }
    
    // Show first message immediately
    updateMessage();
    
    // Cycle through messages every 8 seconds
    messageInterval = setInterval(updateMessage, 8000);
}

// কুইজ শুরু করার ফাংশন
function startQuiz() {
    // Check if questionBank is loaded
    if (typeof questionBank === 'undefined') {
        alert('প্রশ্ন লোড হচ্ছে না! পেজ রিফ্রেশ করুন।');
        return;
    }
    
    // ইনপুট ভ্যালিডেশন
    studentName = document.getElementById('student-name').value.trim();
    
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

// Initialize question sets
function initializeQuestionSets() {
    allQuestions = [];
    
    // Check if questionBank exists
    if (typeof questionBank === 'undefined') {
        console.error('questionBank is not defined');
        return;
    }
    
    // সব বিষয় ও সব শ্রেণী থেকে প্রশ্ন নেওয়া
    const subjects = ['history', 'geography', 'physical_science', 'life_science', 'english', 'bengali'];
    const classes = [5, 6, 7, 8];
    
    subjects.forEach(subject => {
        classes.forEach(classNum => {
            if (questionBank[subject] && questionBank[subject][classNum]) {
                const subjectQuestions = questionBank[subject][classNum];
                subjectQuestions.forEach(q => {
                    q.subject = subject;
                    q.class = classNum;
                    allQuestions.push(q);
                });
            }
        });
    });
    
    // Shuffle all questions once
    allQuestions = shuffleArray(allQuestions);
    
    // Create sets of 20 questions each
    questionSets = [];
    for (let i = 0; i < allQuestions.length; i += 20) {
        questionSets.push(allQuestions.slice(i, i + 20));
    }
    
    console.log(`Total questions: ${allQuestions.length}, Total sets: ${questionSets.length}`);
}

// প্রশ্ন প্রস্তুত করার ফাংশন
function prepareQuestions() {
    // Initialize sets if not done
    if (questionSets.length === 0) {
        initializeQuestionSets();
    }
    
    // Get user's current set index
    const userName = studentName || 'default';
    if (!userProgress[userName]) {
        userProgress[userName] = { currentSet: 0, completedSets: [] };
    }
    
    currentSetIndex = userProgress[userName].currentSet;
    
    // If user completed all sets, start from beginning
    if (currentSetIndex >= questionSets.length) {
        currentSetIndex = 0;
        userProgress[userName].currentSet = 0;
        userProgress[userName].completedSets = [];
    }
    
    // Get current set of questions
    currentQuestions = questionSets[currentSetIndex] || [];
    totalQuestions = currentQuestions.length;
    
    // Initialize subject scores
    subjectScores = {};
    const subjects = ['history', 'geography', 'physical_science', 'life_science', 'english', 'bengali'];
    subjects.forEach(subject => {
        subjectScores[subject] = { correct: 0, total: 0 };
    });
    
    console.log(`Playing Set ${currentSetIndex + 1}/${questionSets.length} with ${totalQuestions} questions`);
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
    
    // সেট ইন্ডিকেটর আপডেট
    updateSetIndicator();
    
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

// সেট ইন্ডিকেটর আপডেট
function updateSetIndicator() {
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const setNumber = (currentSetIndex + 1).toString().split('').map(d => bengaliNumbers[parseInt(d)]).join('');
    const totalSets = questionSets.length.toString().split('').map(d => bengaliNumbers[parseInt(d)]).join('');
    
    const setIndicator = document.getElementById('current-set');
    if (setIndicator) {
        setIndicator.textContent = `সেট ${setNumber}/${totalSets}`;
        
        // অ্যানিমেশন ইফেক্ট
        setIndicator.style.transform = 'scale(1.1)';
        setTimeout(() => {
            setIndicator.style.transform = 'scale(1)';
        }, 300);
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
    
    // Update user progress
    const userName = studentName || 'default';
    if (!userProgress[userName]) {
        userProgress[userName] = { currentSet: 0, completedSets: [] };
    }
    
    // Mark current set as completed
    if (!userProgress[userName].completedSets.includes(currentSetIndex)) {
        userProgress[userName].completedSets.push(currentSetIndex);
    }
    
    // Move to next set
    userProgress[userName].currentSet = currentSetIndex + 1;
    localStorage.setItem('quizProgress', JSON.stringify(userProgress));
    
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
    
    const currentSetNum = (currentSetIndex + 1).toString().split('').map(d => {
        const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return bengaliNumbers[parseInt(d)];
    }).join('');
    
    const totalSets = questionSets.length.toString().split('').map(d => {
        const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        return bengaliNumbers[parseInt(d)];
    }).join('');
    
    document.getElementById('score-details').textContent = `সেট ${currentSetNum}/${totalSets}: আপনি ${bengaliTotal}টি প্রশ্নের মধ্যে ${bengaliScore}টি সঠিক উত্তর দিয়েছেন`;
    
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
    
    // Show next set option
    showNextSetOption();
    
    // Track player
    trackPlayer();
}

// Show next set option
function showNextSetOption() {
    const userName = studentName || 'default';
    const nextSetIndex = userProgress[userName].currentSet;
    
    let nextSetHtml = '';
    
    if (nextSetIndex < questionSets.length) {
        // More sets available
        const nextSetNum = (nextSetIndex + 1).toString().split('').map(d => {
            const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
            return bengaliNumbers[parseInt(d)];
        }).join('');
        
        nextSetHtml = `
            <div class="next-set-section">
                <h3>🎯 পরবর্তী সেট</h3>
                <p>আপনি সেট ${nextSetNum} খেলতে চান?</p>
                <button onclick="playNextSet()" class="btn btn-primary pulse-btn">
                    <span>সেট ${nextSetNum} খেলুন</span>
                </button>
            </div>
        `;
    } else {
        // All sets completed, start from beginning
        nextSetHtml = `
            <div class="next-set-section">
                <h3>🎉 সব সেট সম্পন্ন!</h3>
                <p>আপনি সব ${questionSets.length}টি সেট সম্পন্ন করেছেন! আবার শুরু করুন?</p>
                <button onclick="restartAllSets()" class="btn btn-primary pulse-btn">
                    <span>আবার শুরু করুন</span>
                </button>
            </div>
        `;
    }
    
    // Add to result screen
    const resultActions = document.querySelector('.result-actions');
    if (resultActions && !document.querySelector('.next-set-section')) {
        resultActions.insertAdjacentHTML('beforebegin', nextSetHtml);
    }
}

// Play next set
function playNextSet() {
    // Reset quiz variables
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    clearInterval(timerInterval);
    
    // Prepare next set
    prepareQuestions();
    
    if (currentQuestions.length === 0) {
        alert('কোনো প্রশ্ন পাওয়া যায়নি!');
        return;
    }
    
    // Start next set
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    
    // Load first question
    loadQuestion();
}

// Restart all sets
function restartAllSets() {
    const userName = studentName || 'default';
    userProgress[userName] = { currentSet: 0, completedSets: [] };
    localStorage.setItem('quizProgress', JSON.stringify(userProgress));
    
    playNextSet();
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
    
    // Remove next set section if exists
    const nextSetSection = document.querySelector('.next-set-section');
    if (nextSetSection) {
        nextSetSection.remove();
    }
    
    // স্ক্রিন রিসেট
    document.getElementById('result-screen').style.display = 'none';
    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'block';
    
    // ফর্ম রিসেট
    document.getElementById('student-name').value = '';
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
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    const setNumber = (currentSetIndex + 1).toString().split('').map(d => bengaliNumbers[parseInt(d)]).join('');
    
    players.push({
        name: studentName,
        score: score,
        total: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        setIndex: currentSetIndex,
        setNumber: setNumber
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
    
    // Sort by percentage in descending order, then by set number in descending order
    const sortedPlayers = players.sort((a, b) => {
        if (b.percentage !== a.percentage) {
            return b.percentage - a.percentage;
        }
        return (b.setIndex || 0) - (a.setIndex || 0);
    });
    
    showDynamicPopup('খেলোয়াড়দের তালিকা', sortedPlayers);
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
                                <div class="player-details">${p.setNumber ? `সেট ${p.setNumber} - ` : ''}${p.date} ${p.time}</div>
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

// Show app updates
function showUpdates() {
    // Check if updates are loaded from external file
    if (typeof appUpdates === 'undefined') {
        alert('আপডেট তথ্য লোড করতে সমস্যা!');
        return;
    }
    
    showUpdatePopup('🔔 অ্যাপ আপডেট', appUpdates);
}

// Show update popup
function showUpdatePopup(title, updates) {
    // Remove existing popup
    const existingPopup = document.getElementById('update-popup');
    if (existingPopup) existingPopup.remove();
    
    // Create popup
    const popup = document.createElement('div');
    popup.id = 'update-popup';
    popup.innerHTML = `
        <div class="popup-overlay">
            <div class="popup-content update-content">
                <div class="popup-header">
                    <h3>${title}</h3>
                    <button class="popup-close" onclick="closeUpdatePopup()">×</button>
                </div>
                <div class="popup-body">
                    ${updates.map(update => `
                        <div class="update-item">
                            <div class="update-header">
                                <span class="update-version">${update.version}</span>
                                <span class="update-date">${update.date}</span>
                            </div>
                            <div class="update-changes">
                                ${update.changes.map(change => `
                                    <div class="change-item">
                                        <span class="change-icon">✓</span>
                                        <span class="change-text">${change}</span>
                                    </div>
                                `).join('')}
                            </div>
                            ${update.newApps ? `
                                <div class="new-apps-section">
                                    <h4>🎆 নতুন অ্যাপ</h4>
                                    ${update.newApps.map(app => `
                                        <div class="app-item">
                                            <div class="app-info">
                                                <span class="app-name">${app.name}</span>
                                                <span class="app-description">${app.description}</span>
                                            </div>
                                            <a href="${app.link}" target="_blank" class="app-link">
                                                <span>খুলুন</span> 🔗
                                            </a>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
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

// Close update popup
function closeUpdatePopup() {
    const popup = document.getElementById('update-popup');
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
    
    // সম্পন্ন সেট লোড করা
    loadCompletedSets();
}

// সম্পন্ন সেট লোড করার ফাংশন
function loadCompletedSets() {
    const userName = document.getElementById('student-name').value.trim() || 'default';
    const progress = userProgress[userName];
    
    if (!progress || progress.currentSet === 0) {
        document.getElementById('set-selector').style.display = 'none';
        return;
    }
    
    const selector = document.getElementById('completed-sets');
    const bengaliNumbers = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    
    // অপশন ক্লিয়ার করা
    selector.innerHTML = '<option value="">একটি সেট বেছে নিন</option>';
    
    // বর্তমান সেট পর্যন্ত সব সেট যোগ করা
    for (let i = 0; i < progress.currentSet; i++) {
        const setNumber = (i + 1).toString().split('').map(d => bengaliNumbers[parseInt(d)]).join('');
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `সেট ${setNumber}`;
        selector.appendChild(option);
    }
    
    document.getElementById('set-selector').style.display = 'block';
}

// নির্বাচিত সেট শুরু করার ফাংশন
function startSelectedSet() {
    const selectedSetIndex = parseInt(document.getElementById('completed-sets').value);
    
    if (isNaN(selectedSetIndex)) {
        alert('দয়া করে একটি সেট বেছে নিন!');
        return;
    }
    
    studentName = document.getElementById('student-name').value.trim();
    
    if (!studentName) {
        alert('দয়া করে আপনার নাম লিখুন!');
        return;
    }
    
    // সেট ইন্ডেক্স সেট করা
    currentSetIndex = selectedSetIndex;
    
    // প্রশ্ন প্রস্তুত করা
    selectedSubject = 'mixed';
    selectedClass = 'all';
    
    if (questionSets.length === 0) {
        initializeQuestionSets();
    }
    
    currentQuestions = questionSets[currentSetIndex] || [];
    totalQuestions = currentQuestions.length;
    
    if (currentQuestions.length === 0) {
        alert('কোনো প্রশ্ন পাওয়া যায়নি!');
        return;
    }
    
    // স্কোর রিসেট
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    subjectScores = {};
    
    // স্ক্রিন পরিবর্তন
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('quiz-screen').style.display = 'block';
    
    // প্রথম প্রশ্ন লোড
    loadQuestion();
}

// Add double-click to footer
document.addEventListener('DOMContentLoaded', function() {
    const footer = document.querySelector('.footer-creator-name');
    if (footer) footer.addEventListener('dblclick', showAllPlayers);
    
    // নাম ইনপুট ইভেন্ট লিসেনার
    const nameInput = document.getElementById('student-name');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            setTimeout(loadCompletedSets, 100);
        });
    }
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
